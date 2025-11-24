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
  endDate: string;
  endTime: string;
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
        p: 3,
        background:
          'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        borderRadius: 0.5,
        border: '1px solid rgba(102, 126, 234, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 1,
          color: 'text.primary',
          fontWeight: 600,
          fontSize: '1rem',
        }}
      >
        投票締切日時 <span style={{ color: '#f44336' }}>*</span>
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 2, fontSize: '0.875rem' }}
      >
        指定日時に投票結果が自動的に公開されます。
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
              min: endDate === todayDate ? currentTimeString : '00:00',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
