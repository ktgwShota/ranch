'use client';

import { Box, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { usePollVote } from '../hooks/usePollVote';
import { Header } from './Header';
import { OptionCard } from './OptionCard';
import { VoterNameDialog } from './VoterNameDialog';
import { useTutorialStore } from '@/app/stores/tutorialStore';
import type { DBPoll as Poll } from '@/services/db/poll/types';

interface PollPageProps {
  pollData: Poll;
}

export default function PollPage({ pollData }: PollPageProps) {
  const { setupTutorial } = useTutorialStore();
  const { voter, setVoter, updateVoterName, vote, voting, isVotedByUser } = usePollVote(pollData.id);

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

    if (pendingOptionId !== null) {
      await vote(pendingOptionId, newVoter);
    }

    setDialogOpen(false);
    setDialogMode(null);
    setPendingOptionId(null);
  };

  const handleVoterNameChangeSubmit = async (name: string, newUserId: string) => {
    await updateVoterName(name, newUserId);

    setDialogOpen(false);
    setDialogMode(null);
  };

  return (
    <>
      <Box>
        <Header
          poll={pollData}
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
          {pollData.options.map((option) => {
            const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0) || 0;
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
        pollId={pollData.id}
        type={dialogMode || 'vote'}
        initialName={dialogMode === 'name-change' ? voter?.voterName : ''}
        onSubmit={dialogMode === 'vote' ? handleVoterNameSubmit : handleVoterNameChangeSubmit}
      />
    </>
  );
}

