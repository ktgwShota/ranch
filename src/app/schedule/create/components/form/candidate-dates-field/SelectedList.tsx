'use client';

import { X, XCircle } from 'lucide-react';
import { FormattedDate } from '@/components/ui/FormattedDate';
import dayjs from '@/lib/dayjs';
import { getResponsiveValue } from '@/utils/styles';
import { useCandidateDates } from '../../../hooks/useCandidateDates';
import { useCandidateTimes } from '../../../hooks/useCandidateTimes';

export default function SelectedList() {
  const { selectedDates, lastSelectedDates, removeDate } = useCandidateDates();
  const { removeTime } = useCandidateTimes();

  if (selectedDates.length === 0) return null;

  const sortedDates = [...selectedDates].sort(
    (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
  );

  return (
    <div
      className="rounded-[2px] border border-[#e0e0e0] bg-[#fafafa]"
      style={{
        padding: getResponsiveValue(16, 24),
        marginBottom: getResponsiveValue(20, 24),
      }}
    >
      <div
        className="font-semibold text-[rgba(0,0,0,0.87)]"
        style={{
          fontSize: getResponsiveValue(14, 15), paddingBottom: getResponsiveValue(12, 20),
        }}
      >
        出欠表
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        style={{
          gap: getResponsiveValue(16, 20),
        }}
      >
        {sortedDates.map((dateInfo) => {
          const hasTimes = dateInfo.times.length > 0;
          const dateKey = dateInfo.date;

          const isSelected = lastSelectedDates?.some((d) => d.format('YYYY-MM-DD') === dateKey);

          return (
            <div
              key={dateKey}
              className="ease flex flex-col overflow-hidden rounded-[2px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-200"
            >
              <div
                className="flex items-center justify-between py-2.5 pr-2 pl-2.5"
                style={{
                  backgroundColor: isSelected ? '#f57c00' : '#1976d2',
                }}
              >
                <div
                  className="font-semibold text-white"
                  style={{
                    fontSize: getResponsiveValue(12, 13),
                  }}
                >
                  <FormattedDate date={dayjs(dateInfo.date)} />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDate(dateKey);
                  }}
                  className="rounded p-0.5 text-white opacity-80 transition-all hover:bg-white/20 hover:opacity-100"
                  title="削除"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Card Body */}
              <div
                className="flex-grow"
                style={{
                  padding: getResponsiveValue(8, 12),
                }}
              >
                {hasTimes ? (
                  <div
                    className="scrollbar-none flex flex-nowrap gap-2 overflow-x-auto sm:gap-3"
                    style={{
                      scrollbarWidth: 'none',
                    }}
                  >
                    {dateInfo.times.map((time, timeIndex) => (
                      <div
                        key={timeIndex}
                        className="flex shrink-0 items-center justify-center rounded-[2px] border border-[rgba(25,118,210,0.2)] bg-[rgba(25,118,210,0.08)] py-2 pr-2 pl-2.5 text-[#1976d2] text-xs"
                      >
                        {time} ~
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTime(dateKey, time);
                          }}
                          className="ml-2 flex cursor-pointer items-center text-red-500 opacity-60 hover:opacity-100"
                        >
                          <XCircle size={16} />
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[30px] items-center justify-center">
                    <span className="text-[rgba(0,0,0,0.6)] text-xs">-</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
