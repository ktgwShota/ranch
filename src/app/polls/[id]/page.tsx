import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getPoll } from '@/services/db/poll';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import PollPage from './components/PollPage';
import { ResultPage, calculateTotalVotes, getWinningOption } from './components/ResultPage';
import { Box } from '@mui/material';
import type { DBPoll } from '@/services/db/poll/types';
import { LAYOUT_CONSTANTS } from '@/config/constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  if (!id) {
    redirect('/404');
  }

  try {
    const context = getCloudflareContext();
    const result = await getPoll(id, context.env);
    if (!result.success || !result.data) {
      redirect('/404');
    }

    const pollData = result.data;

    if (pollData.isClosed === 0 && pollData.endDateTime) {
      const endTime = new Date(pollData.endDateTime).getTime();
      if (endTime <= Date.now()) {
        const { closePoll } = await import('@/services/db/poll');
        await closePoll(id, context.env);
        // NOTE: 投票受付を締め切った後に再度データを取得するのは非効率なので直接 isClosed を更新する
        pollData.isClosed = 1;
      }
    }

    const structuredData = generateStructuredData(pollData);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <>
          {pollData.isClosed === 1 ? (
            <ResultPage pollData={pollData} />
          ) : (
            <PollPage pollData={pollData} />
          )}
        </>
      </>
    );
  } catch (error) {
    redirect('/404');
  }
}


/**
 * 構造化データ（JSON-LD）を生成
 */
function generateStructuredData(poll: DBPoll) {
  const isClosed = poll.isClosed === 1;
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const winningOption = poll.options.length > 0
    ? poll.options.reduce((max, option) =>
      option.votes > max.votes ? option : max, poll.options[0]
    )
    : null;

  return {
    '@context': 'https://schema.org',
    '@type': 'VoteAction',
    name: poll.title,
    description: isClosed
      ? `投票結果: ${poll.title}。総投票数: ${totalVotes}票。`
      : `${poll.title}の投票ページ`,
    ...(isClosed && winningOption && {
      result: {
        '@type': 'Thing',
        name: winningOption.title || winningOption.url,
        description: `最多得票: ${winningOption.votes}票`,
      },
    }),
    object: poll.options.map((option) => ({
      '@type': 'Thing',
      name: option.title || option.url,
      url: option.url,
      ...(option.image && { image: option.image }),
    })),
  };
}

// 動的メタデータを生成
// 動的メタデータを生成
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: '投票が見つかりません',
    };
  }

  try {
    const context = getCloudflareContext();
    const result = await getPoll(id, context.env);

    if (!result.success || !result.data) {
      return {
        title: '投票が見つかりません',
      };
    }

    const poll = result.data;
    const isClosed = poll.isClosed === 1;
    const totalVotes = calculateTotalVotes(poll);
    const winningOption = getWinningOption(poll);

    const title = poll.title;
    const description = isClosed
      ? `投票結果: ${poll.title}。総投票数: ${totalVotes}票。${winningOption ? `最多得票: ${winningOption.title}` : ''}`
      : `${poll.title}の投票ページ。${poll.options.length}つの選択肢から選んで投票できます。`;

    // ★★★ 条件を外して、すべての動的ページで noindex を設定 ★★★
    const robotsSetting: Metadata['robots'] = {
      index: false, // 無条件で noindex
      follow: true,
    };

    return {
      title,
      description,
      // ★★★ robots設定を無条件で追加 ★★★
      robots: robotsSetting,
      openGraph: {
        title,
        description,
        type: 'website',
        ...(winningOption?.image && { images: [winningOption.image] }),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(winningOption?.image && { images: [winningOption.image] }),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '投票ページ',
    };
  }
}