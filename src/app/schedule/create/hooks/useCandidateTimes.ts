import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { ScheduleFormData } from '@/db/validation/types';
import type { Dayjs } from '@/lib/dayjs';

export function useCandidateTimes() {
  const { getValues, setValue } = useFormContext<ScheduleFormData>();

  /**
   * 選択されている日付（lastSelectedDates）に共通して追加されている時間を取得します。
   * 全ての日付に追加されている時間のみが「追加済み」として扱われます。
   */
  const getAddedTimes = useCallback(
    (targetDates: Dayjs[], currentSelectedDates: ScheduleFormData['dates']) => {
      if (targetDates.length === 0) return new Set<string>();

      const timeSets = targetDates.map((date) => {
        const dateKey = date.format('YYYY-MM-DD');
        const found = currentSelectedDates.find((d) => d.date === dateKey);
        return new Set(found?.times || []);
      });

      if (timeSets.length === 0) return new Set<string>();

      const commonTimes = new Set<string>();
      for (const time of timeSets[0]) {
        if (timeSets.every((set) => set.has(time))) {
          commonTimes.add(time);
        }
      }
      return commonTimes;
    },
    []
  );

  const toggleTime = useCallback(
    (time: string, targetDates: Dayjs[], addedTimes: Set<string>) => {
      if (targetDates.length === 0) return;

      const isAdded = addedTimes.has(time);
      const currentDates = [...getValues('dates')];
      let updated = false;

      for (const targetDate of targetDates) {
        const dateKey = targetDate.format('YYYY-MM-DD');
        const index = currentDates.findIndex((d) => d.date === dateKey);

        if (index >= 0) {
          if (isAdded) {
            currentDates[index] = {
              ...currentDates[index],
              times: currentDates[index].times.filter((t) => t !== time),
            };
            updated = true;
          } else {
            if (!currentDates[index].times.includes(time)) {
              currentDates[index] = {
                ...currentDates[index],
                times: [...currentDates[index].times, time].sort(),
              };
              updated = true;
            }
          }
        }
      }

      if (updated) {
        setValue('dates', currentDates, { shouldValidate: true });
      }
    },
    [getValues, setValue]
  );

  const removeTime = useCallback(
    (dateKey: string, time: string) => {
      const currentDates = getValues('dates');
      const index = currentDates.findIndex((d) => d.date === dateKey);
      if (index === -1) return;

      const updatedDates = [...currentDates];
      updatedDates[index] = {
        ...updatedDates[index],
        times: updatedDates[index].times.filter((t) => t !== time),
      };
      setValue('dates', updatedDates, { shouldValidate: true });
    },
    [getValues, setValue]
  );

  return {
    getAddedTimes,
    toggleTime,
    removeTime,
  };
}
