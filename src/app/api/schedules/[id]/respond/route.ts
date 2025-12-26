import { getCloudflareContext } from '@opennextjs/cloudflare';
import { respondToSchedule, updateResponse, deleteResponse } from '../../../../../services/db/schedule';
import type { AvailabilityStatus } from '../../../../../services/db/schedule/types';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params;

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

    const body: {
      respondentId?: string;
      name?: string;
      availability?: { [key: string]: AvailabilityStatus };
    } = await req.json();

    // バリデーション
    if (!body.respondentId) {
      return new Response(
        JSON.stringify({ error: 'respondentId is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!body.name) {
      return new Response(
        JSON.stringify({ error: 'name is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!body.availability) {
      return new Response(
        JSON.stringify({ error: 'availability is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await respondToSchedule(
      {
        scheduleId,
        respondentId: body.respondentId,
        name: body.name,
        availability: body.availability,
      },
      env
    );

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to submit response' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, responseId: result.data?.id }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in POST /api/schedules/[id]/respond:', error);
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params;

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

    const body: {
      respondentId?: string;
      name?: string;
      availability?: { [key: string]: AvailabilityStatus };
    } = await req.json();

    // バリデーション
    if (!body.respondentId) {
      return new Response(
        JSON.stringify({ error: 'respondentId is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await updateResponse(
      {
        scheduleId,
        respondentId: body.respondentId,
        name: body.name,
        availability: body.availability,
      },
      env
    );

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to update response' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in PUT /api/schedules/[id]/respond:', error);
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
    const { id: scheduleId } = await params;
    const { searchParams } = new URL(req.url);
    const respondentId = searchParams.get('respondentId');

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

    if (!respondentId) {
      return new Response(
        JSON.stringify({ error: 'respondentId is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await deleteResponse(scheduleId, respondentId, env);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to delete response' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in DELETE /api/schedules/[id]/respond:', error);
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

