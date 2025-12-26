'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import type { Dayjs } from '@/lib/dayjs';

interface AutoTimeSelectorProps {
  isAutoTimeEnabled: boolean;
  setIsAutoTimeEnabled: (val: boolean) => void;
  autoTimeValue: Dayjs | null;
  setAutoTimeValue: (val: Dayjs | null) => void;
  revision: number;
  setRevision: (fn: (prev: number) => number) => void;
}

export const AutoTimeSelector = ({
  isAutoTimeEnabled,
  setIsAutoTimeEnabled,
  autoTimeValue,
  setAutoTimeValue,
  revision,
  setRevision
}: AutoTimeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);

    // ピッカーが閉じられた = OKボタンが押された
    // 現在の値で有効化
    if (autoTimeValue) {
      setIsAutoTimeEnabled(true);
      setRevision(prev => prev + 1);
    }
  };

  const handleClick = () => {
    if (isAutoTimeEnabled) {
      setIsAutoTimeEnabled(false);
      setAutoTimeValue(null);
    } else {
      setIsOpen(true);
    }
  };

  const handleAccept = (newValue: Dayjs | null) => {
    // 値が変更された場合のみ呼ばれる
    if (newValue) {
      setAutoTimeValue(newValue);
    }
  };

  return (
    <>
      <Button
        variant={isAutoTimeEnabled ? "contained" : "outlined"}
        size="small"
        onClick={handleClick}
        startIcon={isAutoTimeEnabled ? <AccessTime sx={{ width: 16, height: 16 }} /> : null}
        sx={{
          borderRadius: '2px',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'none',
          borderColor: isAutoTimeEnabled ? 'primary.main' : 'divider',
          color: isAutoTimeEnabled ? '#fff' : 'text.secondary',
          bgcolor: isAutoTimeEnabled ? 'primary.main' : 'transparent',
          minWidth: 'auto',
          px: 1.75,
          py: 1,
          whiteSpace: 'nowrap',
          boxShadow: 'none',
          '&:hover': {
            borderColor: isAutoTimeEnabled ? 'primary.dark' : 'text.primary',
            bgcolor: isAutoTimeEnabled ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)',
            boxShadow: 'none',
          }
        }}
      >
        {isAutoTimeEnabled && autoTimeValue
          ? autoTimeValue.format('HH:mm')
          : "時刻自動追加"
        }
      </Button>

      <MobileTimePicker
        value={autoTimeValue}
        onChange={(newValue) => setAutoTimeValue(newValue)}
        open={isOpen}
        onClose={handleClose}
        onAccept={handleAccept}
        ampm={false}
        minutesStep={5}
        slotProps={{
          textField: { sx: { display: 'none' } },
          actionBar: { actions: ['accept'] }
        }}
      />
    </>
  );
};
