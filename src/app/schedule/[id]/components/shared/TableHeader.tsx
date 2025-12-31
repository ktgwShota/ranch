'use client';

import { calculateScore, calculateSummary, type DateTimeItem, type Response } from '../../types';
import { DateStatusCard } from './DateStatusCard';

interface TableHeaderProps {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  confirmedDateTime: string | null;
  bestKeys?: Set<string>;
  confirmedLabel?: string;
  hasNameColumn?: boolean; // 追加
}

export default function TableHeader({
  allDateTimes,
  responses,
  confirmedDateTime,
  bestKeys,
  hasNameColumn = true, // デフォルトは表示
}: TableHeaderProps) {
  return (
    <div className="flex border-slate-200 border-b">
      {/* 左端の固定列（名前用） */}
      {hasNameColumn && (
        <div className="sticky left-0 z-20 w-[100px] shrink-0 border-slate-200 border-r bg-white" />
      )}

      {/* 日時列 */}
      {allDateTimes.map(({ date, time, key }, index) => {
        const summary = calculateSummary(key, responses);
        const score = calculateScore(summary.available, summary.maybe);
        const isConfirmed = confirmedDateTime === key;
        const isDismissed = !!confirmedDateTime && !isConfirmed;
        const isBest = bestKeys?.has(key) ?? false;
        const isClosed = !!confirmedDateTime;
        const isLast = index === allDateTimes.length - 1;

        return (
          <div
            key={key}
            className="flex min-w-[100px] flex-1 flex-col items-center justify-center overflow-hidden"
          >
            {isClosed && (
              <div
                className={`flex h-[22px] w-full items-center justify-center font-bold text-[10px] text-white ${
                  isConfirmed ? 'bg-blue-500' : isDismissed ? 'bg-gray-400' : 'bg-transparent'
                }`}
              >
                {isConfirmed && '決定'}
              </div>
            )}

            <DateStatusCard
              key={key}
              date={date}
              time={time}
              score={score}
              total={responses.length}
              isConfirmed={isConfirmed}
              isDismissed={isDismissed}
              isBest={isBest}
              className={isLast ? '' : 'border-slate-200 border-r'}
            />
          </div>
        );
      })}
    </div>
  );
}
