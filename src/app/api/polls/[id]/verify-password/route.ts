import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getPoll } from '../../../../../services/db/poll';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;

    // @opennextjs/cloudflareが提供するgetCloudflareContext()を使用
    let env: { DB: D1Database };
    try {
      const cloudflareContext = getCloudflareContext();
      env = cloudflareContext.env;
    } catch (contextError) {
      console.error('Error getting Cloudflare context:', contextError);
      return new Response(
        JSON.stringify({
          error: 'Failed to get Cloudflare context',
          details: contextError instanceof Error ? contextError.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!env || !env.DB) {
      console.error('DB not found in context');
      return new Response(
        JSON.stringify({
          error: 'DB not found in context',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body: { password?: string } = await req.json();

    // 投票データを取得
    const result = await getPoll(params.id, env);
    if (!result.success || !result.data) {
      return new Response(
        JSON.stringify({
          error: 'Poll not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const poll = result.data;

    // パスワードが設定されていない場合はエラー
    if (!poll.password) {
      return new Response(
        JSON.stringify({
          error: 'Password is not set for this poll',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // パスワードを検証
    if (body.password !== poll.password) {
      return new Response(
        JSON.stringify({
          error: 'Invalid password',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // パスワードが正しい場合
    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in POST /api/polls/[id]/verify-password:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

