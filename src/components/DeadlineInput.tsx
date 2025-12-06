'use client';

import { Box, TextField, Typography } from '@mui/material';

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
  description = '指定日時に受付を締め切ります。設定しない場合は無期限で受付を受け付けます。',
  dateError,
  timeError,
}: DeadlineInputProps) {
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

      <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
        <TextField
          type="date"
          value={endDate || ''}
          onChange={(e) => {
            onEndDateChange(e.target.value);
            if (e.target.value === todayDate && endTime && endTime < currentTimeString) {
              onEndTimeChange('');
            }
          }}
          error={!!dateError}
          helperText={dateError}
          sx={{
            minWidth: 180,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0.5,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1rem',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
                borderWidth: 2,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
                borderWidth: 2,
              },
            },
          }}
          inputProps={{ min: todayDate, max: maxEndDate }}
        />
        <TextField
          type="time"
          value={endTime || ''}
          onChange={(e) => onEndTimeChange(e.target.value)}
          error={!!timeError}
          helperText={timeError}
          sx={{
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0.5,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1rem',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
                borderWidth: 2,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
                borderWidth: 2,
              },
            },
          }}
          inputProps={{
            min: endDate && endDate === todayDate ? currentTimeString : '00:00',
          }}
        />
      </Box>
    </Box>
  );
}

