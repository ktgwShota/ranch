import { Box, Typography, LinearProgress } from '@mui/material';

interface ResultDisplayProps {
  votes: number;
  percentage: number;
}

export function ResultDisplay({ votes, percentage }: ResultDisplayProps) {
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={1.5}>
        <Box display="flex" alignItems="baseline" gap={0.5}>
          <Typography
            variant="h6"
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: 1.2,
            }}
          >
            {votes}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            票
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            fontSize: '18px',
          }}
        >
          {percentage.toFixed(1)}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e5e7eb',
          mb: 3,
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            background: '#3b82f6',
          },
        }}
      />
    </>
  );
}

