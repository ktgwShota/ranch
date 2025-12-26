'use client';

import { Box, Paper } from '@mui/material';
import ActiveTableDesktop from './ActiveTableDesktop';
import ActiveTableMobile from './ActiveTableMobile';
import { useScheduleData } from '../../hooks/useScheduleData';
import { useScheduleResponse } from '../../hooks/useScheduleResponse';
import type { ScheduleData } from '../shared/types';

interface ActivePageContentsProps {
  scheduleData: ScheduleData;
}

export function ActivePageContents({ scheduleData }: ActivePageContentsProps) {
  const { allDateTimes, bestKeys } = useScheduleData({
    dates: scheduleData.dates,
    responses: scheduleData.responses,
  });

  const responseHook = useScheduleResponse({
    scheduleId: scheduleData.id,
    responses: scheduleData.responses,
    allDateTimes,
  });

  const scheduleTableProps = {
    allDateTimes,
    allResponses: scheduleData.responses,
    bestKeys,
    isClosed: scheduleData.isClosed,
    confirmedDateTime: scheduleData.confirmedDateTime,
    ...responseHook,
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        backgroundColor: 'white',
      }}
    >
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <ActiveTableMobile {...scheduleTableProps} />
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <ActiveTableDesktop {...scheduleTableProps} />
      </Box>
    </Paper>
  );
}
