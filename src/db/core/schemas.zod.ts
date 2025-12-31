import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import * as schema from './schema';

// Contact
export const insertContactSchema = createInsertSchema(schema.contacts);
export const selectContactSchema = createSelectSchema(schema.contacts);

// Poll
export const insertPollSchema = createInsertSchema(schema.polls);
export const selectPollSchema = createSelectSchema(schema.polls);

// Poll Options
export const insertPollOptionSchema = createInsertSchema(schema.pollOptions);
export const selectPollOptionSchema = createSelectSchema(schema.pollOptions);

// Schedule
export const insertScheduleSchema = createInsertSchema(schema.schedules);
export const selectScheduleSchema = createSelectSchema(schema.schedules);

// Schedule Response
export const insertScheduleResponseSchema = createInsertSchema(schema.scheduleResponses);
export const selectScheduleResponseSchema = createSelectSchema(schema.scheduleResponses);
