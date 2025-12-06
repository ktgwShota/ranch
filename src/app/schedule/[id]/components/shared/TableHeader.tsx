'use client';

import { Box } from '@mui/material';
import { DateTimeItem, Response, calculateSummary, calculateScore } from './types';
import TableHeaderCell from './TableHeaderCell';

interface TableHeaderProps {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  confirmedDateTime: string | null;
  bestKeys?: Set<string>;
  confirmedLabel?: string;
}

export default function TableHeader({
  allDateTimes,
  responses,
  confirmedDateTime,
  bestKeys,
  confirmedLabel = '確定',
}: TableHeaderProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* 左端の固定列（名前用） */}
      <Box
        sx={{
          width: 96,
          flexShrink: 0,
          borderRight: '1px solid #e5e7eb',
          position: 'sticky',
          left: 0,
          zIndex: 2,
          backgroundColor: 'white',
        }}
      />

      {/* 日時列 */}
      {allDateTimes.map(({ date, time, key }) => {
        const summary = calculateSummary(key, responses);
        const score = calculateScore(summary.available, summary.maybe);
        const isConfirmed = confirmedDateTime === key;
        const isBest = bestKeys?.has(key) ?? false;

        return (
          <TableHeaderCell
            key={key}
            date={date}
            time={time}
            score={score}
            total={responses.length}
            isConfirmed={isConfirmed}
            isBest={isBest}
            confirmedLabel={confirmedLabel}
          />
        );
      })}
    </Box>
  );
}

