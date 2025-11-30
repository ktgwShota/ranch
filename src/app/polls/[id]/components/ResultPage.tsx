import { Box, Paper, Typography, LinearProgress, Avatar, Divider, Chip } from '@mui/material';
import { BarChart as BarChartIcon, HowToVote as HowToVoteIcon, People as PeopleIcon, Star as StarIcon } from '@mui/icons-material';
import type { DBPoll as Poll, DBPollOption as Option } from '@/services/db/poll/types';
import { ResultVoterList } from './ResultVoterList';

interface ResultPageProps {
  pollData: Poll;
}

export function ResultPage({ pollData }: ResultPageProps) {
  const sortedOptions = [...pollData.options].sort((a, b) => b.votes - a.votes);
  const totalVotes = calculateTotalVotes(pollData);
  const winningOption = getWinningOption(pollData);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, width: '100%', boxSizing: 'border-box' }}>
        <LeftColmun poll={pollData} sortedOptions={sortedOptions} totalVotes={totalVotes} winningOption={winningOption} />
        <RightColumn poll={pollData} totalVotes={totalVotes} />
      </Box>

      {/* <Box
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
      </Box> */}
    </>
  );
}

function LeftColmun({ poll, sortedOptions, totalVotes, winningOption }: { poll: Poll; sortedOptions: Option[]; totalVotes: number; winningOption: Option | null }) {
  return (
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
        </Box>

        <Typography variant="body1" sx={{ color: 'text.primary', mb: 3, fontSize: '16px' }}>
          {poll.title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {sortedOptions.map((option, index) => (
            <ResultOptionCard
              key={option.id}
              option={option}
              rank={index + 1}
              totalVotes={totalVotes}
              isWinner={!!(winningOption && winningOption.id === option.id)}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

function ResultOptionCard({
  option,
  rank,
  totalVotes,
  isWinner,
}: {
  option: Option;
  rank: number;
  totalVotes: number;
  isWinner: boolean;
}) {
  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
  const rankColorPalette = ['#fbbf24', '#cfd8ff', '#fde68a'];
  const rankColor = rankColorPalette[rank - 1] || '#e5e7eb';

  return (
    <Box
      component="a"
      href={option.url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'block',
        borderRadius: 0.5,
        border: isWinner ? '2px solid #fbbf24' : '1px solid #e5e7eb',
        boxShadow: isWinner ? '0 12px 30px rgba(251, 191, 36, 0.25)' : '0 4px 16px rgba(15, 23, 42, 0.08)',
        background: isWinner ? 'linear-gradient(135deg, #fff7db 0%, #fef3c7 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: isWinner ? '0 16px 35px rgba(251, 191, 36, 0.35)' : '0 10px 25px rgba(15, 23, 42, 0.18)',
        },
      }}
    >
      <Box sx={{ p: { xs: 2.5, sm: 3 }, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, position: 'relative', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${rank}位`}
              size="small"
              sx={{
                bgcolor: rankColor,
                color: isWinner ? '#78350f' : '#1f2937',
                fontWeight: 700,
                borderRadius: 999,
                px: 0.5,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {option.image && (
            <Box
              sx={{
                width: 72,
                height: 72,
                flexShrink: 0,
                borderRadius: 0.5,
                backgroundImage: `linear-gradient(rgba(15,23,42,0.25), rgba(15,23,42,0.25)), url(${option.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          <Box>
            <Typography
              className="option-title"
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: 1.4,
                mb: option.description ? 0.5 : 0,
              }}
            >
              {option.title || option.url}
            </Typography>
            {option.description && (
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                {option.description}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
          <Typography
            variant="h5"
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              fontSize: '22px',
            }}
          >
            {option.votes.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            票
          </Typography>
          <Typography
            variant="h6"
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
            height: 8,
            borderRadius: 999,
            backgroundColor: '#e5e7eb',
            '& .MuiLinearProgress-bar': {
              borderRadius: 999,
              background: isWinner ? 'linear-gradient(90deg, #16a34a 0%, #22c55e 100%)' : 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
            },
          }}
        />
      </Box>
    </Box>
  );
}

function RightColumn({ poll, totalVotes }: { poll: Poll; totalVotes: number }) {
  return (
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
          <HowToVoteIcon sx={{ color: '#3b82f6', fontSize: '22px' }} />
          <Typography fontWeight={700} sx={{ fontSize: '19px', color: 'text.primary' }}>
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
          <PeopleIcon sx={{ color: '#3b82f6', fontSize: '22px' }} />
          <Typography fontWeight={700} sx={{ fontSize: '19px', color: 'text.primary' }}>
            投票者
          </Typography>
        </Box>
        <ResultVoterList poll={poll} />
      </Paper>
    </Box>
  );
}

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