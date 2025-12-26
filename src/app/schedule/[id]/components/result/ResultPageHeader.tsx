'use client';

import { useMemo } from 'react';
import PageHeader from '@/components/layouts/PageHeader';
import { Menu, MenuItem, Divider } from '@mui/material';
import { ManageAccounts as ManageAccountsIcon, Delete as DeleteIcon, EventAvailable } from '@mui/icons-material';
import { InfoLabel } from '@/components/ui/InfoLabel';
import { FormattedDate } from '@/components/ui/FormattedDate';
import dayjs from '@/lib/dayjs';
import type { ScheduleData } from '../shared/types';

// Actions hookの型定義が必要だが、一旦anyで受けるか、インターフェースを定義するか。
// useScheduleActionsの戻り値の型を使うのがベストだが、exportされていない可能性がある。
// ここでは必要なプロパティだけ定義する。
interface ActionsHook {
  isOrganizer: boolean;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  menuAnchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  handleMenuClose: () => void;
  handleReopenConfirm: () => void;
  handleDeleteClick: () => void;
}

interface ResultPageHeaderProps {
  scheduleData: ScheduleData;
  actionsHook: ActionsHook;
}

export function ResultPageHeader({ scheduleData, actionsHook }: ResultPageHeaderProps) {
  const confirmedInfo = useMemo(() => {
    if (!scheduleData.confirmedDateTime) return null;
    const parts = scheduleData.confirmedDateTime.split('-');
    if (parts.length >= 4 && parts[3].includes(':')) {
      return {
        date: dayjs(`${parts[0]}-${parts[1]}-${parts[2]}`),
        time: parts[3],
      };
    }
    return {
      date: dayjs(scheduleData.confirmedDateTime),
      time: undefined,
    };
  }, [scheduleData.confirmedDateTime]);

  return (
    <PageHeader
      title={scheduleData.title}
      isOrganizer={actionsHook.isOrganizer}
      onOrganizerMenuClick={actionsHook.handleMenuOpen}
      actions={
        <Menu
          anchorEl={actionsHook.menuAnchorEl}
          open={actionsHook.isMenuOpen}
          onClose={actionsHook.handleMenuClose}
        >
          <MenuItem onClick={actionsHook.handleReopenConfirm}>
            <ManageAccountsIcon sx={{ mr: 1, fontSize: 20 }} />
            日程調整を再開
          </MenuItem>
          <Divider />
          <MenuItem onClick={actionsHook.handleDeleteClick} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
            削除
          </MenuItem>
        </Menu>
      }
    >
      {confirmedInfo && (
        <InfoLabel
          label="日程決定"
          value={
            <FormattedDate date={confirmedInfo.date} />
          }
          icon={<EventAvailable sx={{ fontSize: 16, color: '#2196f3' }} />}
        />
      )}
    </PageHeader>
  );
}
