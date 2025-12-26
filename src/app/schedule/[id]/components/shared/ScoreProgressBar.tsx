'use client';

import { Box, Typography } from '@mui/material';
import { formatScore } from './types';

interface ScoreProgressBarProps {
  score: number;
  total: number;
  fontSize?: string;
  mt?: string;
}

export function ScoreProgressBar({ score, total, fontSize = '10px', mt = 'auto' }: ScoreProgressBarProps) {
  const ratio = total > 0 ? score / total : 0;
  const isFull = total > 0 && score === total;

  return (
    <Box sx={{ mt, position: 'relative', zIndex: 11, width: '100%' }}>
      <Box sx={{
        height: 6, backgroundColor: '#e0e0e0', overflow: 'hidden', borderRadius: 0.5,
      }}>
        <Box
          sx={{
            height: '100%',
            width: `${ratio * 100}%`,
            backgroundColor: ratio >= 0.8 ? '#4caf50' : ratio >= 0.5 ? '#ff9800' : '#f44336',
            transition: 'width 0.3s',
          }}
        />
      </Box>

      <Typography
        sx={{
          fontSize,
          mt,
          fontWeight: 600,
          textAlign: 'center',
          color: total === 0
            ? 'text.secondary'
            : isFull
              ? '#4caf50'
              : ratio >= 0.8
                ? '#4caf50'
                : ratio >= 0.5
                  ? '#ff9800'
                  : '#f44336',
        }}
      >
        {total === 0 ? (
          <>
            0<span style={{ margin: '0 1px' }}>/</span>0
          </>
        ) : (
          <>
            {formatScore(score)}
            <span style={{ margin: '0 1px' }}>/</span>
            {total}
          </>
        )}
      </Typography>
    </Box>
  );
}
