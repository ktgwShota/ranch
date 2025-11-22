'use client';

import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVoter } from '../hooks/useVoter';
import { usePollTimer } from '../hooks/usePollTimer';
import { useVote } from '../hooks/useVote';
import { Header } from './Header';
import { OptionCard } from './OptionCard';
import { VoterNameDialog } from './VoterNameDialog';
import { useTutorialContext } from '@/app/contexts/TutorialContext';
import type { DBPoll as Poll } from '@/services/db/poll/types';

interface VotingPageProps {
  pollId: string;
  initialPoll: Poll;
}

export default function VotingPage({ pollId, initialPoll }: VotingPageProps) {
  const [poll, setPoll] = useState<Poll | null>(initialPoll);
  const { setupTutorial } = useTutorialContext();
  const router = useRouter();

  const {
    userName,
    userId,
    setUserName,
    setUserId,
  } = useVoter(pollId);
  const { timeRemaining, formatTime } = usePollTimer(poll);
  const { vote, voting, isVotedByUser, refreshPoll } = useVote(poll, setPoll, userId, userName);

  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [pendingOptionId, setPendingOptionId] = useState<number | null>(null);
  const [nameChangeDialogOpen, setNameChangeDialogOpen] = useState(false);

  const handleVoteClick = (optionId: number) => {
    if (!userId || !userName) {
      // 名前がない場合は投票用ダイアログを開く
      setPendingOptionId(optionId);
      setVoteDialogOpen(true);
    } else {
      // 名前がある場合は直接投票
      vote(optionId);
    }
  };

  const handleVoteNameSubmit = async (name: string, newUserId: string) => {
    // 名前とuserIdを更新
    setUserName(name);
    setUserId(newUserId);

    // 投票を実行（新しいuserIdとuserNameを渡す）
    if (pendingOptionId !== null) {
      await vote(pendingOptionId, newUserId, name);
      // 投票後にポーリングデータを再取得
      await refreshPoll();
    }

    setVoteDialogOpen(false);
    setPendingOptionId(null);
  };

  const handleNameChangeSubmit = async (name: string, newUserId: string) => {
    // 名前とuserIdを更新
    setUserName(name);
    setUserId(newUserId);

    // ポーリングデータを再取得（名前変更が反映されるように）
    await refreshPoll();

    setNameChangeDialogOpen(false);
  };

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
  }, [poll, setupTutorial]);

  // タイマーが0になったら、サーバー側で期限チェックと自動締切を実行させる
  useEffect(() => {
    if (timeRemaining === 0 && poll && poll.isClosed === 0 && poll.endDateTime) {
      router.refresh();
    }
  }, [timeRemaining, poll, router]);

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
    } catch (error) {
      console.error('投票終了エラー:', error);
    }
  };

  const totalVotes = poll?.options.reduce((sum, option) => sum + option.votes, 0) || 0;

  return (
    <>
      <Box>
        <Header
          poll={poll}
          loading={false}
          timeRemaining={timeRemaining}
          formatTime={formatTime}
          onEndPoll={endPoll}
          onChangeVoterName={() => {
            setNameChangeDialogOpen(true);
          }}
          hasVoterName={!!userName && !!userId}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
            },
            gap: { xs: 2, sm: 2.5 },
            my: { xs: 2, sm: 2.5 },
            justifyContent: 'center',
          }}
        >
          {poll?.options.map((option) => {
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
            p: 2.5,
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
        initialName={userName}
        onSubmit={handleNameChangeSubmit}
      />
    </>
  );
}

