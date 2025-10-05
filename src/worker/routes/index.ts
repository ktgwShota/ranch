import { Database } from '../services/database';
import { handlePollRoutes } from './polls';
import { createErrorResponse } from '../utils/cors';

/**
 * ルートハンドラー
 */
export async function handleWorkerDBRequest(request: Request, env: any): Promise<Response> {
  const db = new Database(env.DB);
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // OPTIONS リクエストの処理
  if (method === 'OPTIONS') {
    const { createCorsResponse } = await import('../utils/cors');
    return createCorsResponse();
  }

  try {
    let result: any;

    // パスに基づいてルーティング
    if (path.startsWith('/worker/db/polls')) {
      result = await handlePollRoutes(request, db, path, method);
    } else if (path === '/worker/db/health') {
      result = await db.testConnection();
    } else {
      return createErrorResponse('Not found', 404);
    }

    // 結果を返す
    const { createSuccessResponse } = await import('../utils/cors');
    return createSuccessResponse(result);

  } catch (error) {
    console.error('Error handling Worker DB request:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
