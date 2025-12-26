'use client';

import ActiveDialogs from './ActiveDialogs';
import { useScheduleData } from '../../hooks/useScheduleData';
import type { ScheduleData } from '../shared/types';

interface ActionsHook {
  deleteDialogOpen: boolean;
  closeDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  setCloseDialogOpen: (open: boolean) => void;
  handleDeleteConfirm: () => void;
  handleCloseConfirm: (confirmedDateTime: string) => void;
}

interface ActivePageDialogsProps {
  scheduleData: ScheduleData;
  actionsHook: ActionsHook;
}

export function ActivePageDialogs({ scheduleData, actionsHook }: ActivePageDialogsProps) {
  const { allDateTimes, bestKeys } = useScheduleData({
    dates: scheduleData.dates,
    responses: scheduleData.responses,
  });

  return (
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
  );
}
