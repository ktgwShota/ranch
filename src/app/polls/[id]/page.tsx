import { notFound } from 'next/navigation';
import { getPollData } from './lib/getPollData';
import { PollPageClient } from './components/PollPageClient';

interface PollPageProps {
  params: Promise<{ id: string }>;
}

export default async function PollPage({ params }: PollPageProps) {
  const { id: pollId } = await params;
  const poll = await getPollData(pollId);

  if (!poll) {
    notFound();
  }

  return <PollPageClient initialPoll={poll} pollId={pollId} />;
}
