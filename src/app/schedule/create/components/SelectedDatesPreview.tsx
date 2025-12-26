'use client';

import dayjs, { type Dayjs } from '@/lib/dayjs';
import { Box, Typography, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import { FormattedDate } from '@/components/ui/FormattedDate';
import type { SelectedDate } from '../types';

interface SelectedDatesPreviewProps {
  selectedDates: SelectedDate[];
  lastSelectedDates?: Dayjs[];
  onRemoveDate: (date: string) => void;
  onRemoveTime?: (date: string, time: string) => void;
}

export default function SelectedDatesPreview({
  selectedDates,
  lastSelectedDates,
  onRemoveDate,
  onRemoveTime,
}: SelectedDatesPreviewProps) {
  if (selectedDates.length === 0) return null;

  const sortedDates = [...selectedDates].sort((a, b) => a.date.unix() - b.date.unix());

  return (
    <Box
      sx={{
        mt: 3,
        p: { xs: 2.5, md: 3 },
        border: '1px solid #e0e0e0',
        borderRadius: '2px',
        backgroundColor: '#fafafa',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
        出欠表
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 1.5
      }}>
        {sortedDates.map((dateInfo) => {
          const hasTimes = dateInfo.times.length > 0;
          const dateKey = dateInfo.date.format('YYYY-MM-DD');

          const isSelected = lastSelectedDates?.some(d => d.isSame(dateInfo.date, 'day'));

          return (
            <Box
              key={dateKey}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '2px',
                overflow: 'hidden',
                backgroundColor: 'white',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              <Box sx={{
                pl: '10px',
                pr: 0.5,
                py: '6px',
                backgroundColor: isSelected ? '#f57c00' : 'primary.main',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Typography sx={{
                  fontWeight: 600,
                  fontSize: '13px',
                  color: 'primary.contrastText'
                }}>
                  <FormattedDate date={dateInfo.date} />
                </Typography>

                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveDate(dateKey);
                  }}
                  sx={{
                    color: 'primary.contrastText',
                    p: 0.5,
                    opacity: 0.8,
                    '&:hover': {
                      opacity: 1,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  <CloseIcon fontSize="small" sx={{ fontSize: '16px' }} />
                </IconButton>
              </Box>

              {/* Card Body */}
              <Box sx={{ p: 1, flexGrow: 1 }}>
                {hasTimes ? (
                  <Box sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: 1,
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' }
                  }}>
                    {dateInfo.times.map((time, timeIndex) => (
                      <Box
                        key={timeIndex}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          color: 'primary.main',
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          pr: 0.75,
                          pl: 1.25,
                          py: 0.5,
                          borderRadius: 4,
                          border: '1px solid rgba(25, 118, 210, 0.2)',
                          flexShrink: 0,
                        }}
                      >
                        {time} ~
                        {onRemoveTime && (
                          <Box
                            component="span"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveTime(dateKey, time);
                            }}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              ml: 0.5,
                              color: 'primary.main',
                              opacity: 0.6,
                              '&:hover': { opacity: 1, color: 'error.main' }
                            }}
                          >
                            <CancelIcon sx={{ fontSize: 16 }} />
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '30px' }}>
                    <Typography variant="caption" color="text.secondary">
                      -
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

