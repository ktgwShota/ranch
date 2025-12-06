'use client';

import { useMemo } from 'react';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { EventAvailable as EventAvailableIcon, MoreVert as MoreVertIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: 1,
            backgroundColor: '#dcfce7',
            color: '#16a34a',
          }}
        >
          <EventAvailableIcon sx={{ fontSize: 20 }} />
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            決定: {confirmedInfo.date.format('M月D日')} ({confirmedInfo.date.format('ddd')})
            {confirmedInfo.time && ` ${confirmedInfo.time}〜`}
          </Typography>
        </Box>
      )}
    </HeaderBase>
  );
}
