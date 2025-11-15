import { Poll, PollOption, CreatePollData, UpdatePollData, VoteData } from './types';
import { getDB } from '../client';

// ポール作成
export async function createPoll(data: CreatePollData, env: { DB: D1Database }) {
  try {
    console.log('createPoll called with data:', data);

    // まず、getDB()を呼び出してエラーを確認
    console.log('About to call getDB()...');
    const db = getDB(env);
    console.log('getDB() succeeded, db:', db);

    const pollId = Date.now().toString();
    // endDateTimeが指定されている場合はそれを使い、そうでない場合はdurationから計算
    const endDateTime = data.endDateTime || (data.duration ? new Date(Date.now() + data.duration * 60 * 1000).toISOString() : null);

    console.log('Creating poll with data:', { pollId, title: data.title, optionsCount: data.options.length });

    // ポールを作成
    console.log('About to create poll in database...');
    await db.prepare(`
      INSERT INTO polls (id, title, duration, endDateTime, createdBy, createdAt, isClosed)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(pollId, data.title, data.duration, endDateTime, data.createdBy, new Date().toISOString(), 0).run();

    console.log('Poll created successfully, creating options...');

    // オプションを作成
    for (const [index, option] of data.options.entries()) {
      const optionId = index + 1;
      console.log(`Creating option ${optionId}:`, option);
      // D1はundefinedをサポートしていないので、nullに変換
      const image = option.image ?? null;
      const description = option.description ?? null;
      await db.prepare(`
        INSERT INTO poll_options (pollId, optionId, url, title, description, image, votes, voters)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(pollId, optionId, option.url, option.title, description, image, 0, JSON.stringify([])).run();
    }

    console.log('All options created successfully');
    return { success: true, data: { id: pollId }, error: undefined };
  } catch (error) {
    console.error('Error in createPoll:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ポール取得
export async function getPoll(pollId: string, env: { DB: D1Database }) {
  const db = getDB(env);

  const poll = await db.prepare('SELECT * FROM polls WHERE id = ?').bind(pollId).first();
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }

  const options = await db.prepare('SELECT * FROM poll_options WHERE pollId = ?').bind(pollId).all();

  const pollData = {
    ...poll,
    options: options.results.map((option: any) => ({
      id: option.optionId,
      url: option.url,
      title: option.title,
      description: option.description,
      image: option.image,
      votes: option.votes,
      voters: JSON.parse(option.voters as string)
    }))
  };

  return { success: true, data: pollData as unknown as Poll, error: undefined };
}

// ポール一覧取得
export async function getPolls(env: { DB: D1Database }) {
  const db = getDB(env);

  const polls = await db.prepare('SELECT * FROM polls ORDER BY createdAt DESC').all();
  const pollsWithOptions = [];

  for (const poll of polls.results as any[]) {
    const options = await db.prepare('SELECT * FROM poll_options WHERE pollId = ?').bind(poll.id).all();
    pollsWithOptions.push({
      ...poll,
      options: options.results.map((option: any) => ({
        id: option.optionId,
        url: option.url,
        title: option.title,
        description: option.description,
        image: option.image,
        votes: option.votes,
        voters: JSON.parse(option.voters as string)
      }))
    });
  }

  return { success: true, data: pollsWithOptions as unknown as Poll[], error: undefined };
}

// ポール更新
export async function updatePoll(pollId: string, data: UpdatePollData, env: { DB: D1Database }) {
  const db = getDB(env);

  const endDateTime = data.duration ? new Date(Date.now() + data.duration * 60 * 1000).toISOString() : null;

  await db.prepare(`
    UPDATE polls 
    SET title = ?, duration = ?, endDateTime = ?
    WHERE id = ?
  `).bind(data.title, data.duration, endDateTime, pollId).run();

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

  // オプションを取得
  const option = await db.prepare('SELECT * FROM poll_options WHERE pollId = ? AND optionId = ?').bind(data.pollId, data.optionId).first();
  if (!option) {
    return { success: false, error: 'Option not found' };
  }

  // 既に投票済みかチェック
  const voters = JSON.parse(option.voters as string);
  if (voters.includes(data.voterId)) {
    return { success: false, error: 'Already voted' };
  }

  // 投票を追加
  voters.push(data.voterId);
  await db.prepare(`
    UPDATE poll_options 
    SET votes = ?, voters = ?
    WHERE pollId = ? AND optionId = ?
  `).bind((option.votes as number) + 1, JSON.stringify(voters), data.pollId, data.optionId).run();

  return { success: true, data: { pollId: data.pollId, optionId: data.optionId }, error: undefined };
}

