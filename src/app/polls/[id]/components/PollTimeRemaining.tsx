import { Clock } from 'lucide-react';

import { useEffect, useState } from 'react';
import { InfoLabel } from '@/components/ui/InfoLabel';
import type { ParsedPoll as Poll } from '@/db/core/types';

interface PollTimeRemainingProps {
  poll: Poll;
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

export default function PollTimeRemaining({ poll }: PollTimeRemainingProps) {
  const [, setTick] = useState(0);

  // リアルタイム更新のため、1秒ごとに再レンダリング
  useEffect(() => {
    if (!poll.endDateTime || poll.isClosed) {
      return;
    }

    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [poll]);

  const getTimeRemaining = (): number => {
    if (!poll.endDateTime) return 0;
    const endTime = new Date(poll.endDateTime).getTime();
    const now = Date.now();
    return Math.max(0, Math.ceil((endTime - now) / 1000));
  };

  const hasEndTime = !!poll.endDateTime;
  const timeLabel = hasEndTime ? formatTime(getTimeRemaining()) : '無制限';

  return (
    <InfoLabel
      label="受付時間"
      value={timeLabel}
      icon={<Clock size={16} className="text-slate-500" />}
    />
  );
}
