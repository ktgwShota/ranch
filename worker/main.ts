import { Database } from './db';
import { CreatePollData, UpdatePollData, VoteData } from './types';

/**
 * Cloudflare Worker のメインハンドラー
 * 最小限の構成でデータベース操作のみを提供
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
 * Worker DB API のリクエストを処理
 */
async function handleWorkerDBRequest(request: Request, env: any): Promise<Response> {
  const db = new Database(env.DB);
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // CORS ヘッダーを設定
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // OPTIONS リクエストの処理
  if (method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    let result: any;

    // パスに基づいてルーティング
    if (path.startsWith('/worker/db/polls')) {
      result = await handlePollRoutes(request, db, path, method);
    } else if (path === '/worker/db/health') {
      result = await db.testConnection();
    } else {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // 結果を返す
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('Error handling Worker DB request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

/**
 * 投票関連のルーティング
 */
async function handlePollRoutes(request: Request, db: Database, path: string, method: string) {
  if (path === '/worker/db/polls' && method === 'POST') {
    const body: CreatePollData = await request.json();
    return await db.createPoll(body);
  } else if (path === '/worker/db/polls' && method === 'GET') {
    return await db.getAllPolls();
  } else if (path.match(/^\/worker\/db\/polls\/([^\/]+)$/) && method === 'GET') {
    const pollId = path.split('/')[4];
    return await db.getPollById(pollId);
  } else if (path.match(/^\/worker\/db\/polls\/([^\/]+)$/) && method === 'PUT') {
    const pollId = path.split('/')[4];
    const body: UpdatePollData = await request.json();
    body.id = pollId;
    return await db.updatePoll(body);
  } else if (path.match(/^\/worker\/db\/polls\/([^\/]+)\/votes$/) && method === 'POST') {
    const pollId = path.split('/')[4];
    const body: { optionId: number; voterId: string } = await request.json();
    return await db.recordVote({
      pollId,
      optionId: body.optionId,
      voterId: body.voterId
    });
  } else if (path.match(/^\/worker\/db\/polls\/([^\/]+)\/close$/) && method === 'POST') {
    const pollId = path.split('/')[4];
    return await db.closePoll(pollId);
  } else {
    throw new Error('Method not allowed');
  }
}

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