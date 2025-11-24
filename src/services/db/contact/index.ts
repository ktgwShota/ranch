import { getDB } from '../client';
import { type ContactData, type DBContact, type DBResult } from './types';

export async function createContact(
  data: ContactData,
  env: { DB: D1Database }
): Promise<DBResult<DBContact>> {
  try {
    const db = getDB(env);

    const result = await db
      .prepare(
        `INSERT INTO contacts (name, email, subject, message, isRead, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        data.name,
        data.email,
        data.subject,
        data.message,
        0, // isRead = 0 (未読)
        new Date().toISOString()
      )
      .run();

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to create contact',
      };
    }

    // 作成されたレコードを取得
    const contact = await db
      .prepare('SELECT * FROM contacts WHERE id = ?')
      .bind(result.meta.last_row_id)
      .first<DBContact>();

    if (!contact) {
      return {
        success: false,
        error: 'Failed to retrieve created contact',
      };
    }

    return {
      success: true,
      data: contact,
    };
  } catch (error) {
    console.error('Error creating contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getContacts(
  env: { DB: D1Database },
  options?: {
    limit?: number;
    offset?: number;
    isRead?: boolean;
  }
): Promise<DBResult<DBContact[]>> {
  try {
    const db = getDB(env);

    let query = 'SELECT * FROM contacts';
    const conditions: string[] = [];
    const bindings: any[] = [];

    if (options?.isRead !== undefined) {
      conditions.push('isRead = ?');
      bindings.push(options.isRead ? 1 : 0);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY createdAt DESC';

    if (options?.limit) {
      query += ' LIMIT ?';
      bindings.push(options.limit);
    }

    if (options?.offset) {
      query += ' OFFSET ?';
      bindings.push(options.offset);
    }

    const stmt = db.prepare(query);
    if (bindings.length > 0) {
      stmt.bind(...bindings);
    }

    const result = await stmt.all<DBContact>();

    return {
      success: true,
      data: result.results || [],
    };
  } catch (error) {
    console.error('Error getting contacts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getContact(
  id: number,
  env: { DB: D1Database }
): Promise<DBResult<DBContact>> {
  try {
    const db = getDB(env);

    const contact = await db
      .prepare('SELECT * FROM contacts WHERE id = ?')
      .bind(id)
      .first<DBContact>();

    if (!contact) {
      return {
        success: false,
        error: 'Contact not found',
      };
    }

    return {
      success: true,
      data: contact,
    };
  } catch (error) {
    console.error('Error getting contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function markAsRead(
  id: number,
  env: { DB: D1Database }
): Promise<DBResult<DBContact>> {
  try {
    const db = getDB(env);

    await db
      .prepare('UPDATE contacts SET isRead = 1 WHERE id = ?')
      .bind(id)
      .run();

    const contact = await db
      .prepare('SELECT * FROM contacts WHERE id = ?')
      .bind(id)
      .first<DBContact>();

    if (!contact) {
      return {
        success: false,
        error: 'Contact not found after update',
      };
    }

    return {
      success: true,
      data: contact,
    };
  } catch (error) {
    console.error('Error marking contact as read:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

