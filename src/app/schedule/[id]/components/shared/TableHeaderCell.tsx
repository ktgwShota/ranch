'use client';

import { Box, Typography } from '@mui/material';
import { Dayjs } from 'dayjs';
import { formatScore } from './types';

interface TableHeaderCellProps {
  date: Dayjs;
  time?: string;
  score: number;
  total: number;
  isConfirmed?: boolean;
  isBest?: boolean;
  confirmedLabel?: string;
}

export default function TableHeaderCell({
  date,
  time,
  score,
  total,
  isConfirmed = false,
  isBest = false,
}: TableHeaderCellProps) {
  const ratio = total > 0 ? score / total : 0;
  const isFull = total > 0 && score === total;

  return (
    <Box
      sx={{
        width: 96,
        flexShrink: 0,
        textAlign: 'center',
        pt: isConfirmed ? 3 : 2,
        pb: 1,
        px: 0.5,
        borderRight: '1px solid #e5e7eb',
        '&:last-child': { borderRight: 'none' },
        backgroundColor: isBest && !isConfirmed
          ? 'rgba(76, 175, 80, 0.12)'
          : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* 決定オーバーレイ（縦のライン全体を覆う） */}
      {isConfirmed && (
        <>
          {/* 背景オーバーレイ */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2000px',
              backgroundColor: 'rgba(33, 150, 243, 0.12)',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          />
          {/* 上部バナー */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: '#2196f3',
              py: 0.25,
              zIndex: 12,
            }}
          >
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '1px',
              }}
            >
              決定
            </Typography>
          </Box>
        </>
      )}

      {/* 上部: 日付と時間 */}
      <Box sx={{ position: 'relative', zIndex: 11 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '12px', lineHeight: 1.3 }}>
          {date.format('M月D日')} ({date.format('ddd')})
        </Typography>
        {time && (
          <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 0.25 }}>
            {time} ~
          </Typography>
        )}
      </Box>

      {/* 下部: 進捗バーと数字 */}
      <Box sx={{ mt: 'auto', position: 'relative', zIndex: 11 }}>
        <Box sx={{ mt: 0.75, mx: 1, height: 6, backgroundColor: '#e0e0e0', overflow: 'hidden' }}>
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
            fontSize: '10px',
            fontWeight: 600,
            mt: 0.25,
            color:
              total === 0
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
          {total === 0 ? '0/0' : `${formatScore(score)}/${total}`}
        </Typography>
      </Box>
    </Box>
  );
}

