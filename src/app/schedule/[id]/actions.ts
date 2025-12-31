'use server';

import type { AvailabilityStatus } from '@/db/core/types';
import {
  closeSchedule,
  deleteResponse,
  deleteSchedule,
  getSchedule,
  reopenSchedule,
  respondToSchedule,
} from '@/db/services/schedule';
import type { ActionState } from '@/types';

export type ScheduleResponseInput = {
  respondentId: string;
  name: string;
  availability: { [key: string]: AvailabilityStatus };
};

// スケジュール取得
export async function getScheduleAction(id: string): Promise<ActionState> {
  try {
    const result = await getSchedule(id);
    if (!result.success) {
      return { success: false, error: result.error || 'Schedule not found' };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in getScheduleAction:', error);
    return { success: false, error: 'Failed to fetch schedule' };
  }
}

// スケジュール削除
export async function deleteScheduleAction(id: string): Promise<ActionState> {
  try {
    const result = await deleteSchedule(id);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete' };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in deleteScheduleAction:', error);
    return { success: false, error: 'Failed to delete schedule' };
  }
}

// スケジュール募集終了（確定）
export async function closeScheduleAction(
  id: string,
  confirmedDateTime: string
): Promise<ActionState> {
  try {
    const result = await closeSchedule(id, confirmedDateTime);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to close' };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in closeScheduleAction:', error);
    return { success: false, error: 'Failed to close schedule' };
  }
}

// スケジュール再開
export async function reopenScheduleAction(id: string): Promise<ActionState> {
  try {
    const result = await reopenSchedule(id);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to reopen' };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in reopenScheduleAction:', error);
    return { success: false, error: 'Failed to reopen schedule' };
  }
}

// 回答の登録・更新
export async function submitResponseAction(
  scheduleId: string,
  input: ScheduleResponseInput
): Promise<ActionState> {
  try {
    const result = await respondToSchedule({
      scheduleId,
      respondentId: input.respondentId,
      name: input.name,
      availability: input.availability,
    });

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to submit' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in submitResponseAction:', error);
    return { success: false, error: 'Failed to submit response' };
  }
}

// 回答の削除
export async function deleteResponseAction(
  scheduleId: string,
  respondentId: string
): Promise<ActionState> {
  try {
    const result = await deleteResponse(scheduleId, respondentId);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete response' };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in deleteResponseAction:', error);
    return { success: false, error: 'Failed to delete response' };
  }
}
