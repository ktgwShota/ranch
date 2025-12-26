'use client';

import { Box, Paper } from '@mui/material';
import ResultTableDesktop from './ResultTableDesktop';
import ResultTableMobile from './ResultTableMobile';
import { useScheduleData } from '../../hooks/useScheduleData';
import type { ScheduleData } from '../shared/types';

interface ResultPageContentsProps {
  scheduleData: ScheduleData;
}

export function ResultPageContents({ scheduleData }: ResultPageContentsProps) {
  const { allDateTimes } = useScheduleData({
    dates: scheduleData.dates,
    responses: scheduleData.responses,
  });

  const sortedDateTimes = [...allDateTimes].sort((a, b) => {
    if (a.key === scheduleData.confirmedDateTime) return -1;
    if (b.key === scheduleData.confirmedDateTime) return 1;
    return 0;
  });

  return (
    <Paper elevation={0} sx={{ borderRadius: '2px' }}>
      {/* Desktop */}
      <Box sx={{ display: { xs: 'none', sm: 'block' }, border: '1px solid #ddd', borderRadius: '2px' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 'max-content' }}>
            <ResultTableDesktop
              allDateTimes={sortedDateTimes}
              responses={scheduleData.responses}
              confirmedDateTime={scheduleData.confirmedDateTime}
            />
          </Box>
        </Box>
      </Box>
      {/* Mobile */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 2.5 }}>
        <ResultTableMobile
          allDateTimes={sortedDateTimes}
          responses={scheduleData.responses}
          confirmedDateTime={scheduleData.confirmedDateTime}
        />
      </Box>
    </Paper>
  );
}
