// Schedule関連の型定義

// 回答ステータス
export type AvailabilityStatus = 'available' | 'maybe' | 'unavailable' | null;

// 日程候補（日付と時間の組み合わせ）
export interface DateOption {
  date: string; // YYYY-MM-DD形式
  times: string[]; // HH:mm形式の配列
}

// DB上のSchedule
export interface DBSchedule {
  id: string;
  title: string;
  dates: string; // JSON文字列として保存
  endDateTime: string | null; // 締切日時（ISO形式）
  confirmedDateTime: string | null; // 確定した日程キー（"YYYY-MM-DD" or "YYYY-MM-DD-HH:mm"）
  createdBy: string;
  createdAt: string;
  isClosed: number; // 0 = 開いている, 1 = 閉じている
}

// パース後のSchedule
export interface Schedule {
  id: string;
  title: string;
  dates: DateOption[];
  endDateTime: string | null; // 締切日時（ISO形式）
  confirmedDateTime: string | null; // 確定した日程キー（"YYYY-MM-DD" or "YYYY-MM-DD-HH:mm"）
  createdBy: string;
  createdAt: string;
  isClosed: boolean;
  responses?: ScheduleResponse[];
}

// DB上のScheduleResponse
export interface DBScheduleResponse {
  id: number;
  scheduleId: string;
  respondentId: string;
  name: string;
  availability: string; // JSON文字列として保存
  createdAt: string;
}

// パース後のScheduleResponse
export interface ScheduleResponse {
  id: number;
  scheduleId: string;
  respondentId: string;
  name: string;
  availability: { [key: string]: AvailabilityStatus }; // key: "YYYY-MM-DD-HH:mm" or "YYYY-MM-DD"
  createdAt: string;
}

// Schedule作成用データ
export interface CreateScheduleData {
  title: string;
  dates: DateOption[];
  endDateTime?: string | null; // 締切日時（ISO形式）
  createdBy: string;
}

// 回答送信用データ
export interface RespondToScheduleData {
  scheduleId: string;
  respondentId: string;
  name: string;
  availability: { [key: string]: AvailabilityStatus };
}

// 回答更新用データ
export interface UpdateResponseData {
  scheduleId: string;
  respondentId: string;
  name?: string;
  availability?: { [key: string]: AvailabilityStatus };
}

// DB操作結果
export interface DBResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

