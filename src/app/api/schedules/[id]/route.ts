import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getSchedule, deleteSchedule, closeSchedule, reopenSchedule } from '../../../../services/db/schedule';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Cloudflare環境を取得
    let env: { DB: D1Database };
    try {
      const context = getCloudflareContext();
      env = context.env;
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
      return new Response(
        JSON.stringify({ error: 'DB not found in context' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await getSchedule(id, env);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Schedule not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify(result.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/schedules/[id]:', error);
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Cloudflare環境を取得
    let env: { DB: D1Database };
    try {
      const context = getCloudflareContext();
      env = context.env;
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
      return new Response(
        JSON.stringify({ error: 'DB not found in context' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await deleteSchedule(id, env);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to delete schedule' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in DELETE /api/schedules/[id]:', error);
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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: { action?: string; confirmedDateTime?: string } = await req.json();

    // Cloudflare環境を取得
    let env: { DB: D1Database };
    try {
      const context = getCloudflareContext();
      env = context.env;
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
      return new Response(
        JSON.stringify({ error: 'DB not found in context' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (body.action === 'close') {
      if (!body.confirmedDateTime) {
        return new Response(
          JSON.stringify({ error: '確定する日程を選択してください' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const result = await closeSchedule(id, env, body.confirmedDateTime);

      if (!result.success) {
        return new Response(
          JSON.stringify({ error: result.error || 'Failed to close schedule' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (body.action === 'reopen') {
      const result = await reopenSchedule(id, env);

      if (!result.success) {
        return new Response(
          JSON.stringify({ error: result.error || 'Failed to reopen schedule' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in PATCH /api/schedules/[id]:', error);
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

