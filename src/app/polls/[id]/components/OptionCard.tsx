import { Box, Card, CardContent, CardMedia, Skeleton, Typography } from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';
import type { Option } from '../types';
import { PollResultDisplay } from './PollResultDisplay';
import { VoterList } from './VoterList';
import { VoteButton } from './VoteButton';

interface OptionCardProps {
  option: Option;
  totalVotes: number;
  isVoted: boolean;
  isVoting: boolean;
  isDisabled: boolean;
  isDecided: boolean;
  isPollClosed: boolean;
  onVote: () => void;
}

export function OptionCard({
  option,
  totalVotes,
  isVoted,
  isVoting,
  isDisabled,
  isDecided,
  isPollClosed,
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
        boxShadow: '0 0 5px 1px rgba(0,0,0,0.1)',
        background: isDisabled
          ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        flex: '0 0 calc(100%)',
        [`@media (min-width: 600px)`]: {
          flex: '0 0 calc(50% - 12px)',
        },
        [`@media (min-width: 900px)`]: {
          flex: '0 0 calc(50% - 16px)',
        },
        // boxShadow: 'none',
        position: 'relative',
        ...(isDisabled && {
          opacity: 0.5,
          filter: 'grayscale(0.4)',
        }),
      }}
    >
      <CardMedia
        component="a"
        href={option.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          height: 200,
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
        {isDecided && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#1976d2',
              padding: '8px 16px',
              borderRadius: 2,
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.025em',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(25, 118, 210, 0.2)',
            }}
          >
            決定
          </Box>
        )}

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
        }}
      >
        {option.title ? (
          <Typography
            component="a"
            href={option.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="h6"
            fontWeight="700"
            sx={{
              color: '#111827',
              fontSize: '1.125rem',
              lineHeight: 1.4,
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
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
          <Skeleton variant="text" height={28} sx={{ mb: 2 }} />
        )}

        <PollResultDisplay votes={option.votes} percentage={votePercentage} />
        <VoterList voters={option.voters} />
        {!isPollClosed && (
          <VoteButton isVoted={isVoted} isVoting={isVoting} isDisabled={isDisabled} onClick={onVote} />
        )}
      </CardContent>
    </Card>
  );
}

