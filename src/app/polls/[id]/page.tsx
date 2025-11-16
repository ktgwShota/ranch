import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getPoll } from '@/services/db/poll';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import VotingPage from './components/VotingPage';
import { ResultPage } from './components/ResultPage';
import { Box } from '@mui/material';
import { DBPoll, DBPollOption } from '@/services/db/poll/types';

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
    const isClosed = pollData.isClosed === 1;
    const structuredData = generateStructuredData(pollData);
    const totalVotes = calculateTotalVotes(pollData);
    const winningOption = getWinningOption(pollData);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <Box sx={{ maxWidth: '900px', mx: 'auto', py: { xs: 2, sm: 2.5 }, px: { xs: 2, sm: 2.5 }, boxSizing: 'border-box' }}>
          {isClosed ? (
            <ResultPage poll={pollData} totalVotes={totalVotes} winningOption={winningOption} />
          ) : (
            <VotingPage pollId={id} initialPoll={pollData} />
          )}
        </Box>
      </>
    );
  } catch (error) {
    console.error('Error fetching poll data:', error);
    redirect('/404');
  }
}

/**
 * 総投票数を計算
 */
function calculateTotalVotes(poll: DBPoll): number {
  return poll.options.reduce((sum, option) => sum + option.votes, 0);
}

/**
 * 最多得票の選択肢を取得
 */
function getWinningOption(poll: DBPoll): DBPollOption | null {
  if (poll.options.length === 0) return null;
  return poll.options.reduce((max, option) =>
    option.votes > max.votes ? option : max, poll.options[0]
  );
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
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: '投票が見つかりません | チョイスル',
    };
  }

  try {
    const context = getCloudflareContext();
    const result = await getPoll(id, context.env);

    if (!result.success || !result.data) {
      return {
        title: '投票が見つかりません | チョイスル',
      };
    }

    const poll = result.data;
    const isClosed = poll.isClosed === 1;
    const totalVotes = calculateTotalVotes(poll);
    const winningOption = getWinningOption(poll);

    const title = `${poll.title} | チョイスル`;
    const description = isClosed
      ? `投票結果: ${poll.title}。総投票数: ${totalVotes}票。${winningOption ? `最多得票: ${winningOption.title}` : ''}`
      : `${poll.title}の投票ページ。${poll.options.length}つの選択肢から選んで投票できます。`;

    return {
      title,
      description,
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
      title: '投票ページ | チョイスル',
    };
  }
}
