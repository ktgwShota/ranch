import { Box, TextField, Typography } from '@mui/material';

export function VotingDeadline({
  endDate,
  endTime,
  todayDate,
  maxDate,
  currentTimeString,
  onEndDateChange,
  onEndTimeChange,
}: {
  endDate: string;
  endTime: string;
  todayDate: string;
  maxDate: string;
  currentTimeString: string;
  onEndDateChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
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
          mb: 1.5,
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        投票締切日時 <span style={{ color: '#f44336' }}>*</span>
      </Typography>
      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
          <TextField
            type="date"
            value={endDate}
            onChange={(e) => {
              onEndDateChange(e.target.value);
              if (e.target.value === todayDate && endTime && endTime < currentTimeString) {
                onEndTimeChange('');
              }
            }}
            sx={{
              minWidth: 180,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            sx={{
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
        <Typography
          variant="body1"
          color="text.secondary"
        >
          指定日時に投票結果が自動的に公開されます。
        </Typography>
      </Box>
    </Box>
  );
}
