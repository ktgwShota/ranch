import { and, desc, eq } from 'drizzle-orm';
import { getDrizzle } from '../core/drizzle';
import { pollOptions, polls } from '../core/schema';
import type { DBResult, ParsedPoll } from '../core/types';

export async function createPoll(data: {
  title: string;
  duration?: number | null;
  endDateTime?: string | null;
  createdBy: string;
  password?: string | null;
  scheduleId?: string | null;
  options: Array<{
    url: string;
    title: string;
    description?: string | null;
    image?: string | null;
  }>;
}): Promise<DBResult<{ id: string }>> {
  try {
    const db = getDrizzle();
    const pollId = Date.now().toString();
    const endDateTime =
      data.endDateTime ||
      (data.duration ? new Date(Date.now() + data.duration * 60 * 1000).toISOString() : null);

    await db.insert(polls).values({
      id: pollId,
      title: data.title,
      duration: data.duration ?? null,
      endDateTime: endDateTime,
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
      isClosed: false,
      password: data.password || null,
      scheduleId: data.scheduleId || null,
    });

    for (const [index, option] of data.options.entries()) {
      const optionId = index + 1;
      await db.insert(pollOptions).values({
        pollId,
        optionId,
        url: option.url,
        title: option.title,
        description: option.description || null,
        image: option.image || null,
        votes: 0,
        voters: JSON.stringify([]),
      });
    }

    return { success: true, data: { id: pollId } };
  } catch (error) {
    console.error('Error in createPoll:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getPoll(pollId: string): Promise<DBResult<ParsedPoll>> {
  const db = getDrizzle();

  const poll = await db.select().from(polls).where(eq(polls.id, pollId)).get();
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }

  const options = await db.select().from(pollOptions).where(eq(pollOptions.pollId, pollId)).all();

  const pollData = {
    ...poll,
    options: options.map((option) => ({
      ...option,
      voters: JSON.parse(option.voters || '[]'),
    })),
  };

  return { success: true, data: pollData as unknown as ParsedPoll };
}

export async function getPolls(): Promise<DBResult<ParsedPoll[]>> {
  const db = getDrizzle();

  const allPolls = await db.select().from(polls).orderBy(desc(polls.createdAt)).all();

  const pollsWithOptions = [];
  for (const poll of allPolls) {
    const options = await db
      .select()
      .from(pollOptions)
      .where(eq(pollOptions.pollId, poll.id))
      .all();
    pollsWithOptions.push({
      ...poll,
      options: options.map((option) => ({
        ...option,
        voters: JSON.parse(option.voters || '[]'),
      })),
    });
  }

  return { success: true, data: pollsWithOptions as unknown as ParsedPoll[] };
}

export async function updatePoll(
  pollId: string,
  data: {
    title: string;
    duration?: number | null;
    endDateTime?: string | null;
    password?: string | null;
  }
) {
  const db = getDrizzle();
  const endDateTime = data.duration
    ? new Date(Date.now() + data.duration * 60 * 1000).toISOString()
    : null;

  await db
    .update(polls)
    .set({
      title: data.title,
      duration: data.duration ?? null,
      endDateTime: endDateTime,
      password: data.password || null,
    })
    .where(eq(polls.id, pollId));

  return { success: true, data: { id: pollId } };
}

export async function closePoll(pollId: string): Promise<DBResult<{ id: string }>> {
  const db = getDrizzle();
  await db.update(polls).set({ isClosed: true }).where(eq(polls.id, pollId));
  return { success: true, data: { id: pollId } };
}

export async function deletePoll(pollId: string): Promise<DBResult<{ id: string }>> {
  const db = getDrizzle();
  await db.delete(polls).where(eq(polls.id, pollId));
  return { success: true, data: { id: pollId } };
}

export async function linkScheduleToPoll(pollId: string, scheduleId: string) {
  const db = getDrizzle();
  await db.update(polls).set({ scheduleId }).where(eq(polls.id, pollId));
  return { success: true, data: { id: pollId } };
}

export async function votePoll(data: {
  pollId: string;
  optionId: number;
  voterId: string;
  voterName: string;
}): Promise<DBResult<{ pollId: string; optionId: number }>> {
  const db = getDrizzle();

  const allOptions = await db
    .select()
    .from(pollOptions)
    .where(eq(pollOptions.pollId, data.pollId))
    .all();

  // 他の選択肢から削除
  for (const opt of allOptions) {
    if (opt.optionId !== data.optionId) {
      const voters = JSON.parse(opt.voters || '[]') as Array<{ id: string; name: string }>;
      const voterIndex = voters.findIndex((v) => v.id === data.voterId);
      if (voterIndex !== -1) {
        voters.splice(voterIndex, 1);
        await db
          .update(pollOptions)
          .set({ votes: (opt.votes || 0) - 1, voters: JSON.stringify(voters) })
          .where(and(eq(pollOptions.pollId, data.pollId), eq(pollOptions.optionId, opt.optionId)));
      }
    }
  }

  // 対象の選択肢処理
  const targetOption = allOptions.find((o) => o.optionId === data.optionId);
  if (!targetOption) {
    return { success: false, error: 'Option not found' };
  }

  const voters = JSON.parse(targetOption.voters || '[]') as Array<{ id: string; name: string }>;
  const existingVoterIndex = voters.findIndex((v) => v.id === data.voterId);

  if (existingVoterIndex !== -1) {
    voters.splice(existingVoterIndex, 1);
    await db
      .update(pollOptions)
      .set({ votes: (targetOption.votes || 0) - 1, voters: JSON.stringify(voters) })
      .where(and(eq(pollOptions.pollId, data.pollId), eq(pollOptions.optionId, data.optionId)));
  } else {
    voters.push({ id: data.voterId, name: data.voterName });
    await db
      .update(pollOptions)
      .set({ votes: (targetOption.votes || 0) + 1, voters: JSON.stringify(voters) })
      .where(and(eq(pollOptions.pollId, data.pollId), eq(pollOptions.optionId, data.optionId)));
  }

  return { success: true, data: { pollId: data.pollId, optionId: data.optionId } };
}

export async function updateVoterName(data: {
  pollId: string;
  voterId: string;
  voterName: string;
}): Promise<DBResult<{ pollId: string; voterId: string }>> {
  const db = getDrizzle();
  const allOptions = await db
    .select()
    .from(pollOptions)
    .where(eq(pollOptions.pollId, data.pollId))
    .all();

  for (const opt of allOptions) {
    const voters = JSON.parse(opt.voters || '[]') as Array<{ id: string; name: string }>;
    const voterIndex = voters.findIndex((v) => v.id === data.voterId);
    if (voterIndex !== -1) {
      voters[voterIndex] = { id: data.voterId, name: data.voterName };
      await db
        .update(pollOptions)
        .set({ voters: JSON.stringify(voters) })
        .where(and(eq(pollOptions.pollId, data.pollId), eq(pollOptions.optionId, opt.optionId)));
    }
  }

  return { success: true, data: { pollId: data.pollId, voterId: data.voterId } };
}
