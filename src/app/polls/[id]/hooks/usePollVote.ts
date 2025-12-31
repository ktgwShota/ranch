import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { registerVoterNameAction, submitVoteAction } from '@/app/polls/actions';
import type { ParsedPollOption as Option } from '@/db/core/types';

// ローカルストレージ用のVoter型（voterId/voterName形式）
export interface LocalVoter {
  voterId: string;
  voterName: string;
}

/**
 * 投票と投票者管理を行うカスタムフック
 * @param pollId 投票ID
 * @returns 投票者情報、投票機能、投票状態などのオブジェクト
 */
export function usePollVote(pollId: string) {
  const [voter, setVoter] = useState<LocalVoter | null>(null);
  const [voting, setVoting] = useState<number | null>(null);
  const router = useRouter();

  /**
   * localStorageから投票者情報を取得
   */
  useEffect(() => {
    const storageKey = `voterInfo_${pollId}`;
    const storedInfo = localStorage.getItem(storageKey);
    if (storedInfo) {
      try {
        const voterInfo: LocalVoter = JSON.parse(storedInfo);
        setVoter(voterInfo);
      } catch (_e) {
        localStorage.removeItem(storageKey);
      }
    }
  }, [pollId]);

  /**
   * 投票をサーバーに送信
   * @param optionId 投票するオプションID
   * @param currentVoter 投票者情報
   * @throws {Error} 投票の送信に失敗した場合
   */
  const sendVoteToServer = async (optionId: number, currentVoter: LocalVoter): Promise<void> => {
    console.log('Sending vote request:', { pollId, optionId, ...currentVoter });

    const result = await submitVoteAction({
      pollId,
      optionId,
      voterId: currentVoter.voterId,
      voterName: currentVoter.voterName,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to vote');
    }
  };

  /**
   * 投票を実行
   * @param optionId 投票するオプションID
   * @param overrideVoter 投票者情報（省略時は現在の投票者を使用）
   */
  const vote = async (optionId: number, overrideVoter?: LocalVoter) => {
    if (voting) return;

    const currentVoter = overrideVoter || voter;
    if (!currentVoter) return;

    setVoting(optionId);

    try {
      // デザインのために1秒待ってから処理を開始
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // サーバーに投票を送信
      await sendVoteToServer(optionId, currentVoter);

      // サーバーから最新データを取得するためにページを再レンダリング
      router.refresh();
    } catch (error) {
      console.error('Error voting:', error);
      console.error('Error details:', {
        pollId,
        optionId,
        voter: currentVoter,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setVoting(null);
    }
  };

  /**
   * ユーザーが投票済みかチェック
   * @param option チェックするオプション
   * @returns 投票済みの場合true、それ以外はfalse
   */
  const isVotedByUser = (option: Option) => {
    if (!voter) return false;
    return option.voters.some((v) => v.id === voter.voterId);
  };

  /**
   * 投票者名を更新
   * @param name 新しい投票者名
   * @param newUserId 新しい投票者ID
   */
  const updateVoterName = async (name: string, newUserId: string) => {
    setVoter({ voterId: newUserId, voterName: name });

    // データベースの投票者名も更新
    try {
      const result = await registerVoterNameAction({
        pollId,
        voterId: newUserId,
        voterName: name,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to update voter name');
      }

      // 名前変更後にページを再レンダリング
      router.refresh();
    } catch (error) {
      console.error('Error updating voter name:', error);
    }
  };

  return {
    voter,
    setVoter,
    updateVoterName,
    vote,
    voting,
    isVotedByUser,
  };
}
