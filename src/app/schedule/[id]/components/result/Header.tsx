'use client';

import { CalendarCheck2, Trash2, UserCog } from 'lucide-react';
import { useMemo } from 'react';
import PageHeader from '@/components/layouts/PageHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';
import { Separator } from '@/components/primitives/separator';
import { FormattedDate } from '@/components/ui/FormattedDate';
import { InfoLabel } from '@/components/ui/InfoLabel';
import type { Schedule } from '@/db/core/types';
import dayjs from '@/lib/dayjs';
import { useScheduleActions } from '../../hooks/useScheduleActions';
import { Dialogs } from './Dialogs';

interface HeaderProps {
  schedule: Schedule;
}

export function Header({ schedule }: HeaderProps) {
  const scheduleData = {
    ...schedule,
    responses: schedule.responses ?? [],
  };

  const actionsHook = useScheduleActions({
    scheduleId: scheduleData.id,
  });

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
    <>
      <PageHeader
        title={scheduleData.title}
        isOrganizer={actionsHook.isOrganizer}
        onOrganizerMenuClick={actionsHook.handleMenuOpen}
        actions={
          <DropdownMenu
            open={actionsHook.isMenuOpen}
            onOpenChange={(open) => !open && actionsHook.handleMenuClose()}
          >
            <DropdownMenuTrigger asChild>
              <div style={{ display: 'none' }} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={actionsHook.handleReopenConfirm}
                className="cursor-pointer"
              >
                <UserCog className="mr-2 h-4 w-4" />
                <span>日程調整を再開</span>
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem
                onClick={actionsHook.handleDeleteClick}
                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>削除</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        {confirmedInfo && (
          <InfoLabel
            label="日程決定"
            value={<FormattedDate date={confirmedInfo.date} />}
            icon={<CalendarCheck2 size={16} className="text-blue-500" />}
          />
        )}
      </PageHeader>

      <Dialogs actionsHook={actionsHook} />
    </>
  );
}
