'use client';

import { Progress } from '@/components/primitives/progress';
import { formatScore } from '../../types';

interface ScoreProgressBarProps {
  score: number;
  total: number;
  fontSize?: string;
  className?: string;
}

export function ScoreProgressBar({
  score,
  total,
  fontSize = '10px',
  className = '',
}: ScoreProgressBarProps) {
  const ratio = total > 0 ? score / total : 0;
  const _isFull = total > 0 && score === total;

  const getStatusColorClass = (ratio: number, total: number) => {
    if (total === 0) return 'text-slate-500';
    if (ratio >= 0.8) return 'text-green-600';
    if (ratio >= 0.5) return 'text-orange-500';
    return 'text-red-500';
  };

  const getIndicatorColorClass = (ratio: number) => {
    if (ratio >= 0.8) return 'bg-green-600';
    if (ratio >= 0.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`relative z-[11] flex w-full flex-col gap-1 ${className}`}>
      <Progress
        value={ratio * 100}
        className="h-1.5 bg-slate-200"
        indicatorClassName={getIndicatorColorClass(ratio)}
      />

      <div
        className={`text-center font-semibold ${getStatusColorClass(ratio, total)}`}
        style={{ fontSize }}
      >
        {total === 0 ? (
          <>
            0<span className="mx-px">/</span>0
          </>
        ) : (
          <>
            {formatScore(score)}
            <span className="mx-px">/</span>
            {total}
          </>
        )}
      </div>
    </div>
  );
}
