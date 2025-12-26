'use client';

import { Box, Typography, LinearProgress } from '@mui/material';
import { FormattedDate } from '@/components/ui/FormattedDate';
import { type DateTimeItem, type Response, calculateSummary, calculateScore, formatScore } from '../shared/types';
import StatusIcon from '../shared/StatusIcon';

interface ResultTableMobileProps {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  confirmedDateTime: string | null;
}

export default function ResultTableMobile({
  allDateTimes,
  responses,
  confirmedDateTime,
}: ResultTableMobileProps) {
  return (
    <>
      {allDateTimes.map(({ date, time, key }) => {
        const summary = calculateSummary(key, responses);
        const score = calculateScore(summary.available, summary.maybe);
        const ratio = responses.length > 0 ? score / responses.length : 0;
        const isConfirmed = confirmedDateTime === key;
        const isDismissed = !!confirmedDateTime && !isConfirmed;

        return (
          <Box key={key} sx={{ border: '1px solid #e5e7eb', borderRadius: '2px' }}>
            {/* 日程ヘッダー */}
            <Box sx={{ p: 2, backgroundColor: isConfirmed ? 'rgba(33, 150, 243, 0.12)' : (isDismissed ? 'rgba(0, 0, 0, 0.04)' : '#fafafa') }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isConfirmed && (
                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'white',
                        backgroundColor: '#2196f3',
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 0.5,
                      }}
                    >
                      決定
                    </Typography>
                  )}

                  <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                    <FormattedDate date={date} />
                    {time && <span style={{ fontWeight: 400 }}> {time} ~</span>}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: ratio >= 0.8 ? '#4caf50' : ratio >= 0.5 ? '#ff9800' : '#f44336',
                  }}
                >
                  {formatScore(score)}<span style={{ marginLeft: '1px', marginRight: '1px' }}>/</span>{responses.length}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={ratio * 100}
                sx={{
                  mt: '14px',
                  height: 6,
                  borderRadius: 1,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: ratio >= 0.8 ? '#4caf50' : ratio >= 0.5 ? '#ff9800' : '#f44336',
                  },
                }}
              />
            </Box>

            {/* 回答者リスト */}
            <Box sx={{ px: 2, py: 1, backgroundColor: isConfirmed ? 'rgba(33, 150, 243, 0.12)' : (isDismissed ? 'rgba(0, 0, 0, 0.04)' : '#fafafa'), borderTop: '1px solid #e5e7eb' }}>
              {responses.length > 0 && (
                responses.map((response) => (
                  <Box
                    key={response.respondentId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 0.75,
                    }}
                  >
                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>{response.name}</Typography>
                    <StatusIcon status={response.availability[key]} size={20} />
                  </Box>
                ))
              )}
            </Box>
          </Box>
        );
      })}
    </>
  );
}

