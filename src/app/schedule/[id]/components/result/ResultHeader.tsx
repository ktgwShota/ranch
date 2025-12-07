'use client';

import { useMemo } from 'react';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { CheckCircle as CheckCircleIcon, MoreVert as MoreVertIcon, Delete as DeleteIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import HeaderBase from '../shared/HeaderBase';

dayjs.locale('ja');

interface ResultHeaderProps {
  title: string;
  confirmedDateTime: string | null;
  menuAnchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onDeleteClick: () => void;
}

export default function ResultHeader({
  title,
  confirmedDateTime,
  menuAnchorEl,
  isMenuOpen,
  onMenuOpen,
  onMenuClose,
  onDeleteClick,
}: ResultHeaderProps) {
  const confirmedInfo = useMemo(() => {
    if (!confirmedDateTime) return null;
    const parts = confirmedDateTime.split('-');
    if (parts.length >= 4 && parts[3].includes(':')) {
      return {
        date: dayjs(`${parts[0]}-${parts[1]}-${parts[2]}`),
        time: parts[3],
      };
    }
    return {
      date: dayjs(confirmedDateTime),
      time: undefined,
    };
  }, [confirmedDateTime]);

  return (
    <HeaderBase
      title={title}
      actions={
        <>
          <IconButton onClick={onMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={menuAnchorEl} open={isMenuOpen} onClose={onMenuClose}>
            <MenuItem onClick={onDeleteClick} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
              削除する
            </MenuItem>
          </Menu>
        </>
      }
    >
      {confirmedInfo && (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2.5,
            py: 1.25,
            borderRadius: 2,
            backgroundColor: '#2196f3',
            color: 'white',
            boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 22 }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>
              {confirmedInfo.date.format('M月D日')} ({confirmedInfo.date.format('ddd')})
              {confirmedInfo.time && ` ${confirmedInfo.time}〜`}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', opacity: 0.9 }}>
              確定済み
            </Typography>
          </Box>
        </Box>
      )}
    </HeaderBase>
  );
}
