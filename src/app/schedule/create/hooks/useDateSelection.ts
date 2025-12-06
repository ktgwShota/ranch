import { useState, useCallback, useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { SelectedDate, TimeValue, LONG_PRESS_DURATION, DOUBLE_CLICK_DELAY, formatTime } from '../types';

export function useDateSelection() {
  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([]);
  const [currentEditingDate, setCurrentEditingDate] = useState<Dayjs>(dayjs());
  const [timeValue, setTimeValue] = useState<TimeValue>({ hour: '19', minute: '00' });
  const [lastSelectedDates, setLastSelectedDates] = useState<Dayjs[]>([]);

  // 範囲選択用の状態
  const [isRangeSelecting, setIsRangeSelecting] = useState(false);
  const [rangeStart, setRangeStart] = useState<Dayjs | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Dayjs | null>(null);

  // Refs
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pressedDateRef = useRef<Dayjs | null>(null);
  const lastClickRef = useRef<{ date: string; time: number } | null>(null);

  // 日付の範囲を追加
  const addDateRange = useCallback((start: Dayjs, end: Dayjs) => {
    const dates: Dayjs[] = [];
    let current = (start.isBefore(end) ? start : end).startOf('day');
    const last = (start.isBefore(end) ? end : start).startOf('day');
    const todayStart = dayjs().startOf('day');

    while (current.isBefore(last) || current.isSame(last, 'day')) {
      if (!current.isBefore(todayStart)) {
        dates.push(current);
      }
      current = current.add(1, 'day');
    }

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
  }, []);

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

  // マウスダウン
  const handleDateMouseDown = useCallback((date: Dayjs) => {
    pressedDateRef.current = date;
    longPressTimerRef.current = setTimeout(() => {
      setIsRangeSelecting(true);
      setRangeStart(date);
      setHoveredDate(date);
    }, LONG_PRESS_DURATION);
  }, []);

  // マウスアップ
  const handleDateMouseUp = useCallback((date: Dayjs) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (isRangeSelecting && rangeStart) {
      addDateRange(rangeStart, date);
      setIsRangeSelecting(false);
      setRangeStart(null);
      setHoveredDate(null);
      lastClickRef.current = null;
    } else if (
      pressedDateRef.current &&
      pressedDateRef.current.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    ) {
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
        selectDate(date);
        setCurrentEditingDate(date);
        lastClickRef.current = { date: dateKey, time: now };
      }
    }

    pressedDateRef.current = null;
  }, [isRangeSelecting, rangeStart, addDateRange, selectDate, deselectDate]);

  // マウスリーブ
  const handleDateMouseLeave = useCallback(() => {
    if (longPressTimerRef.current && !isRangeSelecting) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, [isRangeSelecting]);

  // ホバー
  const handleDateHover = useCallback((date: Dayjs) => {
    if (isRangeSelecting) {
      setHoveredDate(date);
    }
  }, [isRangeSelecting]);

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
    const targetDates = lastSelectedDates.length > 0 ? lastSelectedDates : [currentEditingDate];

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

  // 平日のみを追加
  const addWeekdaysInRange = useCallback((start: Dayjs, end: Dayjs) => {
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

    if (dates.length > 0) {
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
  }, []);

  // クイック選択: 今週（平日）
  const selectThisWeekWeekdays = useCallback(() => {
    const today = dayjs().startOf('day');
    const endOfWeek = today.endOf('week').startOf('day');
    addWeekdaysInRange(today, endOfWeek);
  }, [addWeekdaysInRange]);

  // クイック選択: 来週（平日）
  const selectNextWeekWeekdays = useCallback(() => {
    const nextWeekStart = dayjs().add(1, 'week').startOf('week').startOf('day');
    const nextWeekEnd = nextWeekStart.endOf('week').startOf('day');
    addWeekdaysInRange(nextWeekStart, nextWeekEnd);
  }, [addWeekdaysInRange]);

  // クイック選択: 今週末
  const selectThisWeekend = useCallback(() => {
    const today = dayjs().startOf('day');
    const todayStart = dayjs().startOf('day');
    const saturday = today.day(6).startOf('day');
    const sunday = today.day(7).startOf('day');

    const dates: Dayjs[] = [];
    if (!saturday.isBefore(todayStart)) dates.push(saturday);
    if (!sunday.isBefore(todayStart)) dates.push(sunday);

    if (dates.length > 0) {
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
  }, []);

  // クイック選択: 来週末
  const selectNextWeekend = useCallback(() => {
    const nextWeek = dayjs().add(1, 'week').startOf('day');
    const saturday = nextWeek.day(6).startOf('day');
    const sunday = nextWeek.day(7).startOf('day');

    const dates = [saturday, sunday];
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
  }, []);

  // リセット
  const resetSelection = useCallback(() => {
    setSelectedDates([]);
    setLastSelectedDates([]);
    setIsRangeSelecting(false);
    setRangeStart(null);
    setHoveredDate(null);
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

  const isInPreviewRange = useCallback((date: Dayjs) => {
    if (!isRangeSelecting || !rangeStart || !hoveredDate) return false;
    const start = rangeStart.isBefore(hoveredDate) ? rangeStart : hoveredDate;
    const end = rangeStart.isBefore(hoveredDate) ? hoveredDate : rangeStart;
    return (date.isAfter(start) || date.isSame(start, 'day')) &&
      (date.isBefore(end) || date.isSame(end, 'day'));
  }, [isRangeSelecting, rangeStart, hoveredDate]);

  const isRangeStartDate = useCallback((date: Dayjs) => {
    if (!isRangeSelecting || !rangeStart || !hoveredDate) return false;
    const start = rangeStart.isBefore(hoveredDate) ? rangeStart : hoveredDate;
    return date.isSame(start, 'day');
  }, [isRangeSelecting, rangeStart, hoveredDate]);

  const isRangeEndDate = useCallback((date: Dayjs) => {
    if (!isRangeSelecting || !rangeStart || !hoveredDate) return false;
    const end = rangeStart.isBefore(hoveredDate) ? hoveredDate : rangeStart;
    return date.isSame(end, 'day');
  }, [isRangeSelecting, rangeStart, hoveredDate]);

  const isPastDate = useCallback((date: Dayjs) => {
    return date.isBefore(dayjs(), 'day');
  }, []);

  return {
    // State
    selectedDates,
    setSelectedDates,
    currentEditingDate,
    timeValue,
    setTimeValue,
    lastSelectedDates,
    setLastSelectedDates,
    isRangeSelecting,

    // Handlers
    handleDateMouseDown,
    handleDateMouseUp,
    handleDateMouseLeave,
    handleDateHover,
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
    isInPreviewRange,
    isRangeStartDate,
    isRangeEndDate,
    isPastDate,
  };
}

