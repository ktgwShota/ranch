'use server';

import { createContact, getContact, getContacts, markAsRead } from '@/db/services/contact';
import { contactFormSchema } from '@/db/validation/contact';
import type { ContactFormData } from '@/db/validation/types';
import type { ActionState } from '@/types';

// Removed local ActionState

// お問い合わせ送信
export async function submitContactAction(data: ContactFormData): Promise<ActionState> {
  try {
    const validated = contactFormSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'バリデーションエラー',
        details: validated.error.issues,
      };
    }

    const result = await createContact(validated.data);

    if (!result.success) {
      return { success: false, error: result.error || '送信に失敗しました' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in submitContactAction:', error);
    return { success: false, error: '送信に失敗しました' };
  }
}

// 管理画面用: お問い合わせ一覧取得
export async function getContactsAction(
  limit = 20,
  offset = 0,
  isRead?: boolean
): Promise<ActionState> {
  try {
    const result = await getContacts({ limit, offset, isRead });
    if (!result.success) {
      return { success: false, error: result.error || '取得に失敗しました' };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in getContactsAction:', error);
    return { success: false, error: '取得に失敗しました' };
  }
}

// 管理画面用: お問い合わせ詳細取得
export async function getContactAction(id: number): Promise<ActionState> {
  try {
    const result = await getContact(id);
    if (!result.success) {
      return { success: false, error: result.error || '取得に失敗しました' };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in getContactAction:', error);
    return { success: false, error: '取得に失敗しました' };
  }
}

// 管理画面用: 既読にする
export async function markContactAsReadAction(id: number): Promise<ActionState> {
  try {
    const result = await markAsRead(id);
    if (!result.success) {
      return { success: false, error: result.error || '更新に失敗しました' };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in markContactAsReadAction:', error);
    return { success: false, error: '更新に失敗しました' };
  }
}
