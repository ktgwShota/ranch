import { callWorkerAPI, createErrorResponse, createSuccessResponse, WORKER_BASE_URL } from '@/libs/api-helpers';

// 型定義
interface CreatePollRequest {
  title: string;
  options: string[];
  duration?: number;
  endDate?: string | null;
  endTime?: string | null;
}

interface EnrichedOption {
  id: number;
  url: string;
  title: string;
  description: string;
  image?: string | null;
}

interface OGPData {
  title?: string;
  description?: string;
  image?: string;
}

// 定数
const NEXT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function fetchOGPData(url: string): Promise<OGPData> {
  try {
    const response = await fetch(`${NEXT_BASE_URL}/api/ogp?url=${encodeURIComponent(url)}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching OGP for URL:', url, error);
    return {};
  }
}

async function enrichOptions(options: string[]): Promise<EnrichedOption[]> {
  return Promise.all(
    options.map(async (url, index) => {
      const ogpData = await fetchOGPData(url);
      return {
        id: index + 1,
        url,
        title: ogpData.title || '店舗情報を取得中...',
        description: ogpData.description || '説明を取得中...',
        image: ogpData.image || null,
      };
    })
  );
}

function calculateEndDateTime(endDate?: string | null, endTime?: string | null): string | null {
  if (!endDate || !endTime) return null;
  return new Date(`${endDate}T${endTime}`).toISOString();
}


export async function POST(request: Request) {
  try {
    const body: CreatePollRequest = await request.json();
    const { title, options, duration = 5, endDate, endTime } = body;

    // バリデーション
    if (!title || !options || options.length < 2) {
      return createErrorResponse('Title and at least 2 options are required', 400);
    }

    // データ準備
    const pollId = Date.now().toString();
    const endDateTime = calculateEndDateTime(endDate, endTime);
    const createdAt = new Date().toISOString();
    const createdBy = Date.now().toString();
    const enrichedOptions = await enrichOptions(options);

    // Worker API で投票作成
    const workerResult = await callWorkerAPI('/worker/db/polls', 'POST', {
      id: pollId,
      title,
      duration,
      endDateTime,
      createdBy,
      createdAt,
      isClosed: 0,
      options: enrichedOptions,
    });

    if (!workerResult.success) {
      console.error('Failed to create poll:', workerResult.error);
      return createErrorResponse('投票の作成に失敗しました', 500);
    }

    return createSuccessResponse({
      success: true,
      message: '投票が正常に作成されました',
      poll: workerResult.data
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    return createErrorResponse("Failed to create poll");
  }
}


interface UpdatePollRequest {
  id: string;
  options: EnrichedOption[];
}

export async function PUT(request: Request) {
  try {
    const body: UpdatePollRequest = await request.json();
    const { id, options } = body;

    // バリデーション
    if (!id || !options) {
      return createErrorResponse('ID and options are required', 400);
    }

    // Worker API で投票更新
    const workerResult = await callWorkerAPI(`/worker/db/polls/${id}`, 'PUT', { id, options });

    if (!workerResult.success) {
      return createErrorResponse(workerResult.error || '投票の更新に失敗しました', 500);
    }

    return createSuccessResponse(workerResult.data);
  } catch (error) {
    console.error('Error updating poll:', error);
    return createErrorResponse("Failed to update poll");
  }
}