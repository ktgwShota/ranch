'use client';

import type { Schedule } from '@/db/core/types';
import { useScheduleData } from '../../hooks/useScheduleData';
import { useScheduleResponse } from '../../hooks/useScheduleResponse';
import DesktopTable from './DesktopTable';
import MobileTable from './MobileTable';

interface ContentsProps {
  schedule: Schedule;
}

export function Contents({ schedule }: ContentsProps) {
  const scheduleData = {
    ...schedule,
    responses: schedule.responses ?? [],
  };

  const { allDateTimes, bestKeys } = useScheduleData({
    dates: scheduleData.dates,
    responses: scheduleData.responses,
  });

  const responseHook = useScheduleResponse({
    scheduleId: scheduleData.id,
    responses: scheduleData.responses,
    allDateTimes,
  });

  const scheduleTableProps = {
    allDateTimes,
    allResponses: scheduleData.responses,
    bestKeys,
    isClosed: !!scheduleData.isClosed,
    confirmedDateTime: scheduleData.confirmedDateTime,
    ...responseHook,
  };

  return (
    <div className="mb-2 overflow-hidden rounded-[2px] border border-slate-200 bg-white">
      <div className="block sm:hidden">
        <MobileTable {...scheduleTableProps} />
      </div>
      <div className="hidden sm:block">
        <DesktopTable {...scheduleTableProps} />
      </div>
    </div>
  );
}
