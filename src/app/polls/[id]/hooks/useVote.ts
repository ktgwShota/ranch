import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { DBPoll as Poll, DBPollOption as Option } from '@/services/db/poll/types';

export function useVote(
  poll: Poll | null,
  setPoll: Dispatch<SetStateAction<Poll | null>>,
  userId: string,
  userName: string
) {
  const [voting, setVoting] = useState<number | null>(null);
  const [votedOptions, setVotedOptions] = useState<Set<number>>(new Set());

  const vote = async (optionId: number, overrideUserId?: string, overrideUserName?: string) => {
    if (!poll || voting) return;

    const currentUserId = overrideUserId || userId;
    const currentUserName = overrideUserName || userName;

    if (!currentUserId || !currentUserName) return;

    setVoting(optionId);

    // デザインのために1秒待ってから処理を開始
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // まず、他の選択肢から投票を削除（一人一票制）
    let updatedOptions = poll.options.map((option) => {
      if (option.id !== optionId && option.voters.some((voter) => voter.id === currentUserId)) {
        return {
          ...option,
          votes: option.votes - 1,
          voters: option.voters.filter((voter) => voter.id !== currentUserId),
        };
      }
      return option;
    });

    // 次に、対象の選択肢を処理
    updatedOptions = updatedOptions.map((option) => {
      if (option.id === optionId) {
        // 既にこの選択肢に投票済みの場合は投票を取り消し
        if (option.voters.some((voter) => voter.id === currentUserId)) {
          return {
            ...option,
            votes: option.votes - 1,
            voters: option.voters.filter((voter) => voter.id !== currentUserId),
          };
        } else {
          // 新しい選択肢に投票を追加
          return {
            ...option,
            votes: option.votes + 1,
            voters: [...option.voters, { id: currentUserId, name: currentUserName }],
          };
        }
      }
      return option;
    });

    const updatedPoll = {
      ...poll,
      options: updatedOptions,
    };

    setPoll(updatedPoll);

    // 投票状態を更新
    const newVotedOptions = new Set<number>();
    updatedOptions.forEach((option) => {
      if (option.voters.some((voter) => voter.id === currentUserId)) {
        newVotedOptions.add(option.id);
      }
    });
    setVotedOptions(newVotedOptions);

    try {
      await fetch(`/api/polls/${poll.id}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optionId,
          voterId: currentUserId,
          voterName: currentUserName,
        }),
      });
    } catch (error) {
      console.error('Error updating vote:', error);
    } finally {
      setVoting(null);
    }
  };

  const isVotedByUser = (option: Option) => {
    return option.voters.some((voter) => voter.id === userId);
  };

  const refreshPoll = async () => {
    if (!poll) return;
    try {
      const response = await fetch(`/api/polls/${poll.id}`);
      if (response.ok) {
        const updatedPoll = (await response.json()) as Poll;
        setPoll(updatedPoll);
      }
    } catch (error) {
      console.error('Error fetching updated poll:', error);
    }
  };

  return { vote, voting, votedOptions, isVotedByUser, refreshPoll };
}

