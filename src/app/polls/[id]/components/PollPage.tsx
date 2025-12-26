'use client';

import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { usePollVote } from '../hooks/usePollVote';
import { PollOptionCard } from './PollOptionCard';
import { PollVoterNameDialog } from './PollVoterNameDialog';
import { useTutorialStore } from '@/stores/useTutorialStore';
import type { DBPoll as Poll } from '@/services/db/poll/types';
import { PageLayout } from '@/components/layouts/PageLayout';
import PageHeader from '@/components/layouts/PageHeader';
import { PollMenu } from './PollMenu';
import PollTimeRemaining from './PollTimeRemaining';

const DIALOG_MODE = {
  CAST_VOTE: 'castVote',
  EDIT_VOTER_NAME: 'editVoterName',
} as const;

type DialogState =
  | { mode: typeof DIALOG_MODE.CAST_VOTE; optionId: number }
  | { mode: typeof DIALOG_MODE.EDIT_VOTER_NAME };

interface PollPageProps {
  pollData: Poll;
}

export default function PollPage({ pollData }: PollPageProps) {
  const { setupTutorial } = useTutorialStore();
  const { voter, setVoter, updateVoterName, vote, voting, isVotedByUser } = usePollVote(pollData.id);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const [dialogState, setDialogState] = useState<DialogState | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  useEffect(() => {
    setupTutorial(
      [
        {
          elementId: 'option-title-1',
          title: '候補リスト',
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
      setDialogState({ mode: DIALOG_MODE.CAST_VOTE, optionId });
      return;
    }
    vote(optionId);
  };

  const handleVoterNameSubmit = async (name: string, newUserId: string, optionId?: number) => {
    const newVoter = { voterId: newUserId, voterName: name };
    setVoter(newVoter);

    if (optionId !== undefined) {
      await vote(optionId, newVoter);
    }

    setDialogState(null);
  };

  const handleVoterNameChangeSubmit = async (name: string, newUserId: string) => {
    await updateVoterName(name, newUserId);

    setDialogState(null);
  };

  return (
    <>
      <PageLayout
        header={
          <PageHeader
            title={pollData.title}
            onOrganizerMenuClick={handleMenuOpen}
            isOrganizer={true}
            actions={
              <PollMenu
                poll={pollData}
                onChangeVoterName={() => {
                  setDialogState({ mode: DIALOG_MODE.EDIT_VOTER_NAME });
                }}
                anchorEl={menuAnchorEl}
                onClose={handleMenuClose}
              />
            }
          >
            <PollTimeRemaining poll={pollData} />
          </PageHeader>
        }
        contents={
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
              },
              gap: { xs: 2, sm: 3 },
              // my removed as it is handled by layout
              justifyContent: 'center',
            }}
          >
            {pollData.options.map((option) => {
              const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0) || 0;
              const isVoted = isVotedByUser(option);
              const isVoting = voting === option.id;
              const isAnyVoting = voting !== null;

              return (
                <PollOptionCard
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
        }
      />

      {dialogState && (
        <PollVoterNameDialog
          open
          onClose={() => setDialogState(null)}
          pollId={pollData.id}
          initialVoterName={dialogState.mode === DIALOG_MODE.EDIT_VOTER_NAME ? voter?.voterName : ''}
          onSubmit={(name, userId) => {
            if (dialogState.mode === DIALOG_MODE.CAST_VOTE) {
              return handleVoterNameSubmit(name, userId, dialogState.optionId);
            }
            return handleVoterNameChangeSubmit(name, userId);
          }}
        />
      )}
    </>
  );
}

