import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { DBPoll as Poll, DBPollOption as Option } from '@/services/db/poll/types';
import type { Voter } from './useVoter';

export function useVote(
  poll: Poll | null,
  setPoll: Dispatch<SetStateAction<Poll | null>>,
  voter: Voter | null
) {
  const [voting, setVoting] = useState<number | null>(null);
  const [votedOptions, setVotedOptions] = useState<Set<number>>(new Set());

  const removeVoteFromOtherOptions = (options: Option[], targetOptionId: number, voterId: string): Option[] => {
    return options.map((option) => {
      if (option.id !== targetOptionId && option.voters.some((v) => v.id === voterId)) {
        return {
          ...option,
          votes: option.votes - 1,
          voters: option.voters.filter((v) => v.id !== voterId),
        };
      }
      return option;
    });
  };

  const toggleVoteForOption = (options: Option[], optionId: number, currentVoter: Voter): Option[] => {
    return options.map((option) => {
      if (option.id !== optionId) return option;

      const hasVoted = option.voters.some((v) => v.id === currentVoter.voterId);

      if (hasVoted) {
        // 投票を取り消し
        return {
          ...option,
          votes: option.votes - 1,
          voters: option.voters.filter((v) => v.id !== currentVoter.voterId),
        };
      }

      // 投票を追加
      return {
        ...option,
        votes: option.votes + 1,
        voters: [...option.voters, { id: currentVoter.voterId, name: currentVoter.voterName }],
      };
    });
  };

  const updateVotedOptions = (options: Option[], voterId: string): Set<number> => {
    const newVotedOptions = new Set<number>();
    options.forEach((option) => {
      if (option.voters.some((v) => v.id === voterId)) {
        newVotedOptions.add(option.id);
      }
    });
    return newVotedOptions;
  };

  const sendVoteToServer = async (pollId: string, optionId: number, currentVoter: Voter): Promise<void> => {
    try {
      await fetch(`/api/polls/${pollId}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optionId,
          voterId: currentVoter.voterId,
          voterName: currentVoter.voterName,
        }),
      });
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

  const vote = async (optionId: number, overrideVoter?: Voter) => {
    if (!poll || voting) return;

    const currentVoter = overrideVoter || voter;
    if (!currentVoter) return;

    setVoting(optionId);

    // デザインのために1秒待ってから処理を開始
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 他の選択肢から投票を削除（一人一票制）
    let updatedOptions = removeVoteFromOtherOptions(poll.options, optionId, currentVoter.voterId);

    // 対象の選択肢の投票をトグル
    updatedOptions = toggleVoteForOption(updatedOptions, optionId, currentVoter);

    const updatedPoll = {
      ...poll,
      options: updatedOptions,
    };

    setPoll(updatedPoll);

    // 投票状態を更新
    const newVotedOptions = updateVotedOptions(updatedOptions, currentVoter.voterId);
    setVotedOptions(newVotedOptions);

    // サーバーに投票を送信
    await sendVoteToServer(poll.id, optionId, currentVoter);
    setVoting(null);
  };

  const isVotedByUser = (option: Option) => {
    if (!voter) return false;
    return option.voters.some((v) => v.id === voter.voterId);
  };

  const refreshPoll = async () => {
    if (!poll) return;
    try {
      const response = await fetch(`/api/polls/${poll.id}`);
      if (response.ok) {
        const updatedPoll: Poll = await response.json();
        setPoll(updatedPoll);
      }
    } catch (error) {
      console.error('Error fetching updated poll:', error);
    }
  };

  return { vote, voting, votedOptions, isVotedByUser, refreshPoll };
}

