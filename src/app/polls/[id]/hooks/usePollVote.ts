import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { DBPollOption as Option, Voter } from '@/services/db/poll/types';

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
      } catch (e) {
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
    const requestBody = {
      optionId,
      voterId: currentVoter.voterId,
      voterName: currentVoter.voterName,
    };

    console.log('Sending vote request:', { pollId, ...requestBody });

    const response = await fetch(`/api/polls/${pollId}/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to vote';
      try {
        const errorData = (await response.json()) as { error?: string; details?: string };
        errorMessage = errorData.error || errorData.details || errorMessage;
      } catch {
        // JSON解析に失敗した場合はデフォルトメッセージを使用
      }
      throw new Error(errorMessage);
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
      await fetch(`/api/polls/${pollId}/voter-name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voterId: newUserId,
          voterName: name,
        }),
      });
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

