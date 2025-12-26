import type { Dayjs } from 'dayjs';

// 回答の型定義（DBには null が含まれる可能性がある）
export type AvailabilityStatus = 'available' | 'maybe' | 'unavailable';
export type AvailabilityStatusWithNull = AvailabilityStatus | null;

export interface DateOption {
  date: Dayjs;
  times: string[];
}

export interface Response {
  id?: number;
  respondentId?: string;
  name: string;
  availability: { [key: string]: AvailabilityStatusWithNull };
}

// ページコンポーネントで受け取るデータ型（日付は文字列）
export interface ScheduleData {
  id: string;
  title: string;
  createdAt: string;
  confirmedDateTime: string | null;
  dates: Array<{ date: string; times: string[] }>;
  responses: Response[];
  isClosed: boolean;
  endDateTime: string | null;
  pollId?: string | null;
}

export interface DateTimeItem {
  date: Dayjs;
  time?: string;
  key: string;
}

export interface ScheduleTableProps {
  allDateTimes: DateTimeItem[];
  allResponses: Response[];
  bestKeys: Set<string>;
  isClosed: boolean;
  confirmedDateTime: string | null;
  voterName: string;
  setVoterName: (name: string) => void;
  myAvailability: { [key: string]: AvailabilityStatus };
  toggleAvailability: (dateTimeKey: string) => void;
  isSubmitted: boolean;
  isEditing: boolean;
  showInputForm: boolean;
  setShowInputForm: (show: boolean) => void;
  respondentId: string;
  handleEdit: () => void;
  handleCancelEdit: () => void;
  handleSubmit: () => void;
}

// 日時キーを生成
export const getDateTimeKey = (date: Dayjs, time?: string) => {
  return time ? `${date.format('YYYY-MM-DD')}-${time}` : date.format('YYYY-MM-DD');
};

// 各日時のサマリーを計算
export const calculateSummary = (dateTimeKey: string, responses: Response[]) => {
  let available = 0;
  let maybe = 0;
  let unavailable = 0;

  for (const response of responses) {
    const status = response.availability[dateTimeKey];
    if (status === 'available') available++;
    else if (status === 'maybe') maybe++;
    else if (status === 'unavailable') unavailable++;
  }

  return { available, maybe, unavailable, total: responses.length };
};

// スコアを計算（○=1, △=0.5, ×=0）
export const calculateScore = (available: number, maybe: number) => {
  return available + maybe * 0.5;
};

// スコアをフォーマット（整数なら整数、小数なら1桁）
export const formatScore = (score: number) => {
  return score % 1 === 0 ? score : score.toFixed(1);
};
