'use client';

import { CalendarCheck2, Trash2 } from 'lucide-react';
import PageHeader from '@/components/layouts/PageHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';
import { Separator } from '@/components/primitives/separator';
import type { Schedule } from '@/db/core/types';
import { useScheduleActions } from '../../hooks/useScheduleActions';
import { Dialogs } from './Dialogs';
import TimeRemaining from './TimeRemaining';

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

  return (
    <>
      <PageHeader
        title={scheduleData.title}
        onOrganizerMenuClick={actionsHook.handleMenuOpen}
        isOrganizer={actionsHook.isOrganizer}
        actions={
          <DropdownMenu
            open={actionsHook.isMenuOpen}
            onOpenChange={(open) => !open && actionsHook.handleMenuClose()}
          >
            <DropdownMenuTrigger asChild>
              <div className="hidden" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] rounded-[2px] p-1">
              <DropdownMenuItem
                onClick={actionsHook.handleCloseClick}
                className="flex cursor-pointer items-center gap-2 rounded-[2px] px-3 py-2 transition-colors hover:bg-slate-100"
              >
                <CalendarCheck2 size={18} className="text-slate-500" />
                <span className="font-medium text-[14px] text-slate-700">日程を決定</span>
              </DropdownMenuItem>

              <Separator className="my-1" />

              <DropdownMenuItem
                onClick={actionsHook.handleDeleteClick}
                className="flex cursor-pointer items-center gap-2 rounded-[2px] px-3 py-2 text-red-600 transition-colors focus:bg-red-50 focus:text-red-600"
              >
                <Trash2 size={18} />
                <span className="font-medium text-[14px]">削除する</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <TimeRemaining endDateTime={scheduleData.endDateTime} isClosed={false} />
      </PageHeader>

      <Dialogs
        scheduleData={{
          ...scheduleData,
          isClosed: !!scheduleData.isClosed,
        }}
        actionsHook={actionsHook}
      />
    </>
  );
}
