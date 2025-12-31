import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
// import { LAYOUT_CONSTANTS } from '@/config/constants';
import type { ParsedPoll } from '@/db/core/types';
import { getPoll } from '@/db/services/poll';
import PollPage from './components/PollPage';
import { calculateTotalVotes, getWinningOption, ResultPage } from './components/ResultPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  if (!id) {
    redirect('/404');
  }

  try {
    const result = await getPoll(id);
    if (!result.success || !result.data) {
      redirect('/404');
    }

    const pollData = result.data;

    if (!pollData.isClosed && pollData.endDateTime) {
      const endTime = new Date(pollData.endDateTime).getTime();
      if (endTime <= Date.now()) {
        const { closePoll } = await import('@/db/services/poll');
        await closePoll(id);
        // NOTE: 投票受付を締め切った後に再度データを取得するのは非効率なので直接 isClosed を更新する
        // pollData.isClosed = 1; // isClosed is boolean now
        pollData.isClosed = true;
      }
    }

    const structuredData = generateStructuredData(pollData);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {pollData.isClosed ? <ResultPage pollData={pollData} /> : <PollPage pollData={pollData} />}
      </>
    );
  } catch (_error) {
    redirect('/404');
  }
}

/**
 * 構造化データ（JSON-LD）を生成
 */
function generateStructuredData(poll: ParsedPoll) {
  const isClosed = poll.isClosed;
  const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  const winningOption =
    poll.options.length > 0
      ? poll.options.reduce(
          (max, option) => ((option.votes || 0) > (max.votes || 0) ? option : max),
          poll.options[0]
        )
      : null;

  return {
    '@context': 'https://schema.org',
    '@type': 'VoteAction',
    name: poll.title,
    description: isClosed
      ? `投票結果: ${poll.title}。総投票数: ${totalVotes}票。`
      : `${poll.title}の投票ページ`,
    ...(isClosed &&
      winningOption && {
        result: {
          '@type': 'Thing',
          name: winningOption.title || winningOption.url,
          description: `最多得票: ${winningOption.votes || 0}票`,
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
    const result = await getPoll(id);

    if (!result.success || !result.data) {
      return {
        title: '投票が見つかりません',
      };
    }

    const poll = result.data;
    const isClosed = poll.isClosed;
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
