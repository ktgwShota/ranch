'use client';

import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

interface ActiveTimeRemainingProps {
  endDateTime: string | null;
  isClosed: boolean;
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

export default function ActiveTimeRemaining({ endDateTime, isClosed }: ActiveTimeRemainingProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!endDateTime || isClosed) {
      return;
    }

    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [endDateTime, isClosed]);

  const getTimeRemaining = (): number => {
    if (!endDateTime) return 0;
    const endTime = new Date(endDateTime).getTime();
    const now = Date.now();
    return Math.max(0, Math.ceil((endTime - now) / 1000));
  };

  const hasEndTime = !!endDateTime;
  const timeLabel = hasEndTime ? formatTime(getTimeRemaining()) : '無制限';

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
        受付時間:
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

