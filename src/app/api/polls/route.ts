import { NextRequest, NextResponse } from 'next/server';

// 簡単なメモリ内ストレージ（本番環境ではデータベースを使用）
let polls: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { title, options } = await request.json();

    if (!title || !options || options.length < 2) {
      return NextResponse.json({ error: 'Title and at least 2 options are required' }, { status: 400 });
    }

    const pollId = Date.now().toString();
    const poll = {
      id: pollId,
      title,
      options: options.map((url: string, index: number) => ({
        id: index + 1,
        url,
        title: '店舗情報を取得中...',
        description: '説明を取得中...',
        image: null,
        votes: 0
      })),
      createdAt: new Date().toISOString()
    };

    polls.push(poll);

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
      const poll = polls.find(p => p.id === id);
      if (!poll) {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
      }
      return NextResponse.json(poll);
    }

    return NextResponse.json(polls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, options } = await request.json();

    const pollIndex = polls.findIndex(p => p.id === id);
    if (pollIndex === -1) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    polls[pollIndex] = {
      ...polls[pollIndex],
      options
    };

    return NextResponse.json(polls[pollIndex]);
  } catch (error) {
    console.error('Error updating poll:', error);
    return NextResponse.json({ error: 'Failed to update poll' }, { status: 500 });
  }
}
