'use client';

import { Box, Typography } from '@mui/material';
import { SelectedDate } from '../types';

interface SelectedDatesPreviewProps {
  selectedDates: SelectedDate[];
  onRemoveDate: (date: string) => void;
  onSelectDate: (date: string) => void;
}

export default function SelectedDatesPreview({
  selectedDates,
  onRemoveDate,
  onSelectDate,
}: SelectedDatesPreviewProps) {
  if (selectedDates.length === 0) return null;

  const sortedDates = [...selectedDates].sort((a, b) => a.date.unix() - b.date.unix());

  return (
    <Box
      sx={{
        p: 2,
        mb: 3,
        border: '1px solid #e0e0e0',
        borderRadius: 0.5,
        backgroundColor: '#fafafa',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
        日程候補
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {sortedDates.map((dateInfo) => {
          const hasTimes = dateInfo.times.length > 0;
          const dateKey = dateInfo.date.format('YYYY-MM-DD');

          return (
            <Box
              key={dateKey}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                py: 0.75,
                px: 1.5,
                backgroundColor: 'white',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(25, 118, 210, 0.04)' },
              }}
              onClick={() => onSelectDate(dateKey)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'text.primary' }}>
                  {dateInfo.date.format('M/D(ddd)')}
                </Typography>
                {hasTimes && (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {dateInfo.times.map((time, timeIndex) => (
                      <Typography
                        key={timeIndex}
                        sx={{
                          fontSize: '0.75rem',
                          color: 'primary.main',
                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 1,
                          fontWeight: 500,
                        }}
                      >
                        {time}〜
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
              <Box
                component="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveDate(dateKey);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  height: 18,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'text.disabled',
                  fontSize: '0.875rem',
                  borderRadius: '50%',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  },
                }}
              >
                ×
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

