import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createPoll, getPolls } from '../../../lib/db';

export async function POST(req: Request) {
  try {
    console.log('POST /api/polls called');

    // @opennextjs/cloudflareが提供するgetCloudflareContext()を使用
    let env: { DB: D1Database };
    try {
      const context = getCloudflareContext();
      env = context.env;
      console.log('Environment retrieved:', !!env);
      console.log('DB binding:', !!env?.DB);
    } catch (contextError) {
      console.error('Error getting Cloudflare context:', contextError);
      return new Response(JSON.stringify({
        error: 'Failed to get Cloudflare context',
        details: contextError instanceof Error ? contextError.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!env || !env.DB) {
      console.error('DB not found in context');
      return new Response(JSON.stringify({
        error: 'DB not found in context'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await req.json() as {
      title: string;
      options: string[] | Array<{ url: string; title?: string; description?: string; image?: string }>;
      duration?: number;
      endDate?: string | null;
      endTime?: string | null;
      createdBy?: string;
    };

    if (!body.title || !body.options || body.options.length < 2) {
      return new Response(JSON.stringify({
        error: 'Title and at least 2 options are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // optionsが文字列配列の場合とオブジェクト配列の場合の両方に対応
    const options = body.options.map(opt => {
      if (typeof opt === 'string') {
        return {
          url: opt,
          title: '店舗情報を取得中...',
          description: '説明を取得中...',
          image: undefined
        };
      } else {
        return {
          url: opt.url,
          title: opt.title || '店舗情報を取得中...',
          description: opt.description || '説明を取得中...',
          image: opt.image
        };
      }
    });

    // endDateとendTimeからendDateTimeを計算
    let endDateTime: string | null = null;
    if (body.endDate && body.endTime) {
      endDateTime = new Date(`${body.endDate}T${body.endTime}`).toISOString();
    }

    const result = await createPoll({
      title: body.title,
      options,
      duration: body.duration || 5,
      endDateTime: endDateTime,
      createdBy: body.createdBy || Date.now().toString()
    }, env);

    if (!result.success) {
      return new Response(JSON.stringify({
        error: result.error || 'Failed to create poll'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // フロントエンドが期待する形式に合わせる
    return new Response(JSON.stringify({
      poll: {
        id: result.data?.id
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in POST /api/polls:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(req: Request) {
  try {
    console.log('GET /api/polls called');

    // @opennextjs/cloudflareが提供するgetCloudflareContext()を使用
    let env: { DB: D1Database };
    try {
      const context = getCloudflareContext();
      env = context.env;
      console.log('Environment retrieved for GET:', !!env?.DB);
    } catch (contextError) {
      console.error('Error getting Cloudflare context:', contextError);
      return new Response(JSON.stringify({
        error: 'Failed to get Cloudflare context',
        details: contextError instanceof Error ? contextError.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!env || !env.DB) {
      console.error('DB not found in context');
      return new Response(JSON.stringify({
        error: 'DB not found in context'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await getPolls(env);

    if (!result.success) {
      return new Response(JSON.stringify({
        error: result.error || 'Failed to fetch polls'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(result.data), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/polls:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}