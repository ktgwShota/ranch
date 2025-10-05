import { callWorkerAPI, createErrorResponse, createSuccessResponse } from '@/libs/api-helpers';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pollId } = await params;
    console.log('投票終了リクエスト - Poll ID:', pollId);

    // Worker API で投票終了
    const workerResult = await callWorkerAPI(`/worker/db/polls/${pollId}/close`);

    if (!workerResult.success) {
      console.error('投票終了に失敗:', workerResult.error);
      return createErrorResponse(workerResult.error || '投票の終了に失敗しました', 404);
    }

    console.log('投票終了成功:', workerResult.data);
    return createSuccessResponse(workerResult.data);

  } catch (error) {
    console.error('投票終了エラー:', error);
    return createErrorResponse('投票の終了に失敗しました');
  }
}
