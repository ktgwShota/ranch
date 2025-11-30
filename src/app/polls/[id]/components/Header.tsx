import { Box, Typography } from '@mui/material';
import type { DBPoll as Poll } from '@/services/db/poll/types';
import { PollTimeRemaining } from './PollTimeRemaining';
import { PollMenu } from './PollMenu';

interface HeaderProps {
  poll: Poll;
  onChangeVoterName: () => void;
  hasVoterName: boolean;
}

export function Header({
  poll,
  onChangeVoterName,
  hasVoterName,
}: HeaderProps) {

  return (
    <Box
      sx={{
        background: '#ffffff',
        borderRadius: 0.5,
        p: { xs: 2.5, sm: 3 },
        mb: 3,
        border: '1px solid #e5e7eb',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h5"
            component="h1"
            fontWeight="700"
            sx={{
              color: 'text.primary',
              fontSize: '20px',
              lineHeight: 1.3,
            }}
          >
            {poll?.title}
          </Typography>
          <PollTimeRemaining poll={poll} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          {poll && (
            <PollMenu
              poll={poll}
              onChangeVoterName={onChangeVoterName}
              hasVoterName={hasVoterName}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

