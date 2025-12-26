'use client';

import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import type { Dayjs } from 'dayjs';
import { FormattedDate } from '@/components/ui/FormattedDate';
import { ScoreProgressBar } from './ScoreProgressBar';

interface DateStatusCardProps {
  date: Dayjs;
  time?: string;
  score: number;
  total: number;
  isConfirmed?: boolean;
  isDismissed?: boolean;
  isBest?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export function DateStatusCard({
  date,
  time,
  score,
  total,
  isConfirmed = false,
  isDismissed = false,
  isBest = false,
  isSelected = false,
  onClick,
  sx,
}: DateStatusCardProps) {
  return (
    <Box
      onClick={onClick}
      sx={[
        {
          flex: 1,
          minWidth: 100,
          width: '100%',
          backgroundColor: isSelected
            ? 'rgba(25, 118, 210, 0.08)'
            : isConfirmed
              ? 'rgba(33, 150, 243, 0.12)'
              : isDismissed
                ? 'rgba(0, 0, 0, 0.04)'
                : isBest
                  ? 'rgba(76, 175, 80, 0.1)'
                  : 'white',
          color: 'text.primary',
          cursor: onClick ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1.5,
          transition: 'background-color 0.2s',
          '&:hover': onClick ? { backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.12)' : '#f5f5f5' } : undefined,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 0.5 }}>
          <FormattedDate date={date} />
        </Typography>


        <Typography sx={{ fontSize: '10px', color: 'text.secondary', mb: 1 }}>
          {time ? `${time} ~` : '-'}
        </Typography>


        <ScoreProgressBar score={score} total={total} />
      </Box>
    </Box >
  );
}
