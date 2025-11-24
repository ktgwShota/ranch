import { Box, Typography } from '@mui/material';
import type { Voter } from '@/services/db/poll/types';

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

