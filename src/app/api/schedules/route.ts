import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createSchedule, getSchedules } from '../../../services/db/schedule';

export async function POST(req: Request) {
  try {
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
      title?: string;
      dates?: Array<{ date: string; times: string[] }>;
      endDate?: string | null;
      endTime?: string | null;
      createdBy?: string;
    } = await req.json();

    // バリデーション
    if (!body.title) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!body.dates || body.dates.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one date is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // endDateTimeを計算
    // endTimeが未設定の場合は23:59をデフォルト値として使用
    let endDateTime: string | null = null;
    if (body.endDate) {
      const endTime = body.endTime || '23:59';
      endDateTime = new Date(`${body.endDate}T${endTime}`).toISOString();
    }

    const result = await createSchedule(
      {
        title: body.title,
        dates: body.dates,
        endDateTime,
        createdBy: body.createdBy || Date.now().toString(),
      },
      env
    );

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to create schedule' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        schedule: { id: result.data?.id },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in POST /api/schedules:', error);
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

export async function GET() {
  try {
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

    const result = await getSchedules(env);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to fetch schedules' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify(result.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/schedules:', error);
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

