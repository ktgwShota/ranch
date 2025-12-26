import { getDB } from '../client';
import type {
  CreateScheduleData,
  DBSchedule,
  DBScheduleResponse,
  DBResult,
  RespondToScheduleData,
  Schedule,
  ScheduleResponse,
  UpdateResponseData,
} from './types';

// DBScheduleをScheduleに変換
function parseSchedule(dbSchedule: DBSchedule, responses: ScheduleResponse[] = []): Schedule {
  return {
    id: dbSchedule.id,
    title: dbSchedule.title,
    dates: JSON.parse(dbSchedule.dates),
    endDateTime: dbSchedule.endDateTime,
    confirmedDateTime: dbSchedule.confirmedDateTime,
    createdBy: dbSchedule.createdBy,
    createdAt: dbSchedule.createdAt,
    isClosed: dbSchedule.isClosed === 1,
    pollId: dbSchedule.pollId,
    responses,
  };
}

// DBScheduleResponseをScheduleResponseに変換
function parseResponse(dbResponse: DBScheduleResponse): ScheduleResponse {
  return {
    id: dbResponse.id,
    scheduleId: dbResponse.scheduleId,
    respondentId: dbResponse.respondentId,
    name: dbResponse.name,
    availability: JSON.parse(dbResponse.availability),
    createdAt: dbResponse.createdAt,
  };
}

