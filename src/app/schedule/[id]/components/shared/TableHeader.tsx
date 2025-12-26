'use client';

import { Box, Typography } from '@mui/material';
import { type DateTimeItem, type Response, calculateSummary, calculateScore } from './types';
import { DateStatusCard } from './DateStatusCard';

interface TableHeaderProps {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  confirmedDateTime: string | null;
  bestKeys?: Set<string>;
  confirmedLabel?: string;
  hasNameColumn?: boolean; // 追加
}

export default function TableHeader({
  allDateTimes,
  responses,
  confirmedDateTime,
  bestKeys,
  hasNameColumn = true, // デフォルトは表示
}: TableHeaderProps) {
  return (
    <Box sx={{
      display: 'flex', borderBottom: '1px solid #e5e7eb',
    }}>
      {/* 左端の固定列（名前用） */}
      {hasNameColumn && (
        <Box
          sx={{
            width: 100,
            flexShrink: 0,
            borderRight: '1px solid #e5e7eb',
            position: 'sticky',
            left: 0,
            zIndex: 20,
            backgroundColor: 'white',
          }}
        />
      )}

      {/* 日時列 */}
      {allDateTimes.map(({ date, time, key }, index) => {
        const summary = calculateSummary(key, responses);
        const score = calculateScore(summary.available, summary.maybe);
        const isConfirmed = confirmedDateTime === key;
        const isDismissed = !!confirmedDateTime && !isConfirmed;
        const isBest = bestKeys?.has(key) ?? false;
        const isClosed = !!confirmedDateTime;
        const isLast = index === allDateTimes.length - 1;

        return (
          <Box
            key={key}
            sx={{
              display: 'flex',
              flex: 1,
              minWidth: 100,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {isClosed && (
              <Typography
                sx={{
                  width: '100%',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'white',
                  backgroundColor: isConfirmed
                    ? 'rgb(33, 150, 243)'
                    : isDismissed
                      ? 'rgb(158, 158, 158)'
                      : 'transparent',
                }}
              >
                {isConfirmed && '決定'}
              </Typography>
            )}

            <DateStatusCard
              key={key}
              date={date}
              time={time}
              score={score}
              total={responses.length}
              isConfirmed={isConfirmed}
              isDismissed={isDismissed}
              isBest={isBest}
              sx={{
                borderRight: isLast ? 'none' : '1px solid #e5e7eb',
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}

