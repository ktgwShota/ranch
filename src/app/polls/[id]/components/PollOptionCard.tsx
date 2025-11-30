'use client';

import { Box, Card, CardContent, Chip, LinearProgress, Typography } from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';
import type { DBPollOption as Option, Voter } from '@/services/db/poll/types';
import { CustomButton } from '@/app/components/CustomButton';
import { Check as CheckIcon, ThumbUp as ThumbUpIcon } from '@mui/icons-material';

interface OptionCardProps {
  option: Option;
  totalVotes: number;
  isVoted: boolean;
  isVoting: boolean;
  isDisabled: boolean;
  onVote: () => void;
}

export function PollOptionCard({
  option,
  totalVotes,
  isVoted,
  isVoting,
  isDisabled,
  onVote,
}: OptionCardProps) {
  const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0.5,
        border: '1px solid #e5e7eb',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: 'none',
        position: 'relative',
      }}
    >
      <Box
        component="a"
        href={option.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'block',
          position: 'relative',
          aspectRatio: '16/10',
          borderRadius: '4px 4px 0 0',
          overflow: 'hidden',
          textDecoration: 'none',
          cursor: 'pointer',
          bgcolor: '#f8f9fa',
        }}
      >
        {option.image ? (
          <Box
            component="img"
            src={option.image}
            alt={option.title || 'Option image'}
            referrerPolicy="no-referrer"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            }}
          />
        )}

        {/* 予算ラベル（画像の右上） */}
        {option.budgetMin || option.budgetMax ? (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
            }}
          >
            <Chip
              label={(() => {
                const min = option.budgetMin && option.budgetMin.trim() ? parseInt(option.budgetMin, 10).toLocaleString() : '';
                const max = option.budgetMax && option.budgetMax.trim() ? parseInt(option.budgetMax, 10).toLocaleString() : '';
                if (min && max) {
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
              size="small"
              sx={{
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.85) 100%)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                height: '28px',
                backdropFilter: 'blur(12px) saturate(150%)',
                borderRadius: '4px',
                border: '0.5px solid rgba(255, 255, 255, 0.1)',
                '& .MuiChip-label': {
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                },
              }}
            />
          </Box>
        ) : null}

        {!option.image && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            <RestaurantIcon
              sx={{
                fontSize: 64,
                color: '#adb5bd',
                mb: 1.5,
                opacity: 0.8,
              }}
            />
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                opacity: 0.7,
              }}
            >
              画像を読み込み中...
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          background: 'transparent',
          backdropFilter: 'none',
          borderRadius: '0 0 4px 4px',
          minHeight: 0, // flexboxの子要素が縮小できるようにする
        }}
      >
        {option.title && (
          <Typography
            id={`option-title-${option.id}`}
            component="a"
            href={option.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="body1"
            fontWeight="700"
            sx={{
              color: 'text.primary',
              fontSize: '18px',
              lineHeight: 1.4,
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': {
                color: '#1976d2',
                textDecoration: 'underline',
              },
            }}
          >
            {option.title}
          </Typography>
        )}

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

        {/* 備考より下を一番下に固定するためのコンテナ */}
        <Box
          sx={{
            mt: 'auto', // 上にマージンを自動で設定して、一番下に配置
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ResultDisplay votes={option.votes} percentage={votePercentage} />

          <VoterList voters={option.voters} />

          <CustomButton
            onClick={onVote}
            disabled={isDisabled}
            loading={isVoting}
            loadingText={isVoted ? '投票取消中...' : '投票中...'}
            variant={isVoted ? 'outlined' : 'contained'}
            startIcon={isVoted ? <CheckIcon sx={{ fontSize: '19px' }} /> : <ThumbUpIcon sx={{ fontSize: '19px' }} />}
            fullWidth
            size="large"
            sx={{
              boxShadow: 'none',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              py: 1.5,
              ...(isVoted && {
                color: '#0369a1',
                borderColor: '#bfdbfe',
                borderWidth: 1,
                background: '#f8fafc',
                '&:hover': {
                  background: '#e0e7ff',
                  borderColor: '#60a5fa',
                },
              }),
              ...(!isVoted && {
                background: '#f3f4f6',
                color: 'text.primary',
                border: '1px solid #d1d5db',
                '&:hover': {
                  background: '#e5e7eb',
                },
              }),
            }}
          >
            {isVoted ? '投票済み' : '投票する'}
          </CustomButton>
        </Box>
      </CardContent>
    </Card>
  );
}


interface VoterListProps {
  voters: Voter[];
}

export function VoterList({ voters }: VoterListProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: '14px',
          mb: 1,
          display: 'block',
        }}
      >
        投票者
      </Typography>
      {voters && voters.length > 0 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {voters.slice(0, 5).map((voter) => (
            <Box
              key={voter.id}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {(voter.name && voter.name.length > 0 ? voter.name.charAt(0) : '?').toUpperCase()}
            </Box>
          ))}
          {voters.length > 5 && (
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                fontSize: '14px',
                fontWeight: 600,
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              +{voters.length - 5}
            </Box>
          )}
        </Box>
      ) : (
        <Typography
          variant="body1"
          sx={{
            height: 32,
            display: 'flex',
            alignItems: 'center',
            color: '#9ca3af',
            fontSize: '14px',
            fontStyle: 'italic',
          }}
        >
          -
        </Typography>
      )}
    </Box>
  );
}

interface ResultDisplayProps {
  votes: number;
  percentage: number;
}

function ResultDisplay({ votes, percentage }: ResultDisplayProps) {
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
