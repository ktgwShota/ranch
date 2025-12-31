import { useMemo } from 'react';
import dayjs from '@/lib/dayjs';
import {
  calculateScore,
  calculateSummary,
  type DateTimeItem,
  getDateTimeKey,
  type Response,
} from '../types';

interface DateOption {
  date: string;
  times: string[];
}

interface UseScheduleDataProps {
  dates: DateOption[];
  responses: Response[];
}

export function useScheduleData({ dates, responses }: UseScheduleDataProps) {
  // 全日程をフラット化
  const allDateTimes: DateTimeItem[] = useMemo(() => {
    const result: DateTimeItem[] = [];
    for (const dateOption of dates) {
      const date = dayjs(dateOption.date);
      if (dateOption.times.length > 0) {
        for (const time of dateOption.times) {
          result.push({ date, time, key: getDateTimeKey(date, time) });
        }
      } else {
        result.push({ date, key: getDateTimeKey(date) });
      }
    }
    return result;
  }, [dates]);

  // Best日程を計算
  const bestKeys = useMemo(() => {
    if (responses.length === 0) return new Set<string>();
    const scores = allDateTimes.map(({ key }) => {
      const summary = calculateSummary(key, responses);
      return { key, score: calculateScore(summary.available, summary.maybe) };
    });
    const maxScore = Math.max(...scores.map((s) => s.score));
    return new Set(scores.filter((s) => s.score === maxScore && s.score > 0).map((s) => s.key));
  }, [allDateTimes, responses]);

  return {
    allDateTimes,
    bestKeys,
  };
}
