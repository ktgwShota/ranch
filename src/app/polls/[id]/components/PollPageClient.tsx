'use client';

import { Box, Skeleton, Snackbar } from '@mui/material';
import { useState } from 'react';
import { useVoter } from '../hooks/useVoter';
import { usePollTimer } from '../hooks/usePollTimer';
import { useVote } from '../hooks/useVote';
import { PollHeader } from './PollHeader';
import { OptionCard } from './OptionCard';
import { PollResultPage } from './PollResultPage';
import { VoterNameDialog } from './VoterNameDialog';
import PollResultDialog from '@/app/components/PollResultDialog';
import type { Poll } from '../types';

interface PollPageClientProps {
  initialPoll: Poll;
  pollId: string;
}

export function PollPageClient({ initialPoll, pollId }: PollPageClientProps) {
  const [poll, setPoll] = useState<Poll | null>(initialPoll);
  const {
    userName,
    userId,
    nameDialogOpen,
    tempName,
    setTempName,
    setNameDialogOpen,
    handleNameSubmit,
  } = useVoter(pollId);
  const { isPollClosed, timeRemaining, formatTime } = usePollTimer(poll);
  const { vote, voting, isVotedByUser } = useVote(poll, setPoll, userId, userName);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isEndingPoll, setIsEndingPoll] = useState(false);

  const getWinningOption = () => {
    if (!poll || poll.options.length === 0) return null;
    return poll.options.reduce((max, option) => (option.votes > max.votes ? option : max));
  };

  const endPoll = async () => {
    if (!poll) return;

    setIsEndingPoll(true);
    try {
      const response = await fetch(`/api/polls/${poll.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pollId: poll.id }),
      });

      if (response.ok) {
        const updatedPoll = (await fetch(`/api/polls/${poll.id}`).then((res) =>
          res.json()
        )) as Poll;
        setPoll(updatedPoll);
        setSnackbarMessage('投票を終了しました');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('投票の終了に失敗しました');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('投票終了エラー:', error);
      setSnackbarMessage('投票の終了に失敗しました');
      setSnackbarOpen(true);
    } finally {
      setIsEndingPoll(false);
    }
  };

  const totalVotes = poll?.options.reduce((sum, option) => sum + option.votes, 0) || 0;
  const winningOption = getWinningOption();

  // 投票が終了している場合は結果ページを表示
  if (poll && isPollClosed) {
    return (
      <Box sx={{ maxWidth: '900px', mx: 'auto', py: { xs: 2.5, sm: 3, md: 4 }, px: { xs: 2, sm: 3 }, boxSizing: 'border-box' }}>
        <PollResultPage poll={poll} totalVotes={totalVotes} winningOption={winningOption} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', py: { xs: 2.5, sm: 3, md: 4 }, px: { xs: 2, sm: 3 }, boxSizing: 'border-box' }}>
      <Box>
        <PollHeader
          poll={poll}
          loading={false}
          isPollClosed={isPollClosed}
          timeRemaining={timeRemaining}
          formatTime={formatTime}
          isEndingPoll={isEndingPoll}
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
            const isDecided = !!(isPollClosed && winningOption && option.id === winningOption.id);
            const isDisabled = !!(isPollClosed && !isDecided);

            return (
              <OptionCard
                key={option.id}
                option={option}
                totalVotes={totalVotes}
                isVoted={isVoted}
                isVoting={isVoting}
                isDisabled={isDisabled}
                isDecided={isDecided}
                isPollClosed={isPollClosed}
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

      <PollResultDialog />
      <VoterNameDialog
        open={nameDialogOpen}
        name={tempName}
        onNameChange={setTempName}
        onSubmit={handleNameSubmit}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

