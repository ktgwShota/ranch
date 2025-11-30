'use client';

import { Box, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVoter } from '../hooks/useVoter';
import { useVote } from '../hooks/useVote';
import { Header } from './Header';
import { OptionCard } from './OptionCard';
import { VoterNameDialog } from './VoterNameDialog';
import { useTutorialStore } from '@/app/stores/tutorialStore';
import type { DBPoll as Poll } from '@/services/db/poll/types';

interface PollPageProps {
  data: Poll;
}

export default function PollPage({ data }: PollPageProps) {
  const { setupTutorial } = useTutorialStore();
  const [poll, setPoll] = useState<Poll | null>(data);
  const router = useRouter();
  const pollId = data.id;

  const { voter, setVoter } = useVoter(pollId);
  const { vote, voting, isVotedByUser, refreshPoll } = useVote(poll, setPoll, voter);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'vote' | 'name-change' | null>(null);
  const [pendingOptionId, setPendingOptionId] = useState<number | null>(null);

  useEffect(() => {
    setupTutorial(
      [
        {
          elementId: 'option-title-1',
          title: '店舗情報',
          description: `クリックすると店舗の詳細が表示されます。※外部サイトに遷移します`,
          position: 'bottom',
        },
        {
          elementId: 'poll-settings-button',
          title: 'メニュー',
          description: `投票者名の変更や投票受付の早期終了など、各種設定ができます。※一部機能は権限が必要です`,
          position: 'bottom',
        }
      ],
      'tutorial-poll-settings-button'
    );
  }, []);


  const handleVoteClick = (optionId: number) => {
    if (!voter) {
      setPendingOptionId(optionId);
      setDialogMode('vote');
      setDialogOpen(true);
    } else {
      vote(optionId);
    }
  };

  const handleVoterNameSubmit = async (name: string, newUserId: string) => {
    const newVoter = { voterId: newUserId, voterName: name };
    setVoter(newVoter);

    // 投票を実行（新しいvoterを渡す）
    if (pendingOptionId !== null) {
      await vote(pendingOptionId, newVoter);
      // 投票後にポーリングデータを再取得
      await refreshPoll();
    }

    setDialogOpen(false);
    setDialogMode(null);
    setPendingOptionId(null);
  };

  const handleVoterNameChangeSubmit = async (name: string, newUserId: string) => {
    // 名前とuserIdを更新
    setVoter({ voterId: newUserId, voterName: name });

    // ポーリングデータを再取得（名前変更が反映されるように）
    await refreshPoll();

    setDialogOpen(false);
    setDialogMode(null);
  };

  const endPoll = async () => {
    if (!poll) return;

    try {
      const response = await fetch(`/api/polls/${poll.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pollId: poll.id }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (e) {
    }
  };

  return (
    <>
      <Box>
        <Header
          poll={poll}
          onEndPoll={endPoll}
          onChangeVoterName={() => {
            setDialogMode('name-change');
            setDialogOpen(true);
          }}
          hasVoterName={!!voter}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
            },
            gap: { xs: 2, sm: 3 },
            my: { xs: 2, sm: 3 },
            justifyContent: 'center',
          }}
        >
          {poll?.options.map((option) => {
            const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0) || 0;
            const isVoted = isVotedByUser(option);
            const isVoting = voting === option.id;
            const isAnyVoting = voting !== null;

            return (
              <OptionCard
                key={option.id}
                option={option}
                totalVotes={totalVotes}
                isVoted={isVoted}
                isVoting={isVoting}
                isDisabled={isAnyVoting && !isVoting}
                onVote={() => handleVoteClick(option.id)}
              />
            );
          })}
        </Box>

        <Box
          sx={{
            border: '1px solid #e5e7eb',
            backgroundColor: '#f3f4f6',
            p: 3,
            borderRadius: 1,
            height: 128,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
            fontSize: '14px',
          }}
        >
          バナー広告
        </Box>
      </Box>

      <VoterNameDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setDialogMode(null);
          setPendingOptionId(null);
        }}
        pollId={pollId}
        type={dialogMode || 'vote'}
        initialName={dialogMode === 'name-change' ? voter?.voterName : ''}
        onSubmit={dialogMode === 'vote' ? handleVoterNameSubmit : handleVoterNameChangeSubmit}
      />
    </>
  );
}

