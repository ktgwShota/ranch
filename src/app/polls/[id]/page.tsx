import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getPoll } from '@/services/db/poll';
import { redirect } from 'next/navigation';
import PageClient from './components/PageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  if (!id) return null;

  try {
    const context = getCloudflareContext();
    const result = await getPoll(id, context.env);
    if (!result.success || !result.data) {
      return null;
    }

    return <PageClient initialPoll={result.data} pollId={id} />;
  } catch (error) {
    console.error('Error fetching poll data:', error);
    redirect('/404');
  }
}
