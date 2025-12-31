import { desc, eq } from 'drizzle-orm';
import { getDrizzle } from '../core/drizzle';
import { contacts } from '../core/schema';
import type { Contact, DBResult } from '../core/types';

export async function createContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<DBResult<Contact>> {
  try {
    const db = getDrizzle();

    const result = await db
      .insert(contacts)
      .values({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        isRead: false,
        createdAt: new Date().toISOString(),
      })
      .returning()
      .get();

    return {
      success: true,
      data: result as Contact,
    };
  } catch (error) {
    console.error('Error creating contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getContacts(options?: {
  limit?: number;
  offset?: number;
  isRead?: boolean;
}): Promise<DBResult<Contact[]>> {
  try {
    const db = getDrizzle();

    let query = db.select().from(contacts).orderBy(desc(contacts.createdAt)).$dynamic();

    if (options?.isRead !== undefined) {
      query = query.where(eq(contacts.isRead, options.isRead));
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const result = await query;

    return {
      success: true,
      data: result as Contact[],
    };
  } catch (error) {
    console.error('Error getting contacts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getContact(id: number): Promise<DBResult<Contact>> {
  try {
    const db = getDrizzle();

    const contact = await db.select().from(contacts).where(eq(contacts.id, id)).get();

    if (!contact) {
      return {
        success: false,
        error: 'Contact not found',
      };
    }

    return {
      success: true,
      data: contact as Contact,
    };
  } catch (error) {
    console.error('Error getting contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function markAsRead(id: number): Promise<DBResult<Contact>> {
  try {
    const db = getDrizzle();

    const contact = await db
      .update(contacts)
      .set({ isRead: true })
      .where(eq(contacts.id, id))
      .returning()
      .get();

    if (!contact) {
      return {
        success: false,
        error: 'Contact not found after update',
      };
    }

    return {
      success: true,
      data: contact as Contact,
    };
  } catch (error) {
    console.error('Error marking contact as read:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
