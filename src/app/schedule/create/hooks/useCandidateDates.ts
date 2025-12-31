import { useCallback, useMemo, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ScheduleFormData } from '@/db/validation/types';
import dayjs, { type Dayjs } from '@/lib/dayjs';
import { DOUBLE_CLICK_DELAY } from '../types';

export function useCandidateDates() {
  const { setValue, getValues, control } = useFormContext<ScheduleFormData>();
  const selectedDates = useWatch({ control, name: 'dates' }) || [];

  // Use the last element of the array as the "last selected" (active) date.
  // This avoids the need for external stores or prop drilling.
  const lastSelectedDates =
    selectedDates.length > 0 ? [dayjs(selectedDates[selectedDates.length - 1].date)] : [];

  const lastClickRef = useRef<{ date: string; time: number } | null>(null);

  const isDateSelected = useCallback(
    (date: Dayjs) => {
      const dateStr = date.format('YYYY-MM-DD');
      return selectedDates.some((d) => d.date === dateStr);
    },
    [selectedDates]
  );

  const selectDate = useCallback(
    (date: Dayjs, defaultTime: string | null) => {
      const dateStr = date.format('YYYY-MM-DD');
      const currentIndex = selectedDates.findIndex((d) => d.date === dateStr);

      if (currentIndex === -1) {
        const newDates = [
          ...selectedDates,
          { date: dateStr, times: defaultTime ? [defaultTime] : [] },
        ];
        setValue('dates', newDates, { shouldValidate: true });
      } else {
        if (currentIndex !== selectedDates.length - 1) {
          const newDates = [...selectedDates];
          const [movedItem] = newDates.splice(currentIndex, 1);
          newDates.push(movedItem);
          setValue('dates', newDates, { shouldValidate: false });
        }
      }
    },
    [selectedDates, setValue]
  );

  const deselectDate = useCallback(
    (date: Dayjs) => {
      const dateStr = date.format('YYYY-MM-DD');
      setValue(
        'dates',
        selectedDates.filter((d) => d.date !== dateStr),
        { shouldValidate: true }
      );
    },
    [selectedDates, setValue]
  );

  const handleDateClick = useCallback(
    (date: Dayjs, defaultTime: string | null) => {
      const dateKey = date.format('YYYY-MM-DD');
      const now = Date.now();

      if (
        lastClickRef.current &&
        lastClickRef.current.date === dateKey &&
        now - lastClickRef.current.time < DOUBLE_CLICK_DELAY
      ) {
        deselectDate(date);
        lastClickRef.current = null;
      } else {
        selectDate(date, defaultTime);
        lastClickRef.current = { date: dateKey, time: now };
      }
    },
    [selectDate, deselectDate]
  );

  const removeDate = useCallback(
    (dateKey: string) => {
      const currentDates = getValues('dates');
      setValue(
        'dates',
        currentDates.filter((d) => d.date !== dateKey),
        { shouldValidate: true }
      );
    },
    [getValues, setValue]
  );

  const setLastSelectedDates = useCallback(
    (dates: Dayjs[]) => {
      if (dates.length === 0) return;

      // NOTE: 現在の仕様では複数日選択時の setLastSelectedDates は想定されていないため
      const targetDate = dates[0];
      const dateStr = targetDate.format('YYYY-MM-DD');

      const currentDates = getValues('dates');
      const currentIndex = currentDates.findIndex((d) => d.date === dateStr);

      if (currentIndex !== -1 && currentIndex !== currentDates.length - 1) {
        const newDates = [...currentDates];
        const [movedItem] = newDates.splice(currentIndex, 1);
        newDates.push(movedItem);
        setValue('dates', newDates, { shouldValidate: false });
      }
    },
    [getValues, setValue]
  );

  const sortedSelectedDates = useMemo(() => {
    return selectedDates.slice().sort((a, b: { date: string }) => a.date.localeCompare(b.date));
  }, [selectedDates]);

  const currentIndex =
    lastSelectedDates.length > 0
      ? sortedSelectedDates.findIndex((d) => d.date === lastSelectedDates[0].format('YYYY-MM-DD'))
      : -1;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex !== -1 && currentIndex < sortedSelectedDates.length - 1;

  const selectPrevDate = useCallback(() => {
    if (canGoPrev) {
      setLastSelectedDates([dayjs(sortedSelectedDates[currentIndex - 1].date)]);
    }
  }, [canGoPrev, currentIndex, sortedSelectedDates, setLastSelectedDates]);

  const selectNextDate = useCallback(() => {
    if (canGoNext) {
      setLastSelectedDates([dayjs(sortedSelectedDates[currentIndex + 1].date)]);
    }
  }, [canGoNext, currentIndex, sortedSelectedDates, setLastSelectedDates]);

  return {
    selectedDates,
    lastSelectedDates,
    setLastSelectedDates,
    isDateSelected,
    handleDateClick,
    removeDate,
    selectPrevDate,
    selectNextDate,
    canGoPrev,
    canGoNext,
  };
}
