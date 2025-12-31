'use server';

import type { DateOption } from '@/db/core/types';
import { linkScheduleToPoll } from '@/db/services/poll';
import { createSchedule } from '@/db/services/schedule';
import type { ActionState } from '@/types';

// フォームデータの型定義
type CreateScheduleInput = {
  title: string;
  dates: DateOption[];
  endDate: string | null;
  endTime: string | null;
  pollId?: string;
};

export async function createScheduleAction(
  input: CreateScheduleInput
): Promise<ActionState<{ id: string }>> {
  try {
    // バリデーション
    if (!input.title) {
      return { success: false, error: 'Title is required' };
    }

    if (!input.dates || input.dates.length === 0) {
      return { success: false, error: 'At least one date is required' };
    }

    // endDateTimeを計算
    let endDateTime: string | null = null;
    if (input.endDate) {
      const endTime = input.endTime || '23:59';
      endDateTime = new Date(`${input.endDate}T${endTime}`).toISOString();
    }

    // Schedule作成
    const result = await createSchedule({
      title: input.title,
      dates: input.dates,
      endDateTime: endDateTime,
      createdBy: 'user', // 仮のユーザーID
      pollId: input.pollId,
    });

    if (!result.success || !result.data) {
      return { success: false, error: result.error || 'Failed to create schedule' };
    }

    const scheduleId = result.data.id;

    // Poll IDが指定されている場合、Poll側にもSchedule IDを紐付ける
    if (input.pollId) {
      await linkScheduleToPoll(input.pollId, scheduleId);
    }

    return {
      success: true,
      data: { id: scheduleId },
    };
  } catch (error) {
    console.error('Error in createScheduleAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
