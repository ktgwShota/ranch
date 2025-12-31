'use client';

import type { DateTimeItem, Response } from '../../types';
import StatusIcon from './StatusIcon';

interface TableRowProps {
  response: Response;
  allDateTimes: DateTimeItem[];
  bestKeys?: Set<string>;
  confirmedDateTime?: string | null;
  isMyResponse?: boolean;
  showMyBadge?: boolean;
  onEdit?: () => void;
}

export default function TableRow({
  response,
  allDateTimes,
  bestKeys,
  confirmedDateTime,
  isMyResponse = false,
  showMyBadge = false,
  onEdit,
}: TableRowProps) {
  return (
    <div className="flex items-stretch border-slate-200 border-b last:border-b-0">
      {/* 名前列（固定） */}
      <div
        className={`flex w-[100px] shrink-0 items-center ${showMyBadge ? 'justify-center' : 'justify-start'} sticky left-0 z-[1] border-slate-200 border-r bg-white p-6`}
      >
        {showMyBadge ? (
          <div
            onClick={isMyResponse && onEdit ? onEdit : undefined}
            className={`w-[70px] text-left ${isMyResponse && onEdit ? 'cursor-pointer hover:opacity-70' : 'cursor-default'}`}
          >
            <span
              className={`font-bold text-[12px] ${isMyResponse ? 'text-blue-600' : 'text-slate-900'}`}
            >
              {response.name}
            </span>
            {isMyResponse && <span className="ml-1 text-[9px] text-blue-600">(Me)</span>}
          </div>
        ) : (
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-bold text-slate-900 text-xs">
            {response.name}
          </span>
        )}
      </div>

      {/* ステータスセル */}
      {allDateTimes.map(({ key }) => {
        const status = response.availability[key];
        const isBest = bestKeys?.has(key) ?? false;
        const isConfirmed = confirmedDateTime === key;
        const isDismissed = !!confirmedDateTime && !isConfirmed;

        return (
          <div
            key={key}
            className={`flex min-w-[100px] flex-1 items-center justify-center border-slate-200 border-r p-6 last:border-r-0 ${
              isConfirmed
                ? 'bg-blue-100/50'
                : isDismissed
                  ? 'bg-gray-100/50'
                  : isBest
                    ? 'bg-green-50/50'
                    : 'bg-transparent'
            }
            `}
          >
            <StatusIcon status={status} size={24} />
          </div>
        );
      })}
    </div>
  );
}
