'use client';

import { Box, Typography } from '@mui/material';
import { DateTimeItem, Response } from '../shared/types';
import TableHeader from '../shared/TableHeader';
import TableRow from '../shared/TableRow';

interface ResultTableDesktopProps {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  confirmedDateTime: string | null;
}

export default function ResultTableDesktop({
  allDateTimes,
  responses,
  confirmedDateTime,
}: ResultTableDesktopProps) {
  return (
    <Box>
      {/* ヘッダー行 */}
      <TableHeader
        allDateTimes={allDateTimes}
        responses={responses}
        confirmedDateTime={confirmedDateTime}
      />

      {/* 回答者行 */}
      {responses.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2.5 }}>
          データが存在しません
        </Typography>
      ) : (
        responses.map((response) => (
          <TableRow
            key={response.respondentId}
            response={response}
            allDateTimes={allDateTimes}
            confirmedDateTime={confirmedDateTime}
          />
        ))
      )}
    </Box>
  );
}

