'use client';

import {
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

import { Response } from '../shared/types';
import { useScheduleData } from '../../hooks/useScheduleData';
import { useScheduleActions } from '../../hooks/useScheduleActions';
import ResultHeader from './ResultHeader';
import ResultTableDesktop from './ResultTableDesktop';
import ResultTableMobile from './ResultTableMobile';

interface ScheduleData {
  id: string;
  title: string;
  createdAt: string;
  confirmedDateTime: string | null;
  dates: Array<{ date: string; times: string[] }>;
  responses: Response[];
}

interface ResultPageProps {
  scheduleData: ScheduleData;
}

export default function ResultPage({ scheduleData }: ResultPageProps) {
  const { allDateTimes } = useScheduleData({
    dates: scheduleData.dates,
    responses: scheduleData.responses,
  });

  const actionsHook = useScheduleActions({
    scheduleId: scheduleData.id,
  });

  return (
    <Box>
      <ResultHeader
        title={scheduleData.title}
        confirmedDateTime={scheduleData.confirmedDateTime}
        menuAnchorEl={actionsHook.menuAnchorEl}
        isMenuOpen={actionsHook.isMenuOpen}
        onMenuOpen={actionsHook.handleMenuOpen}
        onMenuClose={actionsHook.handleMenuClose}
        onDeleteClick={actionsHook.handleDeleteClick}
      />

      <Paper elevation={0} sx={{ mb: 2, borderRadius: '2px', border: '1px solid #ddd' }}>
        {/* Desktop */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 'max-content' }}>
              <ResultTableDesktop
                allDateTimes={allDateTimes}
                responses={scheduleData.responses}
                confirmedDateTime={scheduleData.confirmedDateTime}
              />
            </Box>
          </Box>
        </Box>
        {/* Mobile */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <ResultTableMobile
            allDateTimes={allDateTimes}
            responses={scheduleData.responses}
            confirmedDateTime={scheduleData.confirmedDateTime}
          />
        </Box>
      </Paper>

      {/* 削除ダイアログ */}
      <Dialog open={actionsHook.deleteDialogOpen} onClose={() => actionsHook.setDeleteDialogOpen(false)}>
        <DialogTitle>日程調整を削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この日程調整を削除しますか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => actionsHook.setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={actionsHook.handleDeleteConfirm} color="error" variant="contained">
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
