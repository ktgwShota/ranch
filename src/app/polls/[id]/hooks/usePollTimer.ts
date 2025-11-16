import { useState, useEffect } from 'react';
import type { Poll } from '../types';

export function usePollTimer(poll: Poll | null) {
  const [isPollClosed, setIsPollClosed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (poll) {
      if (poll.isClosed) {
        setIsPollClosed(true);
        setTimeRemaining(0);
      } else if (poll.endDateTime) {
        const endTime = new Date(poll.endDateTime).getTime();
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);

        if (remaining <= 0) {
          setIsPollClosed(true);
          setTimeRemaining(0);
        } else {
          setIsPollClosed(false);
          setTimeRemaining(Math.ceil(remaining / 1000));
        }
      } else {
        setIsPollClosed(false);
        setTimeRemaining(null);
      }
    }
  }, [poll]);

  useEffect(() => {
    if (!poll || !poll.endDateTime || isPollClosed) {
      return;
    }

    const endTime = new Date(poll.endDateTime).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);

      if (remaining <= 0) {
        setIsPollClosed(true);
        setTimeRemaining(0);
        clearInterval(timer);
      } else {
        setTimeRemaining(Math.ceil(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [poll, isPollClosed]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}日${hours}時間${mins}分`;
    } else if (hours > 0) {
      return `${hours}時間${mins}分`;
    } else if (mins > 0) {
      return `${mins}分${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  };

  return { isPollClosed, timeRemaining, formatTime };
}

