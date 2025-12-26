import { useState, useCallback, useRef } from 'react';
import dayjs, { type Dayjs } from '@/lib/dayjs';
import { type SelectedDate, type TimeValue, LONG_PRESS_DURATION, DOUBLE_CLICK_DELAY, formatTime } from '../types';

export function useDateSelection() {
  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([]);
  const [currentEditingDate, setCurrentEditingDate] = useState<Dayjs | null>(null);
  const [timeValue, setTimeValue] = useState<TimeValue>({ hour: '19', minute: '00' });
  const [lastSelectedDates, setLastSelectedDates] = useState<Dayjs[]>([]);

  // Refs
  const lastClickRef = useRef<{ date: string; time: number } | null>(null);

  // 単一日付を選択
  const selectDate = useCallback((date: Dayjs) => {
    const normalizedDate = date.startOf('day');
    const exists = selectedDates.some(
      d => d.date.format('YYYY-MM-DD') === normalizedDate.format('YYYY-MM-DD')
    );

    if (exists) {
      setLastSelectedDates([normalizedDate]);
    } else {
      setLastSelectedDates([normalizedDate]);
      setSelectedDates(prev => [...prev, { date: normalizedDate, times: [] }]);
    }
  }, [selectedDates]);

  // 単一日付を削除
  const deselectDate = useCallback((date: Dayjs) => {
    const normalizedDate = date.startOf('day');
    setLastSelectedDates([]);
    setSelectedDates(prev =>
      prev.filter(d => d.date.format('YYYY-MM-DD') !== normalizedDate.format('YYYY-MM-DD'))
    );
  }, []);

  // クリックハンドラー (以前のMouseUp/Down等の統合)
  const handleDateClick = useCallback((date: Dayjs) => {
    const dateKey = date.format('YYYY-MM-DD');
    const now = Date.now();

    if (
      lastClickRef.current &&
      lastClickRef.current.date === dateKey &&
      now - lastClickRef.current.time < DOUBLE_CLICK_DELAY
    ) {
      // ダブルクリックで削除
      deselectDate(date);
      lastClickRef.current = null;
    } else {
      // シングルクリックで選択
      selectDate(date);
      setCurrentEditingDate(date);
      lastClickRef.current = { date: dateKey, time: now };
    }
  }, [selectDate, deselectDate]);

  // 日付を削除
  const handleRemoveDate = useCallback((dateIndex: number) => {
    setSelectedDates(prev => {
      const updated = [...prev];
      updated.splice(dateIndex, 1);
      return updated;
    });
  }, []);

  // 時間を追加
  const handleAddTime = useCallback(() => {
    const time = formatTime(timeValue.hour, timeValue.minute);
    let targetDates: Dayjs[] = [];
    if (lastSelectedDates.length > 0) {
      targetDates = lastSelectedDates;
    } else if (currentEditingDate) {
      targetDates = [currentEditingDate];
    }

    if (targetDates.length === 0) return;

    setSelectedDates(prev => {
      const updatedDates = [...prev];
      for (const targetDate of targetDates) {
        const dateKey = targetDate.format('YYYY-MM-DD');
        const existingDateIndex = updatedDates.findIndex(
          d => d.date.format('YYYY-MM-DD') === dateKey
        );

        if (existingDateIndex >= 0) {
          if (!updatedDates[existingDateIndex].times.includes(time)) {
            updatedDates[existingDateIndex].times.push(time);
            updatedDates[existingDateIndex].times.sort();
          }
        } else {
          updatedDates.push({ date: targetDate, times: [time] });
        }
      }
      return updatedDates;
    });
  }, [timeValue, lastSelectedDates, currentEditingDate]);

  // 時間を削除
  const handleRemoveTime = useCallback((dateIndex: number, timeIndex: number) => {
    setSelectedDates(prev => {
      const updated = [...prev];
      updated[dateIndex].times.splice(timeIndex, 1);
      return updated;
    });
  }, []);

  // 複数の日付をトグル選択（すべて選択済みなら解除、そうでなければ追加）
  const toggleDates = useCallback((dates: Dayjs[]) => {
    if (dates.length === 0) return;

    // すべての日付が選択済みかチェック
    const allSelected = dates.every(date =>
      selectedDates.some(d => d.date.format('YYYY-MM-DD') === date.format('YYYY-MM-DD'))
    );

    if (allSelected) {
      // 選択解除
      setLastSelectedDates([]);
      setSelectedDates(prev =>
        prev.filter(d =>
          !dates.some(target => target.format('YYYY-MM-DD') === d.date.format('YYYY-MM-DD'))
        )
      );
    } else {
      // 追加
      setLastSelectedDates(dates);
      setSelectedDates(prev => {
        const newSelectedDates = [...prev];
        for (const date of dates) {
          const exists = newSelectedDates.some(
            d => d.date.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
          );
          if (!exists) {
            newSelectedDates.push({ date, times: [] });
          }
        }
        return newSelectedDates;
      });
    }
  }, [selectedDates]);

  // 指定範囲の平日を取得
  const getWeekdaysInRange = useCallback((start: Dayjs, end: Dayjs) => {
    const dates: Dayjs[] = [];
    let current = (start.isBefore(end) ? start : end).startOf('day');
    const last = (start.isBefore(end) ? end : start).startOf('day');
    const todayStart = dayjs().startOf('day');

    while (current.isBefore(last) || current.isSame(last, 'day')) {
      const dayOfWeek = current.day();
      if (dayOfWeek >= 1 && dayOfWeek <= 5 && !current.isBefore(todayStart)) {
        dates.push(current);
      }
      current = current.add(1, 'day');
    }
    return dates;
  }, []);

  // クイック選択: 今週（平日）
  const selectThisWeekWeekdays = useCallback(() => {
    const today = dayjs().startOf('day');
    const endOfWeek = today.endOf('week').startOf('day');
    const dates = getWeekdaysInRange(today, endOfWeek);
    toggleDates(dates);
  }, [getWeekdaysInRange, toggleDates]);

  // クイック選択: 来週（平日）
  const selectNextWeekWeekdays = useCallback(() => {
    const nextWeekStart = dayjs().add(1, 'week').startOf('week').startOf('day');
    const nextWeekEnd = nextWeekStart.endOf('week').startOf('day');
    const dates = getWeekdaysInRange(nextWeekStart, nextWeekEnd);
    toggleDates(dates);
  }, [getWeekdaysInRange, toggleDates]);

  // クイック選択: 今週末
  const selectThisWeekend = useCallback(() => {
    const today = dayjs().startOf('day');
    const todayStart = dayjs().startOf('day');
    const saturday = today.day(6).startOf('day');
    const sunday = today.day(7).startOf('day');

    const dates: Dayjs[] = [];
    if (!saturday.isBefore(todayStart)) dates.push(saturday);
    if (!sunday.isBefore(todayStart)) dates.push(sunday);

    toggleDates(dates);
  }, [toggleDates]);

  // クイック選択: 来週末
  const selectNextWeekend = useCallback(() => {
    const nextWeek = dayjs().add(1, 'week').startOf('day');
    const saturday = nextWeek.day(6).startOf('day');
    const sunday = nextWeek.day(7).startOf('day');

    const dates = [saturday, sunday];
    toggleDates(dates);
  }, [toggleDates]);

  // リセット
  const resetSelection = useCallback(() => {
    setSelectedDates([]);
    setLastSelectedDates([]);
  }, []);

  // ヘルパー関数
  const isDateSelected = useCallback((date: Dayjs) => {
    return selectedDates.some(
      d => d.date.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  }, [selectedDates]);

  const getConsecutiveRangePosition = useCallback((date: Dayjs): 'start' | 'middle' | 'end' | 'single' | null => {
    if (!isDateSelected(date)) return null;

    const yesterday = date.subtract(1, 'day');
    const tomorrow = date.add(1, 'day');
    const hasPrev = isDateSelected(yesterday);
    const hasNext = isDateSelected(tomorrow);

    if (hasPrev && hasNext) return 'middle';
    if (!hasPrev && hasNext) return 'start';
    if (hasPrev && !hasNext) return 'end';
    return 'single';
  }, [isDateSelected]);

  const isPastDate = useCallback((date: Dayjs) => {
    return date.isBefore(dayjs(), 'day');
  }, []);

  return {
    // State
    selectedDates,
    setSelectedDates,
    currentEditingDate,
    setCurrentEditingDate,
    timeValue,
    setTimeValue,
    lastSelectedDates,
    setLastSelectedDates,

    // Handlers
    handleDateClick,
    handleRemoveDate,
    handleAddTime,
    handleRemoveTime,

    // Quick selectors
    selectThisWeekWeekdays,
    selectNextWeekWeekdays,
    selectThisWeekend,
    selectNextWeekend,
    resetSelection,

    // Helpers
    isDateSelected,
    getConsecutiveRangePosition,
    isPastDate,
  };
}

