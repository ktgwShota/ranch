'use client';

import { IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { MoreVert as MoreVertIcon, Delete as DeleteIcon, Lock as LockIcon } from '@mui/icons-material';
import HeaderBase from '../shared/HeaderBase';
import ActiveTimeRemaining from './ActiveTimeRemaining';

interface ActiveHeaderProps {
  title: string;
  endDateTime: string | null;
  menuAnchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onCloseClick: () => void;
  onDeleteClick: () => void;
}

export default function ActiveHeader({
  title,
  endDateTime,
  menuAnchorEl,
  isMenuOpen,
  onMenuOpen,
  onMenuClose,
  onCloseClick,
  onDeleteClick,
}: ActiveHeaderProps) {
  return (
    <HeaderBase
      title={title}
      actions={
        <>
          <IconButton onClick={onMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={menuAnchorEl} open={isMenuOpen} onClose={onMenuClose}>
            <MenuItem onClick={onCloseClick}>
              <LockIcon sx={{ mr: 1, fontSize: 20 }} />
              スケジュールを決定
            </MenuItem>
            <Divider />
            <MenuItem onClick={onDeleteClick} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
              削除する
            </MenuItem>
          </Menu>
        </>
      }
    >
      <ActiveTimeRemaining endDateTime={endDateTime} isClosed={false} />
    </HeaderBase>
  );
}

