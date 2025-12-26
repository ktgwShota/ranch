import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getContacts, getContact, markAsRead } from '../../../services/db/contact';

export async function GET(req: Request) {
  try {
    const context = getCloudflareContext();
    const env = context.env;

    if (!env || !env.DB) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const isRead = searchParams.get('isRead');

    // 特定のIDが指定されている場合
    if (id) {
      const result = await getContact(Number(id), env);
      if (!result.success) {
        return new Response(
          JSON.stringify({
            error: result.error || 'Contact not found',
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      return new Response(
        JSON.stringify({
          contact: result.data,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 一覧取得
    const result = await getContacts(env, {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.error || 'Failed to get contacts',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        contacts: result.data || [],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in GET /api/contacts:', error);
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

export async function PUT(req: Request) {
  try {
    const context = getCloudflareContext();
    const env = context.env;

    if (!env || !env.DB) {
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
      id?: number;
      action?: 'markAsRead';
    } = await req.json();

    if (!body.id || !body.action) {
      return new Response(
        JSON.stringify({
          error: 'id and action are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (body.action === 'markAsRead') {
      const result = await markAsRead(body.id, env);
      if (!result.success) {
        return new Response(
          JSON.stringify({
            error: result.error || 'Failed to mark as read',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({
          contact: result.data,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Invalid action',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in PUT /api/contacts:', error);
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

