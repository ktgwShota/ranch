'use client';

import { useMemo, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { FormattedDate } from '@/components/ui/FormattedDate';
import type { Dayjs } from '@/lib/dayjs';
import type { SelectedDate } from '../../types';
import { TimeColumn } from './TimeColumn';

interface TimePanelProps {
  lastSelectedDates: Dayjs[];
  addedTimes: Set<string>;
  handleTimeClick: (time: string) => void;
  selectedDates: SelectedDate[];
  onDateChange: (date: Dayjs) => void;
}

export const DesktopTimePanel = ({ lastSelectedDates, addedTimes, handleTimeClick, selectedDates, onDateChange }: TimePanelProps) => {
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');

  // Generate 24h hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  // Generate minutes (00, 05, ..., 55)
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const get24HourTime = () => `${selectedHour}:${selectedMinute}`;

  const targetTime = get24HourTime();
  const isTargetAdded = addedTimes.has(targetTime);

  // Navigation logic
  const sortedSelectedDates = useMemo(() => {
    return [...selectedDates].sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }, [selectedDates]);

  const currentIndex = useMemo(() => {
    if (lastSelectedDates.length === 0) return -1;
    // Use the first date of the selection as the anchor
    const anchorDate = lastSelectedDates[0];
    return sortedSelectedDates.findIndex(
      (d) => d.date.format('YYYY-MM-DD') === anchorDate.format('YYYY-MM-DD')
    );
  }, [lastSelectedDates, sortedSelectedDates]);

  const handlePrevDate = () => {
    if (currentIndex > 0) {
      onDateChange(sortedSelectedDates[currentIndex - 1].date);
    }
  };

  const handleNextDate = () => {
    if (currentIndex !== -1 && currentIndex < sortedSelectedDates.length - 1) {
      onDateChange(sortedSelectedDates[currentIndex + 1].date);
    }
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex !== -1 && currentIndex < sortedSelectedDates.length - 1;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pt: '17px', px: 0.5, pb: 2, borderBottom: '1px solid #e0e0e0', fontSize: '13px', fontWeight: 600, position: 'relative' }}>
        {lastSelectedDates.length > 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <IconButton
              size="small"
              onClick={handlePrevDate}
              disabled={!canGoPrev}
            >
              <ChevronLeft fontSize="small" />
            </IconButton>

            <Typography
              variant="body2"
              sx={{
                flex: 1,
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                px: 0.5
              }}
            >
              {lastSelectedDates.length > 1 ? (
                <>
                  <FormattedDate date={lastSelectedDates[0]} />
                  {' ~ '}
                  <FormattedDate date={lastSelectedDates[lastSelectedDates.length - 1]} />
                </>
              ) : (
                <>
                  <FormattedDate date={lastSelectedDates[0]} />
                </>
              )}
            </Typography>

            <IconButton
              size="small"
              onClick={handleNextDate}
              disabled={!canGoNext}
            >
              <ChevronRight fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{
              height: '30px',
              lineHeight: '30px',
              textAlign: 'center',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              display: 'block',
            }}
          >
            日付を選択してください
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{
          display: 'flex',
          width: '100%',
          py: 1,
          px: 0.5,
          fontSize: '14px',
          pointerEvents: lastSelectedDates.length === 0 ? 'none' : 'auto',
          touchAction: lastSelectedDates.length === 0 ? 'none' : 'auto',
        }}>
          <TimeColumn items={hours} selectedValue={selectedHour} onSelect={setSelectedHour} />
          <TimeColumn items={minutes} selectedValue={selectedMinute} onSelect={setSelectedMinute} />
        </Box>
      </Box>

      <Box sx={{ borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="text"
          color={isTargetAdded ? "error" : "primary"}
          disabled={lastSelectedDates.length === 0}
          onClick={() => {
            handleTimeClick(targetTime);
          }}
          sx={{ fontSize: '13px', whiteSpace: 'nowrap', py: 2.5, px: 2, width: '100%', borderRadius: 0 }}
        >
          {isTargetAdded ? '時刻を削除' : '時刻を追加'}
        </Button>
      </Box>
    </Box>
  );
};
