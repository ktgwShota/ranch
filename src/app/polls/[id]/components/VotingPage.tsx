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

interface VotingPageProps {
  pollId: string;
  initialPoll: Poll;
}

export default function VotingPage({ pollId, initialPoll }: VotingPageProps) {
  const [poll, setPoll] = useState<Poll | null>(initialPoll);
  const { setupTutorial } = useTutorialStore();
  const router = useRouter();

  const { voter, setVoter } = useVoter(pollId);
  const { vote, voting, isVotedByUser, refreshPoll } = useVote(poll, setPoll, voter);

  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [pendingOptionId, setPendingOptionId] = useState<number | null>(null);
  const [nameChangeDialogOpen, setNameChangeDialogOpen] = useState(false);

  useEffect(() => {
    setupTutorial(
      [
        {
          elementId: 'option-title-1',
          title: '店舗情報',
          description: `こちらをクリックすると店舗情報が表示されます。外部サイトに遷移します。`,
          position: 'bottom',
        },
        {
          elementId: 'poll-settings-button',
          title: 'メニュー',
          description: `名前の変更や投票の早期終了などの設定ができます。一部機能は権限が必要です。`,
          position: 'bottom',
        }
      ],
      'tutorial-poll-settings-button'
    );
  }, []);

  // ユーザーが閲覧中に投票受付時間が切れた場合、強制的にリロードすることで ResultPage を表示
  useEffect(() => {
    if (!poll || poll.isClosed === 1 || !poll.endDateTime) {
      return;
    }

    const endDateTime = poll.endDateTime;
    const checkTimeRemaining = () => {
      const endTime = new Date(endDateTime).getTime();
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);

      if (remaining <= 0) {
        router.refresh();
      }
    };

    const timer = setInterval(checkTimeRemaining, 1000);
    return () => clearInterval(timer);
  }, [poll, router]);

  const handleVoteClick = (optionId: number) => {
    if (!voter) {
      setPendingOptionId(optionId);
      setVoteDialogOpen(true);
    } else {
      vote(optionId);
    }
  };

  const handleVoteNameSubmit = async (name: string, newUserId: string) => {
    // 名前とuserIdを更新
    const newVoter = { id: newUserId, name };
    setVoter(newVoter);

    // 投票を実行（新しいvoterを渡す）
    if (pendingOptionId !== null) {
      await vote(pendingOptionId, newVoter);
      // 投票後にポーリングデータを再取得
      await refreshPoll();
    }

    setVoteDialogOpen(false);
    setPendingOptionId(null);
  };

  const handleNameChangeSubmit = async (name: string, newUserId: string) => {
    // 名前とuserIdを更新
    setVoter({ id: newUserId, name });

    // ポーリングデータを再取得（名前変更が反映されるように）
    await refreshPoll();

    setNameChangeDialogOpen(false);
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
            setNameChangeDialogOpen(true);
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
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          バナー広告
        </Box>
      </Box>

      {/* 投票用の名前入力ダイアログ */}
      {pendingOptionId !== null && (
        <VoterNameDialog
          open={voteDialogOpen}
          onClose={() => {
            setVoteDialogOpen(false);
            setPendingOptionId(null);
          }}
          pollId={pollId}
          type="vote"
          onSubmit={handleVoteNameSubmit}
        />
      )}

      {/* 名前変更用の名前入力ダイアログ */}
      <VoterNameDialog
        open={nameChangeDialogOpen}
        onClose={() => {
          setNameChangeDialogOpen(false);
        }}
        pollId={pollId}
        type="name-change"
        initialName={voter?.name}
        onSubmit={handleNameChangeSubmit}
      />
    </>
  );
}

