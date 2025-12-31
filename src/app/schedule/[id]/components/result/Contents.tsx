'use client';

import type { Schedule } from '@/db/core/types';
import { useScheduleData } from '../../hooks/useScheduleData';
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

  const { allDateTimes } = useScheduleData({
    dates: scheduleData.dates,
    responses: scheduleData.responses,
  });

  const sortedDateTimes = [...allDateTimes].sort((a, b) => {
    if (a.key === scheduleData.confirmedDateTime) return -1;
    if (b.key === scheduleData.confirmedDateTime) return 1;
    return 0;
  });

  return (
    <div className="rounded-[2px] bg-white">
      {/* Desktop */}
      <div className="hidden rounded-[2px] border border-[#ddd] sm:block">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <DesktopTable
              allDateTimes={sortedDateTimes}
              responses={scheduleData.responses}
              confirmedDateTime={scheduleData.confirmedDateTime}
            />
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="flex flex-col gap-10 sm:hidden">
        <MobileTable
          allDateTimes={sortedDateTimes}
          responses={scheduleData.responses}
          confirmedDateTime={scheduleData.confirmedDateTime}
        />
      </div>
    </div>
  );
}
