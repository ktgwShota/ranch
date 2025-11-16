import { Box, Button, Typography, Skeleton } from '@mui/material';
import { Stop as StopIcon } from '@mui/icons-material';
import type { Poll } from '../types';

interface PollHeaderProps {
  poll: Poll | null;
  loading: boolean;
  isPollClosed: boolean;
  timeRemaining: number | null;
  formatTime: (seconds: number) => string;
  isEndingPoll: boolean;
  onEndPoll: () => void;
}

export function PollHeader({
  poll,
  loading,
  isPollClosed,
  timeRemaining,
  formatTime,
  isEndingPoll,
  onEndPoll,
}: PollHeaderProps) {
  return (
    <Box
      sx={{
        background: '#f8f9fa',
        borderRadius: 1,
        p: 4,
        textAlign: 'center',
        border: '1px solid #ddd',
      }}
    >
      {loading ? (
        <Skeleton variant="text" width="50%" height={33.27} sx={{ mx: 'auto' }} />
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h1"
            fontWeight="600"
            sx={{
              color: '#495057',
              fontSize: '1.3rem',
              flex: 1,
              minWidth: 0,
            }}
          >
            {poll?.title}
          </Typography>

          {poll && !isPollClosed && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<StopIcon />}
              onClick={onEndPoll}
              disabled={isEndingPoll}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 1,
                borderColor: '#f44336',
                color: '#f44336',
                '&:hover': {
                  borderColor: '#d32f2f',
                  backgroundColor: '#ffebee',
                },
              }}
            >
              {isEndingPoll ? '終了中...' : '投票を終了'}
            </Button>
          )}

          {poll && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2.5,
                py: 1.5,
                backgroundColor:
                  isPollClosed || poll?.isClosed
                    ? '#ffebee'
                    : poll?.endDateTime
                      ? '#e3f2fd'
                      : '#e8f5e8',
                borderRadius: 3,
                border: `1px solid ${isPollClosed || poll?.isClosed ? '#f44336' : poll?.endDateTime ? '#2196f3' : '#4caf50'}`,
                minWidth: 'fit-content',
                boxShadow:
                  isPollClosed || poll?.isClosed
                    ? '0 2px 8px rgba(244, 67, 54, 0.2)'
                    : poll?.endDateTime
                      ? '0 2px 8px rgba(33, 150, 243, 0.2)'
                      : '0 2px 8px rgba(76, 175, 80, 0.2)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color:
                    isPollClosed || poll?.isClosed
                      ? '#d32f2f'
                      : poll?.endDateTime
                        ? '#1976d2'
                        : '#4caf50',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                }}
              >
                投票受付:
              </Typography>
              {isPollClosed || poll?.isClosed ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#d32f2f',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  終了
                </Typography>
              ) : poll?.endDateTime ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1976d2',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatTime(timeRemaining || 0)}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#4caf50',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  無期限
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

