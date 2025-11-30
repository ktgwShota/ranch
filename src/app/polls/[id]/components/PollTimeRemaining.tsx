import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import type { DBPoll as Poll } from '@/services/db/poll/types';

interface PollTimeRemainingProps {
  poll: Poll;
}

function formatTime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const mins = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;

  const hoursStr = String(hours).padStart(2, '0');
  const minsStr = String(mins).padStart(2, '0');
  const secsStr = String(secs).padStart(2, '0');

  if (days > 0) {
    return `${days}日${hoursStr}時間${minsStr}分${secsStr}秒`;
  } else if (hours > 0) {
    return `${hoursStr}時間${minsStr}分${secsStr}秒`;
  } else if (mins > 0) {
    return `${minsStr}分${secsStr}秒`;
  } else {
    return `${secsStr}秒`;
  }
}

export function PollTimeRemaining({ poll }: PollTimeRemainingProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // リアルタイム更新のため、1秒ごとに再レンダリング
  useEffect(() => {
    if (!poll.endDateTime || poll.isClosed === 1) {
      setTimeLeft(-1); // -1 を無制限または終了済みとする（表示ロジックで制御）
      return;
    }

    const calculateTimeLeft = () => {
      if (!poll.endDateTime) return -1;
      const endTime = new Date(poll.endDateTime).getTime();
      const now = Date.now();
      return Math.max(0, Math.ceil((endTime - now) / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [poll]);

  if (!mounted || timeLeft === null) {
    return null; // またはスケルトンを表示
  }

  const hasEndTime = !!poll.endDateTime;
  const timeLabel = hasEndTime && timeLeft !== -1 ? formatTime(timeLeft) : '無制限';

  return (
    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5, minHeight: 20 }}>
      <Typography
        variant="caption"
        sx={{
          color: '#6b7280',
          fontSize: '12px',
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        投票受付時間:
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#1e40af',
          fontSize: '12px',
          fontWeight: 500,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1,
        }}
      >
        {timeLabel}
      </Typography>
    </Box>
  );
}

