'use client';

const CREATED_SCHEDULES_KEY = 'my_created_schedules';

/**
 * 自分が作成したスケジュールの一覧をlocalStorageから取得する
 */
export function getCreatedSchedules(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CREATED_SCHEDULES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to get created schedules from localStorage', e);
    return [];
  }
}

/**
 * 新しく作成したスケジュールIDをlocalStorageに保存する
 */
export function addCreatedSchedule(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const createdSchedules = getCreatedSchedules();
    if (!createdSchedules.includes(id)) {
      createdSchedules.push(id);
      localStorage.setItem(CREATED_SCHEDULES_KEY, JSON.stringify(createdSchedules));
    }
  } catch (e) {
    console.error('Failed to save created schedule to localStorage', e);
  }
}

/**
 * 指定したスケジュールIDの作成者（主催者）かどうかを判定する
 */
export function checkIsOrganizer(id: string): boolean {
  const createdSchedules = getCreatedSchedules();
  return createdSchedules.includes(id);
}
