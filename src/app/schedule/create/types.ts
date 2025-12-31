import type { Dayjs } from 'dayjs';

export interface SelectedDate {
  date: Dayjs;
  times: string[];
}

export interface TimeValue {
  hour: string;
  minute: string;
}

export interface DateGroup {
  startDate: Dayjs;
  endDate: Dayjs;
  times: string[];
  dates: SelectedDate[];
}

// 時間の配列を生成（00〜23）
export const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

// 分の配列を生成（00〜55、5分刻み）
export const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

// 長押し判定の時間（ミリ秒）
export const LONG_PRESS_DURATION = 300;

// ダブルクリック検出の時間（ミリ秒）
export const DOUBLE_CLICK_DELAY = 300;
