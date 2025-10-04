import { NextRequest, NextResponse } from 'next/server';
import { pollStore } from '@/lib/pollStore';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('投票終了APIが呼び出されました');
    const { id: pollId } = await params;
    console.log('投票終了リクエスト - Poll ID:', pollId);

    // まず投票データが存在するかチェック
    const existingPoll = pollStore.getPoll(pollId);
    console.log('既存の投票データ:', existingPoll);

    if (!existingPoll) {
      console.log('投票が見つかりません');
      return NextResponse.json(
        { error: '投票が見つかりません' },
        { status: 404 }
      );
    }

    // 投票を終了状態に更新
    const updatedPoll = pollStore.closePoll(pollId);
    console.log('更新後の投票データ:', updatedPoll);

    return NextResponse.json({
      success: true,
      message: '投票が終了しました',
      poll: updatedPoll
    });

  } catch (error) {
    console.error('投票終了エラー:', error);
    return NextResponse.json(
      { error: '投票の終了に失敗しました' },
      { status: 500 }
    );
  }
}
