import { handleWorkerDBRequest } from './routes';

/**
 * Cloudflare Worker のメインハンドラー
 */
export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Worker DB API のルーティング
    if (url.pathname.startsWith('/worker/db/')) {
      return await handleWorkerDBRequest(request, env);
    }

    // 既存のNext.jsアプリケーションの処理
    return await handleNextJSRequest(request, env, ctx);
  }
};

/**
 * Next.jsアプリケーションのリクエストを処理
 */
async function handleNextJSRequest(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
  try {
    // OpenNextのWorkerロジックを動的にインポート
    const { default: nextWorker } = await import('../.open-next/worker.js');
    return await nextWorker.fetch(request, env, ctx);
  } catch (error) {
    console.error('Error handling Next.js request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}