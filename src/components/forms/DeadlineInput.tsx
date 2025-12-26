'use client';

import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

dayjs.locale('ja');

interface DeadlineInputProps {
  endDate: string;
  endTime: string;
  todayDate: string;
  maxEndDate: string;
  currentTimeString: string;
  onEndDateChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  title?: string;
  description?: string;
  dateError?: string;
  timeError?: string;
}

export default function DeadlineInput({
  endDate,
  endTime,
  todayDate,
  maxEndDate,
  currentTimeString,
  onEndDateChange,
  onEndTimeChange,
  title = '受付制限',
  description = '指定日時以降の入力を制限します。未設定の場合は無期限で入力を受け付けます。',
  dateError,
  timeError,
}: DeadlineInputProps) {
  const theme = useTheme();
  // sm (600px) 以下をモバイルとみなす
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // スタイリング共通定義
  const pickerSx = {
    minWidth: 280,
    width: '100%',
    maxWidth: 320,
    // For MUI X Date Pickers specifically
    '& .MuiPickersOutlinedInput-root': {
      borderRadius: '2px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  };

  // PropsのendDateとendTimeを結合してdayjsオブジェクトを作成
  const currentDateTime = endDate && endTime ? dayjs(`${endDate}T${endTime}`) : null;

  const handleDateChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      onEndDateChange(newValue.format('YYYY-MM-DD'));
      onEndTimeChange(newValue.format('HH:mm'));
    } else {
      onEndDateChange('');
      onEndTimeChange('');
    }
  };

  const commonProps = {
    label: "日時を選択",
    value: currentDateTime,
    onChange: handleDateChange,
    minDateTime: dayjs(`${todayDate}T${currentTimeString}`),
    maxDate: dayjs(maxEndDate),
    ampm: false,
    sx: pickerSx,
    slotProps: {
      textField: {
        error: !!dateError || !!timeError,
        helperText: dateError || timeError, // エラーメッセージがあれば表示
        inputProps: { readOnly: true }, // 直接入力を禁止
      },
      desktopPaper: {
        sx: {
          borderRadius: '2px',
        }
      },
      mobilePaper: {
        sx: {
          borderRadius: '2px',
        }
      }
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          mb: 1,
          color: 'text.primary',
          fontWeight: 600,
          fontSize: '15px',
        }}
      >
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
        {description}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
        <Box display="flex" alignItems="center">
          {isMobile ? (
            <MobileDateTimePicker {...commonProps} />
          ) : (
            <DesktopDateTimePicker {...commonProps} />
          )}
        </Box>
      </LocalizationProvider>
    </Box>
  );
}
