'use client';

import dayjs from 'dayjs';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/primitives/button';
import { Calendar } from '@/components/primitives/calendar';
import { Input } from '@/components/primitives/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/primitives/popover';
import { cn } from '@/utils/styles';

interface DateTimePickerProps {
  value: dayjs.Dayjs | null;
  onChange: (date: dayjs.Dayjs | null) => void;
  minDateTime?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export function DateTimePicker({
  value,
  onChange,
  minDateTime,
  maxDate,
  label = '日時を選択',
  error,
  helperText,
}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<dayjs.Dayjs | null>(value);

  React.useEffect(() => {
    setSelectedDateTime(value);
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const newDate = dayjs(date);
    const currentTime = selectedDateTime || dayjs();

    // Keep the time from the current selection, or default to current time
    const newDateTime = newDate.hour(currentTime.hour()).minute(currentTime.minute());

    setSelectedDateTime(newDateTime);
    onChange(newDateTime);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value;
    if (!timeStr) return;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const currentDate = selectedDateTime || dayjs();
    const newDateTime = currentDate.hour(hours).minute(minutes);

    setSelectedDateTime(newDateTime);
    onChange(newDateTime);
  };

  // Disable dates before minDateTime (ignoring time for calendar disable)
  const isDateDisabled = (date: Date) => {
    if (maxDate && dayjs(date).isAfter(maxDate, 'day')) return true;
    if (minDateTime && dayjs(date).isBefore(minDateTime, 'day')) return true;
    return false;
  };

  return (
    <div className="relative flex w-full flex-col gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'h-12 w-full justify-start rounded-[2px] border-input bg-[#ffffffcc] text-left font-normal hover:bg-[#ffffffcc]',
              !selectedDateTime && 'text-muted-foreground',
              error && 'border-red-500 focus-visible:ring-red-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDateTime ? selectedDateTime.format('YYYY/MM/DD HH:mm') : <span>{label}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-[2px] p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDateTime?.toDate()}
            onSelect={handleDateSelect}
            initialFocus
            disabled={isDateDisabled}
            classNames={{
              day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-[2px]',
              day_range_start: 'rounded-l-[2px]',
              day_range_end: 'rounded-r-[2px]',
              day_selected:
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-[2px]',
              day_today: 'bg-accent text-accent-foreground rounded-[2px]',
            }}
          />
          <div className="border-border border-t p-3">
            <div className="flex items-center gap-2">
              <Input
                type="time"
                value={selectedDateTime ? selectedDateTime.format('HH:mm') : ''}
                onChange={handleTimeChange}
                className="w-full rounded-[2px]"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {helperText && (
        <p className={cn('text-[0.8rem] text-muted-foreground', error && 'text-red-500')}>
          {helperText}
        </p>
      )}
    </div>
  );
}
