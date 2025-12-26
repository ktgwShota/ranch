import { getCloudflareContext } from '@opennextjs/cloudflare';
import { votePoll } from '../../../../../services/db/poll';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;

    // @opennextjs/cloudflareが提供するgetCloudflareContext()を使用
    let env: { DB: D1Database };
    try {
      const cloudflareContext = getCloudflareContext();
      env = cloudflareContext.env;
      console.log('Environment retrieved for POST votes:', !!env?.DB);
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

    const body: {
      optionId?: number;
      voterId?: string;
      voterName?: string;
    } = await req.json();
    const { optionId, voterId, voterName } = body;

    if (!optionId || !voterId || !voterName) {
      return new Response(
        JSON.stringify({
          error: 'optionId, voterId, and voterName are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await votePoll(
      {
        pollId: params.id,
        optionId,
        voterId,
        voterName,
      },
      env
    );

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.error || 'Failed to vote',
        }),
        {
          status: result.error === 'Option not found' ? 404 : 400,
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
    console.error('Error in POST /api/polls/[id]/votes:', error);
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
