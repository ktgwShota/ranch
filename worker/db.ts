import { D1Database } from '@cloudflare/workers-types';
import { Poll, CreatePollData, UpdatePollData, VoteData, DBResult, PollOption } from './types';

/**
 * 統合されたデータベース操作クラス
 * 純粋なデータベース操作のみを行う
 */
export class Database {
  constructor(private db: D1Database) { }

  /**
   * データベース接続のテスト
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.db.prepare('SELECT 1').first();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ==================== Polls Operations ====================

  /**
   * 投票を作成する
   */
  async createPoll(data: CreatePollData): Promise<DBResult<Poll>> {
    try {
      // 投票データを挿入
      await this.db.prepare(`
        INSERT INTO polls (id, title, duration, endDateTime, createdBy, createdAt, isClosed)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        data.id,
        data.title,
        data.duration,
        data.endDateTime,
        data.createdBy,
        data.createdAt,
        data.isClosed
      ).run();

      // 選択肢を挿入
      for (const option of data.options) {
        await this.db.prepare(`
          INSERT INTO poll_options (poll_id, option_id, url, title, description, image, votes, voters)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          data.id,
          option.id,
          option.url,
          option.title,
          option.description,
          option.image || null,
          0,
          '[]'
        ).run();
      }

      // 作成された投票データを取得
      const poll = await this.getPollById(data.id);
      return { success: true, data: poll.data };
    } catch (error) {
      console.error('Error creating poll:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * IDで投票を取得する
   */
  async getPollById(id: string): Promise<DBResult<Poll>> {
    try {
      const poll = await this.db.prepare(`
        SELECT p.*, 
               json_group_array(
                 json_object(
                   'id', po.option_id,
                   'url', po.url,
                   'title', po.title,
                   'description', po.description,
                   'image', po.image,
                   'votes', po.votes,
                   'voters', json(po.voters)
                 )
               ) as options
        FROM polls p
        LEFT JOIN poll_options po ON p.id = po.poll_id
        WHERE p.id = ?
        GROUP BY p.id
      `).bind(id).first();

      if (!poll) {
        return { success: false, error: 'Poll not found' };
      }

      poll.options = JSON.parse(poll.options);
      return { success: true, data: poll as Poll };
    } catch (error) {
      console.error('Error fetching poll:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 全ての投票を取得する
   */
  async getAllPolls(): Promise<DBResult<Poll[]>> {
    try {
      const polls = await this.db.prepare(`
        SELECT p.*, 
               json_group_array(
                 json_object(
                   'id', po.option_id,
                   'url', po.url,
                   'title', po.title,
                   'description', po.description,
                   'image', po.image,
                   'votes', po.votes,
                   'voters', json(po.voters)
                 )
               ) as options
        FROM polls p
        LEFT JOIN poll_options po ON p.id = po.poll_id
        GROUP BY p.id
        ORDER BY p.createdAt DESC
      `).all();

      const pollsWithOptions = polls.results.map((poll: any) => {
        poll.options = JSON.parse(poll.options);
        return poll;
      });

      return { success: true, data: pollsWithOptions as Poll[] };
    } catch (error) {
      console.error('Error fetching polls:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 投票を更新する
   */
  async updatePoll(data: UpdatePollData): Promise<DBResult<Poll>> {
    try {
      // 既存の投票が存在するかチェック
      const existingPoll = await this.db.prepare(`
        SELECT * FROM polls WHERE id = ?
      `).bind(data.id).first();

      if (!existingPoll) {
        return { success: false, error: 'Poll not found' };
      }

      // 既存の選択肢を削除
      await this.db.prepare(`
        DELETE FROM poll_options WHERE poll_id = ?
      `).bind(data.id).run();

      // 新しい選択肢を挿入
      for (const option of data.options) {
        await this.db.prepare(`
          INSERT INTO poll_options (poll_id, option_id, url, title, description, image, votes, voters)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          data.id,
          option.id,
          option.url,
          option.title,
          option.description,
          option.image,
          option.votes,
          JSON.stringify(option.voters)
        ).run();
      }

      // 更新された投票データを取得
      const updatedPoll = await this.getPollById(data.id);
      return { success: true, data: updatedPoll.data };
    } catch (error) {
      console.error('Error updating poll:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 投票を記録する
   */
  async recordVote(data: VoteData): Promise<DBResult<Poll>> {
    try {
      // 投票が存在し、終了していないかチェック
      const poll = await this.db.prepare(`
        SELECT * FROM polls WHERE id = ? AND isClosed = 0
      `).bind(data.pollId).first();

      if (!poll) {
        return { success: false, error: 'Poll not found or already closed' };
      }

      // 選択肢が存在するかチェック
      const option = await this.db.prepare(`
        SELECT * FROM poll_options WHERE poll_id = ? AND option_id = ?
      `).bind(data.pollId, data.optionId).first();

      if (!option) {
        return { success: false, error: 'Option not found' };
      }

      // 既に投票済みかチェック
      const voters = JSON.parse(option.voters);
      if (voters.includes(data.voterId)) {
        return { success: false, error: 'Already voted' };
      }

      // 投票を追加
      voters.push(data.voterId);
      await this.db.prepare(`
        UPDATE poll_options 
        SET votes = votes + 1, voters = ? 
        WHERE poll_id = ? AND option_id = ?
      `).bind(JSON.stringify(voters), data.pollId, data.optionId).run();

      // 更新された投票データを取得
      const updatedPoll = await this.getPollById(data.pollId);
      return { success: true, data: updatedPoll.data };
    } catch (error) {
      console.error('Error recording vote:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 投票を終了する
   */
  async closePoll(pollId: string): Promise<DBResult<Poll>> {
    try {
      // 投票が存在するかチェック
      const poll = await this.db.prepare(`
        SELECT * FROM polls WHERE id = ?
      `).bind(pollId).first();

      if (!poll) {
        return { success: false, error: 'Poll not found' };
      }

      // 投票を終了
      await this.db.prepare(`
        UPDATE polls SET isClosed = 1 WHERE id = ?
      `).bind(pollId).run();

      // 更新された投票データを取得
      const updatedPoll = await this.getPollById(pollId);
      return { success: true, data: updatedPoll.data };
    } catch (error) {
      console.error('Error closing poll:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
