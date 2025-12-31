'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/primitives/button';
import { Separator } from '@/components/primitives/separator';
import { Slider } from '@/components/primitives/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/primitives/tooltip';
import { FormattedDate } from '@/components/ui/FormattedDate';
import { cn } from '@/utils/styles';
import { getResponsiveValue } from '@/utils/styles';
import { useCandidateDates } from '../../../hooks/useCandidateDates';
import { useCandidateTimes } from '../../../hooks/useCandidateTimes';

// Constants
const MAX_TIME_IN_MINUTES = 1425; // 23:45
const TIME_STEP = 15;
const QUICK_TIME_PRESETS = [
  { hour: '00', minute: '00' },
  { hour: '06', minute: '00' },
  { hour: '12', minute: '00' },
  { hour: '18', minute: '00' },
  { hour: '23', minute: '45' },
] as const;

// Utility functions
const minutesToTime = (totalMinutes: number): { hour: string; minute: string } => {
  const hour = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minute = (totalMinutes % 60).toString().padStart(2, '0');
  return { hour, minute };
};

const timeToMinutes = (hour: string, minute: string): number => {
  return parseInt(hour, 10) * 60 + parseInt(minute, 10);
};

const getTimeOfDay = (hour: number): 'NIGHT' | 'MORNING' | 'AFTERNOON' | 'EVENING' => {
  if (hour < 5) return 'NIGHT';
  if (hour < 12) return 'MORNING';
  if (hour < 17) return 'AFTERNOON';
  return 'EVENING';
};

