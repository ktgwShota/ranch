'use client';

import { Box, Avatar, Divider, Button, Typography } from '@mui/material';
import { useState } from 'react';
import type { DBPoll as Poll } from '@/services/db/poll/types';

interface VotersListProps {
  poll: Poll;
}

export function VotersList({ poll }: VotersListProps) {
  const [showAll, setShowAll] = useState(false);
  const allVoters = poll.options.flatMap((option) =>
    option.voters.map((voter) => ({ ...voter, votedFor: option.title || option.url }))
  );

  const displayedVoters = showAll ? allVoters : allVoters.slice(0, 3);
  const hasMore = allVoters.length > 3;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Divider />

      {displayedVoters.map((voter, index) => (
        <Box key={`${voter.id}-${index}`}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#667eea',
                fontSize: '14px',
              }}
            >
              {(voter.name && voter.name.length > 0 ? voter.name.charAt(0) : '?').toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" fontWeight={600} sx={{ color: 'text.primary' }}>
                {voter.name || '匿名'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '14px',
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
          {index < displayedVoters.length - 1 && <Divider sx={{ mt: 1.5 }} />}
        </Box>
      ))}

      <Divider />

      {hasMore && !showAll && (
        <Button
          variant="text"
          onClick={() => setShowAll(true)}
          sx={{
            color: '#3b82f6',
            textTransform: 'none',
            mt: 1,
            p: 0,
            '&:hover': {
              backgroundColor: '#00000000',
            },
          }}
        >
          もっと見る...
        </Button>
      )}
    </Box>
  );
}

