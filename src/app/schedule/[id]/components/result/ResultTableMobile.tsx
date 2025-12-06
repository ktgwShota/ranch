'use client';

import { Box, Typography, LinearProgress } from '@mui/material';
import { DateTimeItem, Response, calculateSummary, calculateScore, formatScore } from '../shared/types';
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
    <Box>
      {allDateTimes.map(({ date, time, key }) => {
        const summary = calculateSummary(key, responses);
        const score = calculateScore(summary.available, summary.maybe);
        const ratio = responses.length > 0 ? score / responses.length : 0;
        const isConfirmed = confirmedDateTime === key;

        return (
          <Box key={key} sx={{ borderBottom: '1px solid #e5e7eb', '&:last-child': { borderBottom: 'none' } }}>
            {/* 日程ヘッダー */}
            <Box sx={{ p: 2, backgroundColor: isConfirmed ? 'rgba(76, 175, 80, 0.15)' : '#fafafa' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isConfirmed && (
                    <Typography
                      sx={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'white',
                        backgroundColor: '#4caf50',
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 0.5,
                      }}
                    >
                      決定
                    </Typography>
                  )}
                  <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                    {date.format('M月D日')} ({date.format('ddd')})
                    {time && <span style={{ fontWeight: 400 }}> {time}〜</span>}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: ratio >= 0.8 ? '#4caf50' : ratio >= 0.5 ? '#ff9800' : '#f44336',
                  }}
                >
                  {formatScore(score)}/{responses.length}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={ratio * 100}
                sx={{
                  mt: 1,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: ratio >= 0.8 ? '#4caf50' : ratio >= 0.5 ? '#ff9800' : '#f44336',
                  },
                }}
              />
            </Box>

            {/* 回答者リスト */}
            <Box sx={{ px: 2, py: 1 }}>
              {responses.length === 0 ? (
                <Typography color="text.secondary" sx={{ fontSize: '13px', py: 1 }}>
                  データが存在しません
                </Typography>
              ) : (
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
                    <Typography sx={{ fontSize: '13px' }}>{response.name}</Typography>
                    <StatusIcon status={response.availability[key]} size={20} />
                  </Box>
                ))
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

