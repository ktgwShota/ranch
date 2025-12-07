'use client';

import { Box, Typography } from '@mui/material';
import { DateTimeItem, Response } from './types';
import StatusIcon from './StatusIcon';

interface TableRowProps {
  response: Response;
  allDateTimes: DateTimeItem[];
  bestKeys?: Set<string>;
  confirmedDateTime?: string | null;
  isMyResponse?: boolean;
  showMyBadge?: boolean;
}

export default function TableRow({
  response,
  allDateTimes,
  bestKeys,
  confirmedDateTime,
  isMyResponse = false,
  showMyBadge = false,
}: TableRowProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      {/* 名前列（固定） */}
      <Box
        sx={{
          width: 96,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: showMyBadge ? 'center' : 'flex-start',
          py: 1.5,
          px: showMyBadge ? 0 : 1.5,
          borderRight: '1px solid #e5e7eb',
          position: 'sticky',
          left: 0,
          zIndex: 1,
          backgroundColor: 'white',
        }}
      >
        {showMyBadge ? (
          <Box sx={{ width: 70, textAlign: 'left' }}>
            <Typography
              component="span"
              sx={{
                fontWeight: isMyResponse ? 600 : 500,
                fontSize: '13px',
                color: isMyResponse ? 'primary.main' : 'text.primary',
              }}
            >
              {response.name}
            </Typography>
            {isMyResponse && (
              <Typography component="span" sx={{ fontSize: '9px', color: 'primary.main', ml: 0.5 }}>
                (Me)
              </Typography>
            )}
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {response.name}
          </Typography>
        )}
      </Box>

      {/* ステータスセル */}
      {allDateTimes.map(({ key }) => {
        const status = response.availability[key];
        const isBest = bestKeys?.has(key) ?? false;
        const isConfirmed = confirmedDateTime === key;

        return (
          <Box
            key={key}
            sx={{
              width: 96,
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: showMyBadge ? 2.5 : 1,
              borderRight: '1px solid #e5e7eb',
              '&:last-child': { borderRight: 'none' },
              backgroundColor: isBest && !isConfirmed
                ? 'rgba(76, 175, 80, 0.08)'
                : 'transparent',
            }}
          >
            <StatusIcon status={status} size={24} />
          </Box>
        );
      })}
    </Box>
  );
}

