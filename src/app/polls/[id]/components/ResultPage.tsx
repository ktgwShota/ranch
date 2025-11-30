import { Box, Paper, Typography, LinearProgress, Avatar, Divider } from '@mui/material';
import { BarChart as BarChartIcon, HowToVote as HowToVoteIcon, People as PeopleIcon } from '@mui/icons-material';
import type { DBPoll as Poll, DBPollOption as Option } from '@/services/db/poll/types';
import { VotersList } from './VotersList';

/**
 * 総投票数を計算
 */
export function calculateTotalVotes(poll: Poll): number {
  return poll.options.reduce((sum, option) => sum + option.votes, 0);
}

/**
 * 最多得票の選択肢を取得
 */
export function getWinningOption(poll: Poll): Option | null {
  if (poll.options.length === 0) return null;
  return poll.options.reduce((max, option) =>
    option.votes > max.votes ? option : max, poll.options[0]
  );
}

interface ResultPageProps {
  poll: Poll;
}

export function ResultPage({ poll }: ResultPageProps) {
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
  const totalVotes = calculateTotalVotes(poll);
  const winningOption = getWinningOption(poll);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, width: '100%', boxSizing: 'border-box' }}>
        {/* 左側: 投票結果 */}
        <Box sx={{ flex: 1, minWidth: 0, boxSizing: 'border-box' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2, md: 3 },
              borderRadius: 0.5,
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
              boxSizing: 'border-box',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChartIcon sx={{ color: '#3b82f6', fontSize: '24px' }} />
                <Typography variant="h6" component="h2" fontWeight={700} sx={{ color: 'text.primary' }}>
                  投票結果
                </Typography>
              </Box>
              {/* <ResultPageClient poll={poll} /> */}
            </Box>

            <Typography variant="body1" sx={{ color: 'text.primary', mb: 3, fontSize: '16px' }}>
              {poll.title}
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
                    <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                      <Typography
                        className="option-title"
                        variant="body1"
                        fontWeight={700}
                        sx={{
                          color: 'text.primary',
                          fontSize: '18px',
                          display: 'block',
                          mb: 2,
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {option.title || option.url}
                      </Typography>

                      {/* 予算の表示 */}
                      {option.budgetMin || option.budgetMax ? (
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '14px',
                            mb: 1.5,
                          }}
                        >
                          予算:{' '}
                          {(() => {
                            const min = option.budgetMin && option.budgetMin.trim() ? parseInt(option.budgetMin, 10).toLocaleString() : '';
                            const max = option.budgetMax && option.budgetMax.trim() ? parseInt(option.budgetMax, 10).toLocaleString() : '';
                            if (min && max) {
                              // 最小値と最大値が同じ場合は1つだけ表示
                              if (option.budgetMin === option.budgetMax) {
                                return `${min} 円`;
                              }
                              return `${min} ~ ${max} 円`;
                            } else if (min) {
                              return `${min} ~ 円`;
                            } else if (max) {
                              return `~ ${max} 円`;
                            }
                            return '';
                          })()}
                        </Typography>
                      ) : null}

                      {/* 備考の表示 */}
                      {option.description && (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '14px',
                              lineHeight: 1.5,
                            }}
                          >
                            {option.description}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'text.primary',
                            fontWeight: 700,
                            fontSize: '20px',
                          }}
                        >
                          {option.votes.toLocaleString()}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '14px' }}>
                          票
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.primary',
                            fontWeight: 600,
                            fontSize: '18px',
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
        <Box sx={{ width: { xs: '100%', md: 260 }, flexShrink: 0, boxSizing: 'border-box' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <HowToVoteIcon sx={{ color: '#3b82f6', fontSize: '24px' }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
                総投票数
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  fontWeight: 700,
                  fontSize: '20px',
                }}
              >
                {totalVotes.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '14px' }}>
                票
              </Typography>
            </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PeopleIcon sx={{ color: '#3b82f6', fontSize: '24px' }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
                投票者
              </Typography>
            </Box>
            <VotersList poll={poll} />
          </Paper>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 3,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f3f4f6',
          p: 3,
          borderRadius: 1,
          height: 128,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          fontSize: '14px',
        }}
      >
        バナー広告
      </Box>
    </>
  );
}

