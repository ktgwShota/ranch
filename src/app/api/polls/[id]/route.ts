import { callWorkerAPI, createErrorResponse, createSuccessResponse } from '@/lib/api-helpers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pollId } = await params;

    // Worker API で投票を取得
    const workerResult = await callWorkerAPI(`/worker/db/polls/${pollId}`);

    if (!workerResult.success) {
      return createErrorResponse(workerResult.error || '投票が見つかりません', 404);
    }

    return createSuccessResponse(workerResult.data);
  } catch (error) {
    console.error('Error fetching poll:', error);
    return createErrorResponse("Failed to fetch poll");
  }
}