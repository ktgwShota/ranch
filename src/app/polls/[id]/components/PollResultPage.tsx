import { Box, Button, Card, Paper, Typography, LinearProgress, Avatar, Divider } from '@mui/material';
import { BarChart as BarChartIcon, Share as ShareIcon, EmojiEvents as TrophyIcon, Restaurant as RestaurantIcon } from '@mui/icons-material';
import type { Poll, Option } from '../types';

interface PollResultPageProps {
  poll: Poll;
  totalVotes: number;
  winningOption: Option | null;
}

export function PollResultPage({ poll, totalVotes, winningOption }: PollResultPageProps) {
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
  const allVoters = poll.options.flatMap((option) =>
    option.voters.map((voter) => ({ ...voter, votedFor: option.title || option.url }))
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: poll.title,
        text: `投票結果: ${poll.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('URLをクリップボードにコピーしました');
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', lg: 'row' }, width: '100%', boxSizing: 'border-box' }}>
      {/* 左側: 投票結果 */}
      <Box sx={{ flex: 1, minWidth: 0, boxSizing: 'border-box' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 0.5,
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BarChartIcon sx={{ color: '#3b82f6', fontSize: '1.5rem' }} />
              <Typography variant="h5" fontWeight={700} sx={{ color: '#111827' }}>
                投票結果
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={handleShare}
              sx={{
                backgroundColor: '#3b82f6',
                textTransform: 'none',
                borderRadius: 0.5,
                px: 2,
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
              }}
            >
              結果を共有する
            </Button>
          </Box>

          <Typography variant="h4" fontWeight={700} sx={{ color: '#111827', mb: 1 }}>
            {poll.title}
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280', mb: 4 }}>
            投票は締め切られました。ご参加ありがとうございました!
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {sortedOptions.map((option, index) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              const isWinner = winningOption && option.id === winningOption.id;

              return (
                <Box
                  key={option.id}
                  component="a"
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'block',
                    borderRadius: 0.5,
                    border: '1px solid #e5e7eb',
                    backgroundColor: isWinner ? '#fef3c7' : 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&::before': option.image
                      ? {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundImage: `url(${option.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          opacity: 0.12,
                          zIndex: 0,
                        }
                      : undefined,
                    '&::after': option.image
                      ? {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: isWinner ? 'rgba(254, 243, 199, 0.7)' : 'rgba(255, 255, 255, 0.85)',
                          zIndex: 0,
                        }
                      : undefined,
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '& .option-title': {
                        color: '#1976d2',
                        textDecoration: 'underline',
                      },
                    },
                  }}
                >
                  {isWinner && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        zIndex: 10,
                      }}
                    >
                      <TrophyIcon sx={{ color: '#f59e0b', fontSize: '1.5rem' }} />
                    </Box>
                  )}

                  <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                    <Typography
                      className="option-title"
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        color: '#111827',
                        fontSize: '1.25rem',
                        display: 'block',
                        mb: 2,
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {option.title || option.url}
                    </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        color: '#111827',
                        fontWeight: 700,
                        fontSize: '1.75rem',
                      }}
                    >
                      {option.votes.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      票
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#111827',
                        fontWeight: 600,
                        fontSize: '1.25rem',
                        ml: 'auto',
                      }}
                    >
                      {percentage.toFixed(1)}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 12,
                      borderRadius: 0.5,
                      backgroundColor: '#e5e7eb',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 0.5,
                        background: isWinner
                          ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                      },
                    }}
                  />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>

      {/* 右側: 統計と投票者 */}
      <Box sx={{ width: { xs: '100%', lg: 260 }, flexShrink: 0, boxSizing: 'border-box' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 0.5,
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            mb: 3,
            boxSizing: 'border-box',
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ color: '#111827', mb: 2 }}>
            統計
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            総投票数: <strong>{totalVotes.toLocaleString()}票</strong>
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 0.5,
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            boxSizing: 'border-box',
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ color: '#111827', mb: 2 }}>
            投票者
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {allVoters.slice(0, 10).map((voter, index) => (
              <Box key={`${voter.id}-${index}`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: '#667eea',
                      fontSize: '0.875rem',
                    }}
                  >
                    {(voter.name && voter.name.length > 0 ? voter.name.charAt(0) : '?').toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#111827' }}>
                      {voter.name || '匿名'}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.75rem',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {voter.votedFor}
                    </Typography>
                  </Box>
                </Box>
                {index < Math.min(allVoters.length, 10) - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
            {allVoters.length > 10 && (
              <Button
                variant="text"
                sx={{
                  color: '#3b82f6',
                  textTransform: 'none',
                  mt: 1,
                  '&:hover': {
                    backgroundColor: '#eff6ff',
                  },
                }}
              >
                さらに表示
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

