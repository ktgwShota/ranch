import dayjs, { type Dayjs } from '../lib/dayjs';

/**
 * 指定された日付が過去の日付かどうかを判定します
 * @param date - 判定する日付
 * @returns 過去の日付の場合 true
 */
export const isPastDate = (date: Dayjs): boolean => {
  return date.isBefore(dayjs(), 'day');
};
