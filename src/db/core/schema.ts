import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const customers = sqliteTable('Customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const polls = sqliteTable('polls', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  duration: integer('duration'),
  endDateTime: text('endDateTime'),
  createdBy: text('createdBy').notNull(),
  createdAt: text('createdAt').notNull(),
  isClosed: integer('isClosed', { mode: 'boolean' }).default(false),
  password: text('password'),
  scheduleId: text('scheduleId'),
});

export const pollOptions = sqliteTable('poll_options', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pollId: text('pollId')
    .notNull()
    .references(() => polls.id, { onDelete: 'cascade' }),
  optionId: integer('optionId').notNull(),
  url: text('url').notNull(),
  title: text('title').default('候補リストを取得中...'),
  description: text('description').default('説明を取得中...'),
  image: text('image'),
  votes: integer('votes').default(0),
  voters: text('voters').default('[]'),
});

export const contacts = sqliteTable('contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  isRead: integer('isRead', { mode: 'boolean' }).default(false),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const schedules = sqliteTable('schedules', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  dates: text('dates').notNull(), // JSON
  endDateTime: text('endDateTime'),
  confirmedDateTime: text('confirmedDateTime'),
  createdBy: text('createdBy').notNull(),
  createdAt: text('createdAt').notNull(),
  isClosed: integer('isClosed', { mode: 'boolean' }).default(false),
  pollId: text('pollId'),
});

export const scheduleResponses = sqliteTable('schedule_responses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  scheduleId: text('scheduleId')
    .notNull()
    .references(() => schedules.id, { onDelete: 'cascade' }),
  respondentId: text('respondentId').notNull(),
  name: text('name').notNull(),
  availability: text('availability').notNull(), // JSON
  createdAt: text('createdAt').notNull(),
});
