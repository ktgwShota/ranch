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
            variant="h4"
            sx={{
              color: '#111827',
              fontWeight: 700,
              fontSize: '1.75rem',
              lineHeight: 1.2,
            }}
          >
            {votes}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#6b7280',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            票
          </Typography>
        </Box>
        <Typography
          variant="h5"
          sx={{
            color: '#111827',
            fontWeight: 600,
            fontSize: '1.5rem',
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
          mb: 2.5,
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            background: '#3b82f6',
          },
        }}
      />
    </>
  );
}

