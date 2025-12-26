'use client';

import PageHeader from '@/components/layouts/PageHeader';
import { Menu, MenuItem, Divider } from '@mui/material';
import { Lock as LockIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ActiveTimeRemaining from './ActiveTimeRemaining';
import type { ScheduleData } from '../shared/types';

interface ActionsHook {
  isOrganizer: boolean;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  menuAnchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  handleMenuClose: () => void;
  handleCloseClick: () => void;
  handleDeleteClick: () => void;
}

interface ActivePageHeaderProps {
  scheduleData: ScheduleData;
  actionsHook: ActionsHook;
}

export function ActivePageHeader({ scheduleData, actionsHook }: ActivePageHeaderProps) {
  return (
    <PageHeader
      title={scheduleData.title}
      onOrganizerMenuClick={actionsHook.handleMenuOpen}
      isOrganizer={actionsHook.isOrganizer}
      actions={
        <Menu
          anchorEl={actionsHook.menuAnchorEl}
          open={actionsHook.isMenuOpen}
          onClose={actionsHook.handleMenuClose}
        >
          <MenuItem onClick={actionsHook.handleCloseClick}>
            <LockIcon sx={{ mr: 1, fontSize: 20 }} />
            日程を決定
          </MenuItem>
          <Divider />
          <MenuItem onClick={actionsHook.handleDeleteClick} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
            削除する
          </MenuItem>
        </Menu>
      }
    >
      <ActiveTimeRemaining endDateTime={scheduleData.endDateTime} isClosed={false} />
    </PageHeader>
  );
}
