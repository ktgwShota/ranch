'use client';

import { Box, Typography } from '@mui/material';
import type { DateTimeItem, Response } from './types';
import StatusIcon from './StatusIcon';

interface TableRowProps {
  response: Response;
  allDateTimes: DateTimeItem[];
  bestKeys?: Set<string>;
  confirmedDateTime?: string | null;
  isMyResponse?: boolean;
  showMyBadge?: boolean;
  onEdit?: () => void;
}

export default function TableRow({
  response,
  allDateTimes,
  bestKeys,
  confirmedDateTime,
  isMyResponse = false,
  showMyBadge = false,
  onEdit,
}: TableRowProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        borderBottom: '1px solid #e5e7eb',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      {/* 名前列（固定） */}
      <Box
        sx={{
          width: 100,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: showMyBadge ? 'center' : 'flex-start',
          p: 1.5,
          borderRight: '1px solid #e5e7eb',
          position: 'sticky',
          left: 0,
          zIndex: 1,
          backgroundColor: 'white',
        }}
      >
        {showMyBadge ? (
          <Box
            onClick={isMyResponse && onEdit ? onEdit : undefined}
            sx={{
              width: 70,
              textAlign: 'left',
              cursor: isMyResponse && onEdit ? 'pointer' : 'default',
              '&:hover': isMyResponse && onEdit ? { opacity: 0.7 } : undefined,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: 'bold',
                fontSize: '12px',
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
              fontSize: '12px',
              fontWeight: 'bold',
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
        const isDismissed = !!confirmedDateTime && !isConfirmed;

        return (
          <Box
            key={key}
            sx={{
              minWidth: 100,
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              p: 1.5,
              alignItems: 'center',
              borderRight: '1px solid #e5e7eb',
              '&:last-child': { borderRight: 'none' },
              backgroundColor: isConfirmed
                ? 'rgba(33, 150, 243, 0.12)' // 決定: 青
                : isDismissed
                  ? 'rgba(0, 0, 0, 0.04)' // 見送り: グレー
                  : isBest
                    ? 'rgba(76, 175, 80, 0.08)' // ベスト: 緑
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

