import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createContact } from '../../../services/db/contact';
import { contactSchema } from '@/lib/schemas/contact';

export async function POST(req: Request) {
  try {
    // Cloudflare contextを取得
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
        JSON.stringify({
          error: 'DB not found in context',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.json();

    // Zodスキーマでバリデーション
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return new Response(
        JSON.stringify({
          error: firstError?.message || 'バリデーションエラー',
          details: validationResult.error.issues,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // バリデーション済みデータを使用
    const result = await createContact(
      {
        name: validationResult.data.name.trim(),
        email: validationResult.data.email.trim(),
        subject: validationResult.data.subject.trim(),
        message: validationResult.data.message.trim(),
      },
      env
    );

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.error || 'Failed to create contact',
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
        contact: result.data,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in POST /api/contact:', error);
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

