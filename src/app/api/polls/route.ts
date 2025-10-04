import { NextRequest, NextResponse } from 'next/server';
import { pollStore } from '@/lib/pollStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, options, duration = 5, endDate, endTime } = body as {
      title: string;
      options: string[];
      duration?: number;
      endDate?: string | null;
      endTime?: string | null;
    };

    if (!title || !options || options.length < 2) {
      return NextResponse.json({ error: 'Title and at least 2 options are required' }, { status: 400 });
    }

    const pollId = Date.now().toString();
    // 締切日時の計算
    let endDateTime: string | null = null;
    if (endDate && endTime) {
      endDateTime = new Date(`${endDate}T${endTime}`).toISOString();
    }

    const poll = {
      id: pollId,
      title,
      duration: duration, // 締め切り時間（分）を追加
      endDateTime: endDateTime, // 締切日時を追加
      createdBy: Date.now().toString(), // 簡易的な作成者ID（実際は認証から取得）
      options: options.map((url: string, index: number) => ({
        id: index + 1,
        url,
        title: '店舗情報を取得中...',
        description: '説明を取得中...',
        image: null,
        votes: 0,
        voters: [] // 投票者情報を追加
      })),
      createdAt: new Date().toISOString()
    };

    pollStore.savePoll(poll);

    return NextResponse.json(poll);
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const poll = pollStore.getPoll(id);
      if (!poll) {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
      }
      return NextResponse.json(poll);
    }

    return NextResponse.json(pollStore.getAllPolls());
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, options } = body as { id: string; options: any[] };

    const existingPoll = pollStore.getPoll(id);
    if (!existingPoll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const updatedPoll = {
      ...existingPoll,
      options
    };

    pollStore.savePoll(updatedPoll);

    return NextResponse.json(updatedPoll);
  } catch (error) {
    console.error('Error updating poll:', error);
    return NextResponse.json({ error: 'Failed to update poll' }, { status: 500 });
  }
}
