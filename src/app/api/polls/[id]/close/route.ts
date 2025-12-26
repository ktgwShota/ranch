import { getCloudflareContext } from '@opennextjs/cloudflare';
import { closePoll } from '../../../../../services/db/poll';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;

    // @opennextjs/cloudflareが提供するgetCloudflareContext()を使用
    let env: { DB: D1Database };
    try {
      const cloudflareContext = getCloudflareContext();
      env = cloudflareContext.env;
      console.log('Environment retrieved for POST close:', !!env?.DB);
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

    const result = await closePoll(params.id, env);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.error || 'Failed to close poll',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result.data,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in POST /api/polls/[id]/close:', error);
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
