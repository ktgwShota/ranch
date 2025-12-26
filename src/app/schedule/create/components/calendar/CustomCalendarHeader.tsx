'use client';

import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import type { Dayjs } from '@/lib/dayjs';

interface CustomCalendarHeaderProps {
  currentMonth: Dayjs;
  onMonthChange: (date: Dayjs, slideDirection: 'left' | 'right') => void;
  rightNode?: React.ReactNode;
}

export function CustomCalendarHeader(props: CustomCalendarHeaderProps) {
  const {
    currentMonth,
    onMonthChange,
    rightNode
  } = props;

  const selectNextMonth = () => onMonthChange(currentMonth.add(1, 'month'), 'right');
  const selectPreviousMonth = () => onMonthChange(currentMonth.subtract(1, 'month'), 'left');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1, py: 1, minHeight: 40 }}>
      {/* Month Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', mr: 1, ml: 1 }}>
          {currentMonth.format('YYYY年 M月')}
        </Typography>
        <IconButton onClick={selectPreviousMonth} size="small" sx={{ p: 0.5 }}>
          <ChevronLeft fontSize="small" />
        </IconButton>
        <IconButton onClick={selectNextMonth} size="small" sx={{ p: 0.5 }}>
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
      {rightNode}
    </Box>
  );
}
