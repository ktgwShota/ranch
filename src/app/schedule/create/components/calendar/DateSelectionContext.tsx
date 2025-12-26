'use client';

import { createContext, useContext } from 'react';
import type { Dayjs } from '@/lib/dayjs';

interface DateSelectionContextValue {
  isDateSelected: (day: Dayjs) => boolean;
  lastSelectedDates: Dayjs[];
  isPastDate: (day: Dayjs) => boolean;
  handleDateClick: (day: Dayjs) => void;
  defaultTime: string | null;
  addTimeToDate: (day: Dayjs, time: string) => void;
}

const DateSelectionContext = createContext<DateSelectionContextValue | null>(null);

export const DateSelectionProvider = DateSelectionContext.Provider;

export const useDateSelectionContext = () => {
  const context = useContext(DateSelectionContext);
  if (!context) {
    throw new Error('useDateSelectionContext must be used within a DateSelectionProvider');
  }
  return context;
};
