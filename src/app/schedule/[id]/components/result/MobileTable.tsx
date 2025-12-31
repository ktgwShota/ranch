'use client';

import { Progress } from '@/components/primitives/progress';
import { FormattedDate } from '@/components/ui/FormattedDate';
import {
  calculateScore,
  calculateSummary,
  type DateTimeItem,
  formatScore,
  type Response,
} from '../../types';
import StatusIcon from '../shared/StatusIcon';

interface MobileTableProps {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  confirmedDateTime: string | null;
}

export default function MobileTable({
  allDateTimes,
  responses,
  confirmedDateTime,
}: MobileTableProps) {
  return (
    <>
      {allDateTimes.map(({ date, time, key }) => {
        const summary = calculateSummary(key, responses);
        const score = calculateScore(summary.available, summary.maybe);
        const ratio = responses.length > 0 ? score / responses.length : 0;
        const isConfirmed = confirmedDateTime === key;
        const isDismissed = !!confirmedDateTime && !isConfirmed;

        const statusColor =
          ratio >= 0.8 ? 'text-green-500' : ratio >= 0.5 ? 'text-orange-500' : 'text-red-500';
        const progressColor =
          ratio >= 0.8 ? 'bg-green-500' : ratio >= 0.5 ? 'bg-orange-500' : 'bg-red-500';

        return (
          <div key={key} className="overflow-hidden rounded-[2px] border border-[#e5e7eb]">
            {/* 日程ヘッダー */}
            <div
              className={`p-8 ${
                isConfirmed ? 'bg-blue-50' : isDismissed ? 'bg-gray-50' : 'bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {isConfirmed && (
                    <span className="rounded-[2px] bg-blue-600 px-6 py-3 font-bold text-[11px] text-white">
                      決定
                    </span>
                  )}

                  <div className="font-semibold text-sm">
                    <FormattedDate date={date} />
                    {time && <span className="font-normal"> {time} ~</span>}
                  </div>
                </div>
                <div className={`font-semibold text-sm ${statusColor}`}>
                  {formatScore(score)}
                  <span className="mx-[1px] font-normal text-gray-400">/</span>
                  <span className="text-gray-400">{responses.length}</span>
                </div>
              </div>

              <div className="mt-[14px]">
                <Progress
                  value={ratio * 100}
                  className="h-1.5 bg-gray-200"
                  indicatorClassName={progressColor}
                />
              </div>
            </div>

            {/* 回答者リスト */}
            <div
              className={`border-[#e5e7eb] border-t px-8 py-4 ${
                isConfirmed ? 'bg-blue-50' : isDismissed ? 'bg-gray-50' : 'bg-gray-50/50'
              }`}
            >
              {responses.length > 0 &&
                responses.map((response) => (
                  <div
                    key={response.respondentId}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="font-bold text-gray-700 text-xs">{response.name}</span>
                    <StatusIcon status={response.availability[key]} size={20} />
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