// Components
interface DateNavigationProps {
  lastSelectedDates: ReturnType<typeof useCandidateDates>['lastSelectedDates'];
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

function DateNavigation({
  lastSelectedDates,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}: DateNavigationProps) {
  return (
    <div className="relative flex shrink-0 items-center justify-center px-3 pb-6 font-semibold text-[13px]">
      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="rounded-full p-1 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-2 text-center font-bold"
          style={{ fontSize: getResponsiveValue(14, 15) }}
        >
          {lastSelectedDates.length > 0 ? (
            lastSelectedDates.length > 1 ? (
              <>
                <FormattedDate date={lastSelectedDates[0]} />
                {' ~ '}
                <FormattedDate date={lastSelectedDates[lastSelectedDates.length - 1]} />
              </>
            ) : (
              <FormattedDate date={lastSelectedDates[0]} />
            )
          ) : (
            <span style={{ fontSize: getResponsiveValue(13, 14) }}>-</span>
          )}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="rounded-full p-1 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

interface TimeDisplayProps {
  hour: string;
  minute: string;
}

function TimeDisplay({ hour, minute }: TimeDisplayProps) {
  const hourNum = parseInt(hour, 10);
  const timeOfDay = getTimeOfDay(hourNum);

  return (
    <div className="text-center">
      <div
        className="font-bold text-slate-900 tracking-tighter"
        style={{ fontSize: getResponsiveValue(32, 44) }}
      >
        {hour}:{minute}
      </div>
      <div
        className="font-semibold text-[#FF453A] uppercase tracking-widest"
        style={{ fontSize: getResponsiveValue(10, 12) }}
      >
        {timeOfDay}
      </div>
    </div>
  );
}

interface QuickTimePresetsProps {
  onTimeSelect: (hour: string, minute: string) => void;
}

function QuickTimePresets({ onTimeSelect }: QuickTimePresetsProps) {
  return (
    <div className="flex justify-between px-1 font-medium text-slate-400">
      {QUICK_TIME_PRESETS.map((preset) => (
        <span
          key={`${preset.hour}:${preset.minute}`}
          onClick={() => {
            onTimeSelect(preset.hour, preset.minute);
          }}
          className="cursor-pointer transition-colors hover:text-slate-600"
          style={{ fontSize: getResponsiveValue(10, 12) }}
        >
          {preset.hour}:{preset.minute}
        </span>
      ))}
    </div>
  );
}

interface TimeSliderControlProps {
  hour: string;
  minute: string;
  onTimeChange: (hour: string, minute: string) => void;
}

function TimeSliderControl({
  hour,
  minute,
  onTimeChange,
}: TimeSliderControlProps) {
  const currentMinutes = timeToMinutes(hour, minute);

  const handleDecrement = () => {
    if (currentMinutes <= 0) return;
    const newMinutes = Math.max(0, currentMinutes - TIME_STEP);
    const { hour, minute } = minutesToTime(newMinutes);
    onTimeChange(hour, minute);
  };

  const handleIncrement = () => {
    if (currentMinutes >= MAX_TIME_IN_MINUTES) return;
    const newMinutes = Math.min(MAX_TIME_IN_MINUTES, currentMinutes + TIME_STEP);
    const { hour, minute } = minutesToTime(newMinutes);
    onTimeChange(hour, minute);
  };

  const handleSliderChange = (values: number[]) => {
    const total = values[0];
    const { hour, minute } = minutesToTime(total);
    onTimeChange(hour, minute);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={currentMinutes <= 0}
        className="rounded-full p-1 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft size={20} />
      </button>
      <Slider
        value={[currentMinutes]}
        max={MAX_TIME_IN_MINUTES}
        step={TIME_STEP}
        onValueChange={handleSliderChange}
        className="flex-1 cursor-pointer"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={currentMinutes >= MAX_TIME_IN_MINUTES}
        className="rounded-full p-1 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

interface AddTimeButtonProps {
  isTargetAdded: boolean;
  onToggle: () => void;
}

function AddTimeButton({ isTargetAdded, onToggle }: AddTimeButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onToggle}
      className={cn(
        'h-14 w-full rounded-none border',
        isTargetAdded
          ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
          : 'text-blue-500 hover:bg-blue-50 hover:text-blue-600'
      )}
      style={{ fontSize: getResponsiveValue(13, 14) }}
    >
      {isTargetAdded ? '時間を削除' : '時間を追加'}
    </Button>
  );
}

// Main component
type TimeSelectorProps = Record<string, never>;

export default function TimeSelector(_props: TimeSelectorProps) {
  const {
    selectedDates,
    lastSelectedDates,
    selectPrevDate,
    selectNextDate,
    canGoPrev,
    canGoNext,
  } = useCandidateDates();

  const { getAddedTimes, toggleTime: handleTimeClickBase } = useCandidateTimes();

  const [selectedHour, setSelectedHour] = useState('19');
  const [selectedMinute, setSelectedMinute] = useState('00');

  const addedTimes = useMemo(() => {
    return getAddedTimes(lastSelectedDates, selectedDates);
  }, [lastSelectedDates, selectedDates, getAddedTimes]);

  const handleTimeSelect = (hour: string, minute: string) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
  };

  const handleTimeChange = (hour: string, minute: string) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
  };

  const targetTime = `${selectedHour}:${selectedMinute}`;
  const isTargetAdded = addedTimes.has(targetTime);

  const handleToggleTime = () => {
    handleTimeClickBase(targetTime, lastSelectedDates, addedTimes);
  };

  const isDisabled = lastSelectedDates.length === 0;

  const content = (
    <div
      className={cn(
        'ease relative h-full w-full rounded-[2px] border border-border bg-white transition-opacity duration-200',
        isDisabled && 'cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'flex h-full flex-col overflow-hidden',
          isDisabled && 'pointer-events-none opacity-40'
        )}
        style={{ padding: getResponsiveValue(20, 24) }}
      >
        <DateNavigation
          lastSelectedDates={lastSelectedDates}
          onPrev={selectPrevDate}
          onNext={selectNextDate}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
        />

        <Separator />

        <div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden p-6">
          <TimeDisplay hour={selectedHour} minute={selectedMinute} />

          <div className="w-full space-y-6 pt-4">
            <QuickTimePresets onTimeSelect={handleTimeSelect} />
            <TimeSliderControl
              hour={selectedHour}
              minute={selectedMinute}
              onTimeChange={handleTimeChange}
            />
          </div>
        </div>

        <Separator className="mb-6" />

        <AddTimeButton isTargetAdded={isTargetAdded} onToggle={handleToggleTime} />
      </div>
    </div>
  );

  if (isDisabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent className="rounded-[2px] p-3 bg-gray-800 text-white [&_svg]:fill-gray-800">
          日付を選択すると利用可能になります
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
