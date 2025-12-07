'use client';

import { Box, Paper } from '@mui/material';
import 'dayjs/locale/ja';

import { Response } from '../shared/types';
import { useScheduleData } from '../../hooks/useScheduleData';
import { useScheduleResponse } from '../../hooks/useScheduleResponse';
import { useScheduleActions } from '../../hooks/useScheduleActions';
import ActiveHeader from './ActiveHeader';
import ActiveDialogs from './ActiveDialogs';
import ActiveTableDesktop from './ActiveTableDesktop';
import ActiveTableMobile from './ActiveTableMobile';

interface ScheduleData {
  id: string;
  title: string;
  createdAt: string;
  isClosed: boolean;
  endDateTime: string | null;
  confirmedDateTime: string | null;
  dates: Array<{ date: string; times: string[] }>;
  responses: Response[];
}

interface ActivePageProps {
  scheduleData: ScheduleData;
}

export default function ActivePage({ scheduleData }: ActivePageProps) {
  const { allDateTimes, bestKeys } = useScheduleData({
    dates: scheduleData.dates,
    responses: scheduleData.responses,
  });

  const responseHook = useScheduleResponse({
    scheduleId: scheduleData.id,
    responses: scheduleData.responses,
    allDateTimes,
  });

  const actionsHook = useScheduleActions({
    scheduleId: scheduleData.id,
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
    <Box>
      <ActiveHeader
        title={scheduleData.title}
        endDateTime={scheduleData.endDateTime}
        menuAnchorEl={actionsHook.menuAnchorEl}
        isMenuOpen={actionsHook.isMenuOpen}
        onMenuOpen={actionsHook.handleMenuOpen}
        onMenuClose={actionsHook.handleMenuClose}
        onCloseClick={actionsHook.handleCloseClick}
        onDeleteClick={actionsHook.handleDeleteClick}
      />

      <Paper elevation={0} sx={{ mb: 2, borderRadius: '2px', border: '1px solid #ddd' }}>
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <ActiveTableMobile {...scheduleTableProps} />
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <ActiveTableDesktop {...scheduleTableProps} />
        </Box>
      </Paper>

      <ActiveDialogs
        deleteDialogOpen={actionsHook.deleteDialogOpen}
        closeDialogOpen={actionsHook.closeDialogOpen}
        onDeleteClose={() => actionsHook.setDeleteDialogOpen(false)}
        onCloseClose={() => actionsHook.setCloseDialogOpen(false)}
        onDeleteConfirm={actionsHook.handleDeleteConfirm}
        onCloseConfirm={actionsHook.handleCloseConfirm}
        allDateTimes={allDateTimes}
        allResponses={scheduleData.responses}
        bestKeys={bestKeys}
      />
    </Box>
  );
}

