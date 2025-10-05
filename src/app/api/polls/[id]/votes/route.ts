import { callWorkerAPI, createErrorResponse, createSuccessResponse } from '@/libs/api-helpers';

// 型定義
interface VoteRequest {
  optionId: number;
  voterId: string;
  voterName: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pollId } = await params;
    const body: VoteRequest = await request.json();
    const { optionId, voterId, voterName } = body;

    // バリデーション
    if (!optionId || !voterId || !voterName) {
      return createErrorResponse('Option ID, Voter ID, and Voter Name are required', 400);
    }

    // Worker API で投票を記録
    const workerResult = await callWorkerAPI(`/worker/db/polls/${pollId}/votes`, 'POST', { optionId, voterId, voterName });

    if (!workerResult.success) {
      return createErrorResponse(workerResult.error || '投票の記録に失敗しました', 400);
    }

    return createSuccessResponse(workerResult.data);

  } catch (error) {
    console.error('Error recording vote:', error);
    return createErrorResponse("Failed to record vote");
  }
}
