'use client';

import { Clock } from 'lucide-react';

import { useEffect, useState } from 'react';
import { InfoLabel } from '@/components/ui/InfoLabel';

interface TimeRemainingProps {
  endDateTime: string | null;
  isClosed: boolean;
}

function formatTime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const mins = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;

  const hoursStr = String(hours).padStart(2, '0');
  const minsStr = String(mins).padStart(2, '0');
  const secsStr = String(secs).padStart(2, '0');

  if (days > 0) {
    return `${days}日${hoursStr}時間${minsStr}分${secsStr}秒`;
  } else if (hours > 0) {
    return `${hoursStr}時間${minsStr}分${secsStr}秒`;
  } else if (mins > 0) {
    return `${minsStr}分${secsStr}秒`;
  } else {
    return `${secsStr}秒`;
  }
}

export default function TimeRemaining({ endDateTime, isClosed }: TimeRemainingProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!endDateTime || isClosed) {
      return;
    }

    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [endDateTime, isClosed]);

  const getTimeRemaining = (): number => {
    if (!endDateTime) return 0;
    const endTime = new Date(endDateTime).getTime();
    const now = Date.now();
    return Math.max(0, Math.ceil((endTime - now) / 1000));
  };

  const hasEndTime = !!endDateTime;
  const timeLabel = hasEndTime ? formatTime(getTimeRemaining()) : '無制限';

  return (
    <InfoLabel
      label="受付時間"
      value={timeLabel}
      icon={<Clock size={16} className="text-slate-500" />}
    />
  );
}
