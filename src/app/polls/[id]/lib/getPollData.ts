import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getPoll } from '@/services/db/poll';
import type { Poll } from '../types';

export async function getPollData(pollId: string): Promise<Poll | null> {
  try {
    const context = getCloudflareContext();
    const env = context.env as { DB: D1Database };

    if (!env || !env.DB) {
      console.error('DB not found in context');
      return null;
    }

    const result = await getPoll(pollId, env);

    if (!result.success || !result.data) {
      return null;
    }

    const pollData = result.data as any;
    const poll: Poll = {
      id: pollData.id,
      title: pollData.title,
      duration: pollData.duration,
      endDateTime: pollData.endDateTime,
      createdAt: pollData.createdAt,
      createdBy: pollData.createdBy,
      isClosed: pollData.isClosed === 1,
      options: pollData.options || [],
    };

    // DBから取得したOGPデータを使用（再取得しない）
    // 既にDBに保存されているtitleとimageを使用
    return poll;
  } catch (error) {
    console.error('Error fetching poll data:', error);
    return null;
  }
}

