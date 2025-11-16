import { getDB } from '../client';
import {
  type CreatePollData,
  type DBPoll,
  type DBPollOption,
  type DBResult,
  type UpdatePollData,
  type UpdateVoterNameData,
  type VoteData,
} from './types';

export async function createPoll(data: CreatePollData, env: { DB: D1Database }) {
  try {
    console.log('createPoll called with data:', data);

    // まず、getDB()を呼び出してエラーを確認
    console.log('About to call getDB()...');
    const db = getDB(env);
    console.log('getDB() succeeded, db:', db);

    const pollId = Date.now().toString();
    // endDateTimeが指定されている場合はそれを使い、そうでない場合はdurationから計算
    const endDateTime =
      data.endDateTime ||
      (data.duration ? new Date(Date.now() + data.duration * 60 * 1000).toISOString() : null);

    console.log('Creating poll with data:', {
      pollId,
      title: data.title,
      optionsCount: data.options.length,
    });

    // ポールを作成
    console.log('About to create poll in database...');
    await db
      .prepare(`
      INSERT INTO polls (id, title, duration, endDateTime, createdBy, createdAt, isClosed)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        pollId,
        data.title,
        data.duration,
        endDateTime,
        data.createdBy,
        new Date().toISOString(),
        0
      )
      .run();

    console.log('Poll created successfully, creating options...');

    // オプションを作成
    for (const [index, option] of data.options.entries()) {
      const optionId = index + 1;
      console.log(`Creating option ${optionId}:`, option);
      // D1はundefinedをサポートしていないので、nullに変換
      const image = option.image ?? null;
      const description = option.description ?? null;
      const budgetMin = option.budgetMin ?? null;
      const budgetMax = option.budgetMax ?? null;
      await db
        .prepare(`
        INSERT INTO poll_options (pollId, optionId, url, title, description, image, budgetMin, budgetMax, votes, voters)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
        .bind(pollId, optionId, option.url, option.title, description, image, budgetMin, budgetMax, 0, JSON.stringify([]))
        .run();
    }

    console.log('All options created successfully');
    return { success: true, data: { id: pollId }, error: undefined };
  } catch (error) {
    console.error('Error in createPoll:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getPoll(pollId: string, env: { DB: D1Database }): Promise<DBResult<DBPoll>> {
  const db = getDB(env);

  const poll = await db.prepare('SELECT * FROM polls WHERE id = ?').bind(pollId).first();
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }

  const options = await db
    .prepare('SELECT * FROM poll_options WHERE pollId = ?')
    .bind(pollId)
    .all();

  const pollData = {
    ...poll,
    options: options.results.map((option: any) => ({
      id: option.optionId,
      url: option.url,
      title: option.title,
      description: option.description,
      image: option.image,
      budgetMin: option.budgetMin ?? undefined,
      budgetMax: option.budgetMax ?? undefined,
      votes: option.votes,
      voters: JSON.parse(option.voters as string),
    })),
  };

  return { success: true, data: pollData as unknown as DBPoll, error: undefined };
}

// ポール一覧取得
export async function getPolls(env: { DB: D1Database }) {
  const db = getDB(env);

  const polls = await db.prepare('SELECT * FROM polls ORDER BY createdAt DESC').all();
  const pollsWithOptions = [];

  for (const poll of polls.results as any[]) {
    const options = await db
      .prepare('SELECT * FROM poll_options WHERE pollId = ?')
      .bind(poll.id)
      .all();
    pollsWithOptions.push({
      ...poll,
      options: options.results.map((option: any) => ({
        id: option.optionId,
        url: option.url,
        title: option.title,
        description: option.description,
        image: option.image,
        budgetMin: option.budgetMin ?? undefined,
        budgetMax: option.budgetMax ?? undefined,
        votes: option.votes,
        voters: JSON.parse(option.voters as string),
      })),
    });
  }

  return { success: true, data: pollsWithOptions as unknown as DBPoll[], error: undefined };
}

// ポール更新
export async function updatePoll(pollId: string, data: UpdatePollData, env: { DB: D1Database }) {
  const db = getDB(env);

  const endDateTime = data.duration
    ? new Date(Date.now() + data.duration * 60 * 1000).toISOString()
    : null;

  await db
    .prepare(`
    UPDATE polls 
    SET title = ?, duration = ?, endDateTime = ?
    WHERE id = ?
  `)
    .bind(data.title, data.duration, endDateTime, pollId)
    .run();

  return { success: true, data: { id: pollId }, error: undefined };
}

// ポール終了
export async function closePoll(pollId: string, env: { DB: D1Database }) {
  const db = getDB(env);

  await db.prepare('UPDATE polls SET isClosed = 1 WHERE id = ?').bind(pollId).run();

  return { success: true, data: { id: pollId }, error: undefined };
}

// 投票
export async function votePoll(data: VoteData, env: { DB: D1Database }) {
  const db = getDB(env);

  // まず、他の選択肢から投票を削除（一人一票制）
  const allOptions = await db
    .prepare('SELECT * FROM poll_options WHERE pollId = ?')
    .bind(data.pollId)
    .all();

  for (const opt of allOptions.results as any[]) {
    if (opt.optionId !== data.optionId) {
      const voters = JSON.parse(opt.voters as string) as Array<{ id: string; name: string }>;
      const voterIndex = voters.findIndex((v) => v.id === data.voterId);
      if (voterIndex !== -1) {
        // 他の選択肢から投票を削除
        voters.splice(voterIndex, 1);
        await db
          .prepare(`
          UPDATE poll_options 
          SET votes = ?, voters = ?
          WHERE pollId = ? AND optionId = ?
        `)
          .bind((opt.votes as number) - 1, JSON.stringify(voters), data.pollId, opt.optionId)
          .run();
      }
    }
  }

  // 対象のオプションを取得
  const option = await db
    .prepare('SELECT * FROM poll_options WHERE pollId = ? AND optionId = ?')
    .bind(data.pollId, data.optionId)
    .first();
  if (!option) {
    return { success: false, error: 'Option not found' };
  }

  // 既存の投票者リストを取得
  const voters = JSON.parse(option.voters as string) as Array<{ id: string; name: string }>;

  // 既に投票済みかチェック（IDで判定）
  const existingVoterIndex = voters.findIndex((v) => v.id === data.voterId);
  if (existingVoterIndex !== -1) {
    // 既に投票済みの場合は投票を取り消し
    voters.splice(existingVoterIndex, 1);
    await db
      .prepare(`
      UPDATE poll_options 
      SET votes = ?, voters = ?
      WHERE pollId = ? AND optionId = ?
    `)
      .bind((option.votes as number) - 1, JSON.stringify(voters), data.pollId, data.optionId)
      .run();
  } else {
    // 新しい投票を追加（IDと名前の両方を保存）
    voters.push({ id: data.voterId, name: data.voterName });
    await db
      .prepare(`
    UPDATE poll_options 
    SET votes = ?, voters = ?
    WHERE pollId = ? AND optionId = ?
  `)
      .bind((option.votes as number) + 1, JSON.stringify(voters), data.pollId, data.optionId)
      .run();
  }

  return {
    success: true,
    data: { pollId: data.pollId, optionId: data.optionId },
    error: undefined,
  };
}

// 投票者名を更新
export async function updateVoterName(data: UpdateVoterNameData, env: { DB: D1Database }) {
  const db = getDB(env);

  // すべての選択肢を取得
  const allOptions = await db
    .prepare('SELECT * FROM poll_options WHERE pollId = ?')
    .bind(data.pollId)
    .all();

  // すべての選択肢で投票者名を更新
  for (const opt of allOptions.results as any[]) {
    const voters = JSON.parse(opt.voters as string) as Array<{ id: string; name: string }>;
    const voterIndex = voters.findIndex((v) => v.id === data.voterId);
    if (voterIndex !== -1) {
      // 投票者名を更新
      voters[voterIndex] = { id: data.voterId, name: data.voterName };
      await db
        .prepare(`
        UPDATE poll_options 
        SET voters = ?
        WHERE pollId = ? AND optionId = ?
      `)
        .bind(JSON.stringify(voters), data.pollId, opt.optionId)
        .run();
    }
  }

  return {
    success: true,
    data: { pollId: data.pollId, voterId: data.voterId },
    error: undefined,
  };
}
