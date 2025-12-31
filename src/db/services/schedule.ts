import { and, asc, desc, eq } from 'drizzle-orm';
import { cache } from 'react';
import { getDrizzle } from '../core/drizzle';
import { scheduleResponses, schedules } from '../core/schema';
import type {
  AvailabilityStatus,
  DateOption,
  DBResult,
  Schedule,
  ScheduleResponse,
} from '../core/types';

function parseSchedule(
  dbSchedule: typeof schedules.$inferSelect,
  responses: ScheduleResponse[] = []
): Schedule {
  return {
    id: dbSchedule.id,
    title: dbSchedule.title,
    dates: JSON.parse(dbSchedule.dates),
    endDateTime: dbSchedule.endDateTime,
    confirmedDateTime: dbSchedule.confirmedDateTime,
    createdBy: dbSchedule.createdBy,
    createdAt: dbSchedule.createdAt,
    isClosed: dbSchedule.isClosed === true,
    pollId: dbSchedule.pollId,
    responses,
  };
}

function parseResponse(dbResponse: typeof scheduleResponses.$inferSelect): ScheduleResponse {
  return {
    id: dbResponse.id,
    scheduleId: dbResponse.scheduleId,
    respondentId: dbResponse.respondentId,
    name: dbResponse.name,
    availability: JSON.parse(dbResponse.availability),
    createdAt: dbResponse.createdAt,
  };
}

export async function createSchedule(data: {
  title: string;
  dates: DateOption[];
  endDateTime?: string | null;
  createdBy: string;
  pollId?: string | null;
}): Promise<DBResult<{ id: string }>> {
  try {
    const db = getDrizzle();
    const scheduleId = Date.now().toString();

    await db.insert(schedules).values({
      id: scheduleId,
      title: data.title,
      dates: JSON.stringify(data.dates),
      endDateTime: data.endDateTime || null,
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
      isClosed: false,
      pollId: data.pollId || null,
    });

    return { success: true, data: { id: scheduleId } };
  } catch (error) {
    console.error('Error in createSchedule:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function linkPollToSchedule(
  scheduleId: string,
  pollId: string
): Promise<DBResult<{ id: string }>> {
  try {
    const db = getDrizzle();
    await db.update(schedules).set({ pollId }).where(eq(schedules.id, scheduleId));
    return { success: true, data: { id: scheduleId } };
  } catch (error) {
    console.error('Error in linkPollToSchedule:', error);
    return { success: false, error: 'Unknown error' };
  }
}

export const getSchedule = cache(async (scheduleId: string): Promise<DBResult<Schedule>> => {
  try {
    const db = getDrizzle();

    const schedule = await db.select().from(schedules).where(eq(schedules.id, scheduleId)).get();

    if (!schedule) {
      return { success: false, error: 'Schedule not found' };
    }

    const responses = await db
      .select()
      .from(scheduleResponses)
      .where(eq(scheduleResponses.scheduleId, scheduleId))
      .orderBy(asc(scheduleResponses.createdAt))
      .all();

    const parsedResponses = responses.map(parseResponse);

    return {
      success: true,
      data: parseSchedule(schedule, parsedResponses),
    };
  } catch (error) {
    console.error('Error in getSchedule:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

export async function getSchedules(): Promise<DBResult<Schedule[]>> {
  try {
    const db = getDrizzle();

    const allSchedules = await db.select().from(schedules).orderBy(desc(schedules.createdAt)).all();
    const schedulesWithResponses: Schedule[] = [];

    for (const schedule of allSchedules) {
      const responses = await db
        .select()
        .from(scheduleResponses)
        .where(eq(scheduleResponses.scheduleId, schedule.id))
        .orderBy(asc(scheduleResponses.createdAt))
        .all();

      const parsedResponses = responses.map(parseResponse);
      schedulesWithResponses.push(parseSchedule(schedule, parsedResponses));
    }

    return { success: true, data: schedulesWithResponses };
  } catch (error) {
    console.error('Error in getSchedules:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function respondToSchedule(data: {
  scheduleId: string;
  respondentId: string;
  name: string;
  availability: { [key: string]: AvailabilityStatus };
}): Promise<DBResult<{ id: number }>> {
  try {
    const db = getDrizzle();

    const existing = await db
      .select()
      .from(scheduleResponses)
      .where(
        and(
          eq(scheduleResponses.scheduleId, data.scheduleId),
          eq(scheduleResponses.respondentId, data.respondentId)
        )
      )
      .get();

    if (existing) {
      await db
        .update(scheduleResponses)
        .set({
          name: data.name,
          availability: JSON.stringify(data.availability),
        })
        .where(eq(scheduleResponses.id, existing.id));

      return { success: true, data: { id: existing.id } };
    }

    const result = await db
      .insert(scheduleResponses)
      .values({
        scheduleId: data.scheduleId,
        respondentId: data.respondentId,
        name: data.name,
        availability: JSON.stringify(data.availability),
        createdAt: new Date().toISOString(),
      })
      .returning({ id: scheduleResponses.id })
      .get();

    return { success: true, data: { id: result.id } };
  } catch (error) {
    console.error('Error in respondToSchedule:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateResponse(data: {
  scheduleId: string;
  respondentId: string;
  name?: string;
  availability?: { [key: string]: AvailabilityStatus };
}): Promise<DBResult<{ id: number }>> {
  try {
    const db = getDrizzle();

    const existing = await db
      .select()
      .from(scheduleResponses)
      .where(
        and(
          eq(scheduleResponses.scheduleId, data.scheduleId),
          eq(scheduleResponses.respondentId, data.respondentId)
        )
      )
      .get();

    if (!existing) {
      return { success: false, error: 'Response not found' };
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.availability !== undefined)
      updateData.availability = JSON.stringify(data.availability);

    await db.update(scheduleResponses).set(updateData).where(eq(scheduleResponses.id, existing.id));

    return { success: true, data: { id: existing.id } };
  } catch (error) {
    console.error('Error in updateResponse:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteResponse(
  scheduleId: string,
  respondentId: string
): Promise<DBResult<void>> {
  try {
    const db = getDrizzle();
    await db
      .delete(scheduleResponses)
      .where(
        and(
          eq(scheduleResponses.scheduleId, scheduleId),
          eq(scheduleResponses.respondentId, respondentId)
        )
      );
    return { success: true };
  } catch (error) {
    console.error('Error in deleteResponse:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function closeSchedule(
  scheduleId: string,
  confirmedDateTime?: string
): Promise<DBResult<void>> {
  try {
    const db = getDrizzle();
    await db
      .update(schedules)
      .set({ isClosed: true, confirmedDateTime: confirmedDateTime || null })
      .where(eq(schedules.id, scheduleId));
    return { success: true };
  } catch (error) {
    console.error('Error in closeSchedule:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function reopenSchedule(scheduleId: string): Promise<DBResult<void>> {
  try {
    const db = getDrizzle();
    await db
      .update(schedules)
      .set({ isClosed: false, confirmedDateTime: null })
      .where(eq(schedules.id, scheduleId));
    return { success: true };
  } catch (error) {
    console.error('Error in reopenSchedule:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteSchedule(scheduleId: string): Promise<DBResult<void>> {
  try {
    const db = getDrizzle();
    await db.delete(schedules).where(eq(schedules.id, scheduleId));
    return { success: true };
  } catch (error) {
    console.error('Error in deleteSchedule:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
