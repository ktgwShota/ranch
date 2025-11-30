import { Box, TextField, Typography } from '@mui/material';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { PollFormData } from '@/lib/schemas/poll';

export function VotingDeadline({
  endDate,
  endTime,
  todayDate,
  maxDate,
  currentTimeString,
  onEndDateChange,
  onEndTimeChange,
  register,
  errors,
}: {
  endDate: string | undefined;
  endTime: string | undefined;
  todayDate: string;
  maxDate: string;
  currentTimeString: string;
  onEndDateChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  register: UseFormRegister<PollFormData>;
  errors?: FieldErrors<PollFormData>;
}) {
  return (
    <Box
      sx={{
        mb: 3,
      }}
    >
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
        投票締切日時
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 2, fontSize: '0.875rem' }}
      >
        指定日時に投票結果が自動的に公開されます。設定しない場合は無期限で投票を受け付けます。
      </Typography>      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
          <TextField
            type="date"
            {...register('endDate', {
              onChange: (e) => {
                onEndDateChange(e.target.value);
                if (e.target.value === todayDate && endTime && endTime < currentTimeString) {
                  onEndTimeChange('');
                }
              },
            })}
            error={!!errors?.endDate}
            helperText={errors?.endDate?.message}
            sx={{
              minWidth: 180,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                  borderWidth: 2,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                  borderWidth: 2,
                },
              },
            }}
            inputProps={{ min: todayDate, max: maxDate }}
          />
          <TextField
            type="time"
            {...register('endTime', {
              onChange: (e) => onEndTimeChange(e.target.value),
            })}
            error={!!errors?.endTime}
            helperText={errors?.endTime?.message}
            sx={{
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                  borderWidth: 2,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
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
    </Box>
  );
}
