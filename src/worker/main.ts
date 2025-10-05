import { handleWorkerDBRequest } from './routes';

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/worker/db/')) {
      return await handleWorkerDBRequest(request, env);
    }

    // NOTE: Worker は D1 専用の API として使用するため、他のルートは 404 を返す
    return new Response('Not Found', { status: 404 });
  }
};

