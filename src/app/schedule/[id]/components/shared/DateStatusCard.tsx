'use client';

import type { Dayjs } from 'dayjs';
import { FormattedDate } from '@/components/ui/FormattedDate';
import { ScoreProgressBar } from './ScoreProgressBar';

interface DateStatusCardProps {
  date: Dayjs;
  time?: string;
  score: number;
  total: number;
  isConfirmed?: boolean;
  isDismissed?: boolean;
  isBest?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function DateStatusCard({
  date,
  time,
  score,
  total,
  isConfirmed = false,
  isDismissed = false,
  isBest = false,
  isSelected = false,
  onClick,
  className,
}: DateStatusCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex w-full min-w-[100px] flex-1 flex-col items-center justify-center p-3 transition-colors ${onClick ? 'cursor-pointer' : 'cursor-default'}
        ${
          isSelected
            ? 'bg-blue-50/80 hover:bg-blue-50'
            : isConfirmed
              ? 'bg-blue-100/50'
              : isDismissed
                ? 'bg-gray-100/50'
                : isBest
                  ? 'bg-green-50/50'
                  : 'bg-white hover:bg-gray-50'
        }text-slate-900 ${className}
      `}
    >
      <div className="flex h-full w-full flex-col items-center justify-between">
        <div className="mb-1 font-semibold text-[12px]">
          <FormattedDate date={date} />
        </div>

        <div className="mb-2 text-[10px] text-slate-500">{time ? `${time} ~` : '-'}</div>

        <ScoreProgressBar score={score} total={total} />
      </div>
    </div>
  );
}
