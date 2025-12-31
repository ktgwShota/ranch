'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/layouts/PageHeader';
import { PageLayout } from '@/components/layouts/PageLayout';
import type { ParsedPoll as Poll } from '@/db/core/types';
import { useTutorialStore } from '@/stores/useTutorialStore';
import { usePollVote } from '../hooks/usePollVote';
import { PollMenu } from './PollMenu';
import { PollOptionCard } from './PollOptionCard';
import PollTimeRemaining from './PollTimeRemaining';
import { PollVoterNameDialog } from './PollVoterNameDialog';

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
  const { voter, setVoter, updateVoterName, vote, voting, isVotedByUser } = usePollVote(
    pollData.id
  );

  const [dialogState, setDialogState] = useState<DialogState | null>(null);

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
        },
      ],
      'tutorial-poll-settings-button'
    );
  }, [setupTutorial]);

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
            isOrganizer={true}
            actions={
              <PollMenu
                poll={pollData}
                onChangeVoterName={() => {
                  setDialogState({ mode: DIALOG_MODE.EDIT_VOTER_NAME });
                }}
              />
            }
          >
            <PollTimeRemaining poll={pollData} />
          </PageHeader>
        }
        contents={
          <div className="grid grid-cols-1 justify-center gap-6 md:grid-cols-2 lg:gap-8">
            {pollData.options.map((option) => {
              const totalVotes =
                pollData.options.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;
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
          </div>
        }
      />

      {dialogState && (
        <PollVoterNameDialog
          open
          onClose={() => setDialogState(null)}
          pollId={pollData.id}
          initialVoterName={
            dialogState.mode === DIALOG_MODE.EDIT_VOTER_NAME ? voter?.voterName : ''
          }
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
