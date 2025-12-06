'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { DateTimeItem, Response, calculateSummary, calculateScore, formatScore } from '../shared/types';
import StatusIcon from '../shared/StatusIcon';

dayjs.locale('ja');

interface ActiveDialogsProps {
  deleteDialogOpen: boolean;
  closeDialogOpen: boolean;
  onDeleteClose: () => void;
  onCloseClose: () => void;
  onDeleteConfirm: () => void;
  onCloseConfirm: (confirmedDateTime: string) => void;
  allDateTimes: DateTimeItem[];
  allResponses: Response[];
  bestKeys: Set<string>;
}

export default function ActiveDialogs({
  deleteDialogOpen,
  closeDialogOpen,
  onDeleteClose,
  onCloseClose,
  onDeleteConfirm,
  onCloseConfirm,
  allDateTimes,
  allResponses,
  bestKeys,
}: ActiveDialogsProps) {
  const [selectedDateTime, setSelectedDateTime] = useState<string>('');

  const handleCloseConfirm = () => {
    if (selectedDateTime) {
      onCloseConfirm(selectedDateTime);
      setSelectedDateTime('');
    }
  };

  const handleCloseCancel = () => {
    setSelectedDateTime('');
    onCloseClose();
  };

  return (
    <>
      <Dialog open={deleteDialogOpen} onClose={onDeleteClose}>
        <DialogTitle>日程調整を削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この日程調整を削除しますか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteClose}>キャンセル</Button>
          <Button onClick={onDeleteConfirm} color="error" variant="contained">
            削除する
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={closeDialogOpen} onClose={handleCloseCancel} maxWidth="sm" fullWidth>
        <DialogTitle>スケジュールを確定</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            確定する日程を選択してください。
          </DialogContentText>
          <RadioGroup
            value={selectedDateTime}
            onChange={(e) => setSelectedDateTime(e.target.value)}
          >
            {allDateTimes.map(({ date, time, key }) => {
              const summary = calculateSummary(key, allResponses);
              const score = calculateScore(summary.available, summary.maybe);
              const isBest = bestKeys.has(key);

              return (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio />}
                  sx={{
                    mx: 0,
                    mb: 1,
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: selectedDateTime === key ? 'primary.main' : '#e5e7eb',
                    backgroundColor: isBest ? 'rgba(76, 175, 80, 0.08)' : 'transparent',
                    '&:hover': { backgroundColor: 'action.hover' },
                    width: '100%',
                  }}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', ml: 1 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                          {date.format('M月D日')} ({date.format('ddd')})
                          {time && <span style={{ fontWeight: 400 }}> {time}〜</span>}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StatusIcon status="available" size={16} />
                            <Typography variant="caption" color="text.secondary">{summary.available}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StatusIcon status="maybe" size={16} />
                            <Typography variant="caption" color="text.secondary">{summary.maybe}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StatusIcon status="unavailable" size={16} />
                            <Typography variant="caption" color="text.secondary">{summary.unavailable}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            color: isBest ? '#4caf50' : 'text.primary',
                          }}
                        >
                          {formatScore(score)}/{allResponses.length}
                        </Typography>
                        {isBest && (
                          <Typography sx={{ fontSize: '0.7rem', color: '#4caf50', fontWeight: 600 }}>
                            BEST
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                />
              );
            })}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel}>キャンセル</Button>
          <Button
            onClick={handleCloseConfirm}
            color="primary"
            variant="contained"
            disabled={!selectedDateTime}
          >
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

