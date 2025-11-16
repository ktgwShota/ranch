'use client';

import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVoter } from '../hooks/useVoter';
import { usePollTimer } from '../hooks/usePollTimer';
import { useVote } from '../hooks/useVote';
import { Header } from './Header';
import { OptionCard } from './OptionCard';
import { TextInputDialog } from '@/app/components/TextInputDialog';
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
    nameDialogOpen,
    tempName,
    setTempName,
    handleNameSubmit,
    checkAndOpenDialog,
  } = useVoter(pollId);
  const { isPollClosed, timeRemaining, formatTime } = usePollTimer(poll);
  const { vote, voting, isVotedByUser } = useVote(poll, setPoll, userId, userName, checkAndOpenDialog);

  // チュートリアルを開始
  useEffect(() => {
    setupTutorial(
      [
        {
          elementId: 'poll-settings-button',
          title: 'メニュー',
          description: `このアイコンをクリックすると各種設定を操作できるメニューが表示されます。`,
          position: 'bottom',
        }
      ],
      'tutorial-poll-settings-button'
    );
  }, [poll, setupTutorial]);

  // タイマーで自動的に投票が終了した場合、サーバー側で再評価させる
  useEffect(() => {
    if (isPollClosed && poll && poll.isClosed === 0) {
      // クライアント側でタイマーが終了したが、サーバー側ではまだ終了していない場合
      // サーバー側で再評価させる
      router.refresh();
    }
  }, [isPollClosed, poll, router]);

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
        // サーバー側で再評価させるため、ページをリロード
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
        />
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 2.5, sm: 3, md: 4 },
            my: { xs: 2.5, sm: 3, md: 4 },
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {poll?.options.map((option) => {
            const isVoted = isVotedByUser(option);
            const isVoting = voting === option.id;
            const isAnyVoting = voting !== null; // 他の選択肢が投票中かどうか

            return (
              <OptionCard
                key={option.id}
                option={option}
                totalVotes={totalVotes}
                isVoted={isVoted}
                isVoting={isVoting}
                isDisabled={isAnyVoting && !isVoting} // 他の選択肢が投票中なら無効化
                onVote={() => vote(option.id)}
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
            fontSize: '0.875rem',
          }}
        >
          バナー広告
        </Box>
      </Box>

      <TextInputDialog
        open={nameDialogOpen}
        value={tempName}
        onValueChange={setTempName}
        onSubmit={handleNameSubmit}
        title="投票者名を入力してください"
        label="お名前"
        submitLabel="決定"
      />
    </>
  );
}

