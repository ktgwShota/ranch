import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Check as CheckIcon, ThumbUp as ThumbUpIcon } from '@mui/icons-material';

interface VoteButtonProps {
  isVoted: boolean;
  isVoting: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export function VoteButton({ isVoted, isVoting, isDisabled, onClick }: VoteButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isVoting || isDisabled}
      variant={isVoted ? 'outlined' : 'contained'}
      startIcon={isVoted ? <CheckIcon sx={{ fontSize: '1.2rem' }} /> : <ThumbUpIcon sx={{ fontSize: '1.2rem' }} />}
      fullWidth
      size="large"
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
        py: 1.5,
        ...(isVoted && {
          color: '#0369a1',
          borderColor: '#bfdbfe',
          borderWidth: 2,
          background: '#f8fafc',
          '&:hover': {
            background: '#e0e7ff',
            borderColor: '#60a5fa',
          },
        }),
        ...(!isVoted && {
          background: '#f3f4f6',
          color: '#374151',
          border: '1px solid #d1d5db',
          '&:hover': {
            background: '#e5e7eb',
          },
        }),
      }}
    >
      {isVoting ? (
        <Box display="flex" alignItems="center" gap={1.5}>
          <CircularProgress size={16} sx={{ color: '#6b7280' }} />
          <Typography sx={{ fontWeight: 600 }}>投票中...</Typography>
        </Box>
      ) : isVoted ? (
        '投票済み'
      ) : (
        '投票する'
      )}
    </Button>
  );
}

