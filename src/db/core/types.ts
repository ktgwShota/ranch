import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type {
  contacts,
  customers,
  pollOptions,
  polls,
  scheduleResponses,
  schedules,
} from './schema';

// --- Common DB Types ---
export interface DBResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// --- Contact Types ---
export type Contact = InferSelectModel<typeof contacts>;
export type NewContact = InferInsertModel<typeof contacts>;

// --- Poll Types ---
export type PollRaw = InferSelectModel<typeof polls>;
export type NewPoll = InferInsertModel<typeof polls>;

export type PollOptionRaw = InferSelectModel<typeof pollOptions>;
export type NewPollOption = InferInsertModel<typeof pollOptions>;

// アプリケーション層で使う拡張型（JSONパース後のvotersなど）
export type ParsedPollOption = Omit<PollOptionRaw, 'voters'> & {
  voters: Array<{ id: string; name: string }>;
};

export type Voter = ParsedPollOption['voters'][number];

export type ParsedPoll = PollRaw & {
  options: ParsedPollOption[];
};

// 互換性のためのエイリアス
export type Poll = PollRaw;
export type PollOption = PollOptionRaw;

// --- Schedule Types ---
export type ScheduleBase = InferSelectModel<typeof schedules>;
export type NewSchedule = InferInsertModel<typeof schedules>;

export type ScheduleResponseBase = InferSelectModel<typeof scheduleResponses>;
export type NewScheduleResponse = InferInsertModel<typeof scheduleResponses>;

// アプリケーション層での型 (JSONパース後)
export interface DateOption {
  date: string; // YYYY-MM-DD
  times: string[]; // HH:mm[]
}

export type AvailabilityStatus = 'available' | 'maybe' | 'unavailable' | null;

export type ScheduleResponse = Omit<ScheduleResponseBase, 'availability'> & {
  availability: { [key: string]: AvailabilityStatus }; // JSON parsed
};

export type Schedule = Omit<ScheduleBase, 'dates'> & {
  dates: DateOption[]; // JSON parsed
  responses?: ScheduleResponse[];
};

// --- Customer Types ---
export type Customer = InferSelectModel<typeof customers>;
export type NewCustomer = InferInsertModel<typeof customers>;
