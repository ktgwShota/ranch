'use client';

import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { CalendarDay, Modifiers } from 'react-day-picker';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/primitives/button';
import { Calendar as ShadcnCalendar } from '@/components/primitives/calendar';
import { FormMessage } from '@/components/primitives/form';
import type { ScheduleFormData } from '@/db/validation/types';
import { isPastDate } from '@/utils/date';
import dayjs, { type Dayjs } from '@/lib/dayjs';
import { cn } from '@/utils/styles';
import { getResponsiveValue } from '@/utils/styles';
import { useCandidateDates } from '../../../hooks/useCandidateDates';
import { AutoTimeSelector } from './AutoTimeSelector';

export default function DateSelector() {
  const {
    formState: { errors },
  } = useFormContext<ScheduleFormData>();
  const { selectedDates, isDateSelected, lastSelectedDates, handleDateClick } = useCandidateDates();

  const [isAutoTimeEnabled, setIsAutoTimeEnabled] = useState(false);
  const [autoTimeValue, setAutoTimeValue] = useState<Dayjs | null>(null);
  const [autoTimeRevision, setAutoTimeRevision] = useState(0);

  const defaultTime = isAutoTimeEnabled
    ? autoTimeValue
      ? autoTimeValue.format('HH:mm')
      : '19:00'
    : null;

  // 初期表示月を現在月にする
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const selectedDatesAsDate = selectedDates.map((d) => dayjs(d.date).toDate());

  const CustomDayButton = useCallback(
    (
      props: {
        day: CalendarDay;
        modifiers: Modifiers;
      } & React.ButtonHTMLAttributes<HTMLButtonElement>
    ) => {
      const { day: calendarDay, modifiers, ...rest } = props;
      const day = dayjs(calendarDay.date);

      const isSelected = isDateSelected(day);
      const isCurrentEditing = lastSelectedDates.some(
        (d: Dayjs) => d.format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
      );

      return (
        <Button
          {...rest}
          type="button"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            handleDateClick(day, defaultTime);
          }}
          className={cn(
            '!rounded-full group relative flex aspect-square h-auto w-full items-center justify-center border-0 p-0 text-[14px] shadow-none transition-all duration-300',
            isCurrentEditing &&
            isSelected &&
            '!border !border-solid !border-orange-400 z-10 bg-orange-50 font-bold text-orange-600',
            !isCurrentEditing &&
            isSelected &&
            '!border !border-solid !border-blue-200 bg-blue-50 font-semibold text-blue-600',
            !isSelected && 'text-slate-700 hover:bg-slate-100',
            isPastDate(day) && 'pointer-events-none cursor-not-allowed opacity-20 grayscale'
          )}
        >
          <time dateTime={day.format('YYYY-MM-DD')} className="relative z-10">
            {day.date()}
          </time>
        </Button>
      );
    },
    [isDateSelected, lastSelectedDates, handleDateClick, defaultTime]
  );

  const handlePrevMonth = () => {
    setCalendarMonth(dayjs(calendarMonth).subtract(1, 'month').toDate());
  };

  const handleNextMonth = () => {
    setCalendarMonth(dayjs(calendarMonth).add(1, 'month').toDate());
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        className="h-full w-full rounded-[2px] border border-border bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        style={{ padding: getResponsiveValue(20, 24) }}
      >
        {/* カスタムヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900 tracking-tight" style={{ fontSize: getResponsiveValue(14, 15) }}>
              {dayjs(calendarMonth).format('YYYY年 M月')}
            </h2>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="h-8 w-8 text-slate-500"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="h-8 w-8 text-slate-500"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <AutoTimeSelector
            isAutoTimeEnabled={isAutoTimeEnabled}
            setIsAutoTimeEnabled={setIsAutoTimeEnabled}
            autoTimeValue={autoTimeValue}
            setAutoTimeValue={setAutoTimeValue}
            revision={autoTimeRevision}
            setRevision={setAutoTimeRevision}
          />
        </div>

        <ShadcnCalendar
          mode="multiple"
          selected={selectedDatesAsDate}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          locale={ja}
          className="pointer-events-auto w-full p-0"
          disabled={(date) => isPastDate(dayjs(date))}
          components={{
            DayButton: CustomDayButton,
          }}
          classNames={{
            root: 'w-full !max-w-none [--cell-size:0px]',
            months: 'w-full !max-w-none',
            month: 'w-full !max-w-none space-y-6',
            month_caption: 'hidden', // カスタムヘッダーを使うため非表示
            nav: 'hidden', // カスタムヘッダーを使うため非表示
            month_grid: 'w-full !max-w-none flex flex-col gap-[1px]',
            weekdays: 'flex w-full mb-4',
            weekday: 'flex-1 text-slate-400 font-medium text-[13px] text-center pb-2',
            weeks: 'w-full flex flex-col gap-[1px]',
            week: 'flex w-full gap-[1px]',
            day: 'flex-1 p-0 relative focus-within:relative focus-within:z-20 aspect-square',
            day_selected: 'bg-blue-600 text-white',
            today: 'bg-slate-50 text-slate-900 !rounded-full',
            outside: 'text-slate-300 opacity-50',
            disabled: 'text-slate-300 opacity-50',
            range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
            hidden: 'invisible',
          }}
        />
      </div>

      {errors.dates && <FormMessage className="rounded-[2px] border border-red-500 p-4" />}
    </div>
  );
}
