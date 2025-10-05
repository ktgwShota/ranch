import { Database } from '../services/database';
import { CreatePollData, UpdatePollData } from '../../types/worker';

/**
 * 投票関連のルーティング
 */
export async function handlePollRoutes(request: Request, db: Database, path: string, method: string) {
  if (path === '/worker/db/polls' && method === 'POST') {
    const body: CreatePollData = await request.json();
    return await db.createPoll(body);
  } else if (path === '/worker/db/polls' && method === 'GET') {
    return await db.getAllPolls();
  } else if (path.match(/^\/worker\/db\/polls\/([^\/]+)$/) && method === 'GET') {
    const pollId = path.split('/')[4];
    return await db.getPollById(pollId);
  } else if (path.match(/^\/worker\/db\/polls\/([^\/]+)$/) && method === 'PUT') {
    const pollId = path.split('/')[4];
    const body: UpdatePollData = await request.json();
    body.id = pollId;
    return await db.updatePoll(body);
  } else if (path.match(/^\/worker\/db\/polls\/([^\/]+)\/votes$/) && method === 'POST') {
    const pollId = path.split('/')[4];
    const body: { optionId: number; voterId: string } = await request.json();
    return await db.recordVote({
      pollId,
      optionId: body.optionId,
      voterId: body.voterId
    });
  } else if (path.match(/^\/worker\/db\/polls\/([^\/]+)\/close$/) && method === 'POST') {
    const pollId = path.split('/')[4];
    return await db.closePoll(pollId);
  } else {
    throw new Error('Method not allowed');
  }
}
