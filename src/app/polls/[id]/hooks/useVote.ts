import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { DBPoll as Poll, DBPollOption as Option } from '@/services/db/poll/types';

export function useVote(
  poll: Poll | null,
  setPoll: Dispatch<SetStateAction<Poll | null>>,
  userId: string,
  userName: string,
  checkAndOpenDialog?: () => boolean
) {
  const [voting, setVoting] = useState<number | null>(null);
  const [votedOptions, setVotedOptions] = useState<Set<number>>(new Set());

  const vote = async (optionId: number) => {
    if (!poll || voting) return;

    // 投票者名が存在しない場合はダイアログを開いて投票を中断
    if (checkAndOpenDialog && !checkAndOpenDialog()) {
      return;
    }

    if (!userId || !userName) return;

    setVoting(optionId);

    // まず、他の選択肢から投票を削除（一人一票制）
    let updatedOptions = poll.options.map((option) => {
      if (option.id !== optionId && option.voters.some((voter) => voter.id === userId)) {
        return {
          ...option,
          votes: option.votes - 1,
          voters: option.voters.filter((voter) => voter.id !== userId),
        };
      }
      return option;
    });

    // 次に、対象の選択肢を処理
    updatedOptions = updatedOptions.map((option) => {
      if (option.id === optionId) {
        // 既にこの選択肢に投票済みの場合は投票を取り消し
        if (option.voters.some((voter) => voter.id === userId)) {
          return {
            ...option,
            votes: option.votes - 1,
            voters: option.voters.filter((voter) => voter.id !== userId),
          };
        } else {
          // 新しい選択肢に投票を追加
          return {
            ...option,
            votes: option.votes + 1,
            voters: [...option.voters, { id: userId, name: userName }],
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
      if (option.voters.some((voter) => voter.id === userId)) {
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
          voterId: userId,
          voterName: userName,
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

  return { vote, voting, votedOptions, isVotedByUser };
}

