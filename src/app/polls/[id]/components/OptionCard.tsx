'use client';

import { Box, Card, CardContent, CardMedia, Skeleton, Typography } from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';
import type { DBPollOption as Option } from '@/services/db/poll/types';
import { ResultDisplay } from './ResultDisplay';
import { VoterList } from './VoterList';
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

export function OptionCard({
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
      <CardMedia
        component="a"
        href={option.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          aspectRatio: '16/10',
          backgroundImage: option.image
            ? `url(${option.image})`
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          borderRadius: '4px 4px 0 0',
          overflow: 'hidden',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        {!option.image && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
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
              variant="body2"
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
      </CardMedia>

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
        {option.title ? (
          <Typography
            id={`option-title-${option.id}`}
            component="a"
            href={option.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="body1"
            fontWeight="700"
            sx={{
              color: '#111827',
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
        ) : (
          <Skeleton variant="text" height={25.2} sx={{ mb: 1.5 }} />
        )}

        {/* 予算の表示 */}
        {option.budgetMin || option.budgetMax ? (
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
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
              variant="body2"
              sx={{
                color: '#6b7280',
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
                color: '#374151',
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