// Schedule作成
export async function createSchedule(
  data: CreateScheduleData,
  env: { DB: D1Database }
): Promise<DBResult<{ id: string }>> {
  try {
    const db = getDB(env);
    const scheduleId = Date.now().toString();

    await db
      .prepare(`
        INSERT INTO schedules (id, title, dates, endDateTime, createdBy, createdAt, isClosed, pollId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        scheduleId,
        data.title,
        JSON.stringify(data.dates),
        data.endDateTime || null,
        data.createdBy,
        new Date().toISOString(),
        0,
        data.pollId || null
      )
      .run();

    return { success: true, data: { id: scheduleId } };
  } catch (error) {
    console.error('Error in createSchedule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ScheduleにPollを紐付け
export async function linkPollToSchedule(scheduleId: string, pollId: string, env: { DB: D1Database }): Promise<DBResult<{ id: string }>> {
  try {
    const db = getDB(env);
    await db.prepare('UPDATE schedules SET pollId = ? WHERE id = ?').bind(pollId, scheduleId).run();
    return { success: true, data: { id: scheduleId } };
  } catch (error) {
    console.error('Error in linkPollToSchedule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Schedule取得（回答含む）
export async function getSchedule(
  scheduleId: string,
  env: { DB: D1Database }
): Promise<DBResult<Schedule>> {
  try {
    const db = getDB(env);

    const schedule = await db
      .prepare('SELECT * FROM schedules WHERE id = ?')
      .bind(scheduleId)
      .first<DBSchedule>();

    if (!schedule) {
      return { success: false, error: 'Schedule not found' };
    }

    // 回答を取得
    const responses = await db
      .prepare('SELECT * FROM schedule_responses WHERE scheduleId = ? ORDER BY createdAt ASC')
      .bind(scheduleId)
      .all<DBScheduleResponse>();

    const parsedResponses = responses.results.map(parseResponse);

    return {
      success: true,
      data: parseSchedule(schedule, parsedResponses),
    };
  } catch (error) {
    console.error('Error in getSchedule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Schedule一覧取得
export async function getSchedules(
  env: { DB: D1Database }
): Promise<DBResult<Schedule[]>> {
  try {
    const db = getDB(env);

    const schedules = await db
      .prepare('SELECT * FROM schedules ORDER BY createdAt DESC')
      .all<DBSchedule>();

    const schedulesWithResponses: Schedule[] = [];

    for (const schedule of schedules.results) {
      const responses = await db
        .prepare('SELECT * FROM schedule_responses WHERE scheduleId = ? ORDER BY createdAt ASC')
        .bind(schedule.id)
        .all<DBScheduleResponse>();

      const parsedResponses = responses.results.map(parseResponse);
      schedulesWithResponses.push(parseSchedule(schedule, parsedResponses));
    }

    return { success: true, data: schedulesWithResponses };
  } catch (error) {
    console.error('Error in getSchedules:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 回答を送信
export async function respondToSchedule(
  data: RespondToScheduleData,
  env: { DB: D1Database }
): Promise<DBResult<{ id: number }>> {
  try {
    const db = getDB(env);

    // 既存の回答があるか確認
    const existing = await db
      .prepare('SELECT id FROM schedule_responses WHERE scheduleId = ? AND respondentId = ?')
      .bind(data.scheduleId, data.respondentId)
      .first<{ id: number }>();

    if (existing) {
      // 既存の回答がある場合は更新
      await db
        .prepare(`
          UPDATE schedule_responses
          SET name = ?, availability = ?
          WHERE scheduleId = ? AND respondentId = ?
        `)
        .bind(
          data.name,
          JSON.stringify(data.availability),
          data.scheduleId,
          data.respondentId
        )
        .run();

      return { success: true, data: { id: existing.id } };
    }

    // 新規回答を作成
    const result = await db
      .prepare(`
        INSERT INTO schedule_responses (scheduleId, respondentId, name, availability, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(
        data.scheduleId,
        data.respondentId,
        data.name,
        JSON.stringify(data.availability),
        new Date().toISOString()
      )
      .run();

    return { success: true, data: { id: result.meta.last_row_id as number } };
  } catch (error) {
    console.error('Error in respondToSchedule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 回答を更新
export async function updateResponse(
  data: UpdateResponseData,
  env: { DB: D1Database }
): Promise<DBResult<{ id: number }>> {
  try {
    const db = getDB(env);

    const existing = await db
      .prepare('SELECT * FROM schedule_responses WHERE scheduleId = ? AND respondentId = ?')
      .bind(data.scheduleId, data.respondentId)
      .first<DBScheduleResponse>();

    if (!existing) {
      return { success: false, error: 'Response not found' };
    }

    const name = data.name ?? existing.name;
    const availability = data.availability
      ? JSON.stringify(data.availability)
      : existing.availability;

    await db
      .prepare(`
        UPDATE schedule_responses
        SET name = ?, availability = ?
        WHERE scheduleId = ? AND respondentId = ?
      `)
      .bind(name, availability, data.scheduleId, data.respondentId)
      .run();

    return { success: true, data: { id: existing.id } };
  } catch (error) {
    console.error('Error in updateResponse:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 回答を削除
export async function deleteResponse(
  scheduleId: string,
  respondentId: string,
  env: { DB: D1Database }
): Promise<DBResult<void>> {
  try {
    const db = getDB(env);

    await db
      .prepare('DELETE FROM schedule_responses WHERE scheduleId = ? AND respondentId = ?')
      .bind(scheduleId, respondentId)
      .run();

    return { success: true };
  } catch (error) {
    console.error('Error in deleteResponse:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Scheduleを閉じる（確定した日程を保存）
export async function closeSchedule(
  scheduleId: string,
  env: { DB: D1Database },
  confirmedDateTime?: string
): Promise<DBResult<void>> {
  try {
    const db = getDB(env);

    await db
      .prepare('UPDATE schedules SET isClosed = 1, confirmedDateTime = ? WHERE id = ?')
      .bind(confirmedDateTime || null, scheduleId)
      .run();

    return { success: true };
  } catch (error) {
    console.error('Error in closeSchedule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Scheduleを再開（確定した日程をクリア）
export async function reopenSchedule(
  scheduleId: string,
  env: { DB: D1Database }
): Promise<DBResult<void>> {
  try {
    const db = getDB(env);

    await db
      .prepare('UPDATE schedules SET isClosed = 0, confirmedDateTime = NULL WHERE id = ?')
      .bind(scheduleId)
      .run();

    return { success: true };
  } catch (error) {
    console.error('Error in reopenSchedule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Scheduleを削除
export async function deleteSchedule(
  scheduleId: string,
  env: { DB: D1Database }
): Promise<DBResult<void>> {
  try {
    const db = getDB(env);

    // 外部キー制約により、schedule_responsesは自動的に削除される（ON DELETE CASCADE）
    await db
      .prepare('DELETE FROM schedules WHERE id = ?')
      .bind(scheduleId)
      .run();

    return { success: true };
  } catch (error) {
    console.error('Error in deleteSchedule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

