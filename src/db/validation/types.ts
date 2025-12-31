import type { z } from 'zod';
import type { contactFormSchema } from './contact';
import type { pollFormSchema, pollOptionFormSchema } from './poll';
import type { scheduleDateFormSchema, scheduleFormSchema } from './schedule';

export type PollFormData = z.infer<typeof pollFormSchema>;
export type PollOptionFormData = z.infer<typeof pollOptionFormSchema>;

export type ScheduleFormData = z.infer<typeof scheduleFormSchema>;
export type ScheduleDateData = z.infer<typeof scheduleDateFormSchema>;

export type ContactFormData = z.infer<typeof contactFormSchema>;
