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
import dayjs from '@/lib/dayjs';
import { type DateTimeItem, type Response, calculateSummary, calculateScore, formatScore } from '../shared/types';
import StatusIcon from '../shared/StatusIcon';

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

      <Dialog
        open={closeDialogOpen}
        onClose={handleCloseCancel}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '500px',
            maxWidth: '800px',
            bgcolor: '#ffffff', // Light mode background
            color: '#0f172a',
          },
        }}
      >
        <DialogContent sx={{ px: 2, pb: 4 }}>
          <RadioGroup
            value={selectedDateTime}
            onChange={(e) => setSelectedDateTime(e.target.value)}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              pt: 1,
            }}
          >
            {allDateTimes.map(({ date, time, key }) => {
              const summary = calculateSummary(key, allResponses);
              const score = calculateScore(summary.available, summary.maybe);
              const isBest = bestKeys.has(key);
              const isSelected = selectedDateTime === key;

              return (
                <Box
                  component="label"
                  key={key}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    p: 2,
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: isSelected
                      ? '#22c55e'
                      : (isBest ? '#bbf7d0' : '#e2e8f0'),
                    bgcolor: isSelected
                      ? '#f0fdf4'
                      : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected
                      ? '0 4px 12px rgba(34, 197, 94, 0.2)'
                      : '0 2px 4px rgba(0,0,0,0.03)',
                    '&:hover': {
                      borderColor: isSelected ? '#22c55e' : '#22c55e',
                      bgcolor: isSelected ? '#f0fdf4' : '#f8fafc',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                    },
                    userSelect: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <Radio value={key} sx={{ display: 'none' }} />

                  {/* Left: Date & Time */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Visual Indicator/Radio Circle */}
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: isSelected ? '#22c55e' : '#cbd5e1',
                        bgcolor: isSelected ? '#22c55e' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isSelected && (
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#fff' }} />
                      )}
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: '#0f172a',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        {date.format('MM/DD (ddd)')}
                        <Typography component="span" sx={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>
                          {time}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Right: Score & Details */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StatusIcon status="available" size={16} />
                          <Typography sx={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{summary.available}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StatusIcon status="maybe" size={16} />
                          <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{summary.maybe}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StatusIcon status="unavailable" size={16} />
                          <Typography sx={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>{summary.unavailable}</Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right', minWidth: 60 }}>
                      <Typography
                        sx={{
                          fontSize: '1.5rem',
                          fontWeight: 800,
                          color: '#0f172a',
                          lineHeight: 1,
                        }}
                      >
                        {formatScore(score)}
                        <Typography component="span" sx={{ fontSize: '0.85rem', color: '#94a3b8', ml: 0.2, fontWeight: 600 }}>
                          /{allResponses.length}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          <Button
            onClick={handleCloseCancel}
            sx={{
              color: '#64748b',
              borderColor: '#cbd5e1',
              '&:hover': { borderColor: '#94a3b8', color: '#475569', bgcolor: '#f1f5f9' }
            }}
            variant="outlined"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleCloseConfirm}
            sx={{
              bgcolor: selectedDateTime ? '#22c55e' : 'transparent',
              color: '#fff',
              boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.4)',
              '&:hover': {
                bgcolor: '#16a34a',
                boxShadow: '0 6px 10px -1px rgba(34, 197, 94, 0.5)',
              },
              '&.Mui-disabled': {
                bgcolor: '#e2e8f0',
                color: '#94a3b8',
                boxShadow: 'none'
              }
            }}
            variant="contained"
            disabled={!selectedDateTime}
          >
            日程を決定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

