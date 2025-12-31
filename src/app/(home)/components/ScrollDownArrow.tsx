'use client';

import { ChevronDown } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useCallback } from 'react';

type ScrollDownArrowProps = {
  targetId: string;
  sx?: CSSProperties;
  color?: string;
};

export default function ScrollDownArrow({
  targetId,
  sx = {},
  color = '#64748b',
}: ScrollDownArrowProps) {
  const handleClick = useCallback(() => {
    const nextSection = document.getElementById(targetId);
    if (nextSection) {
      const windowHeight = window.innerHeight;
      const elementHeight = nextSection.getBoundingClientRect().height;

      if (elementHeight <= windowHeight) {
        // 要素が画面内に収まる場合は下端に合わせる（bottom0）
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } else {
        // 要素が画面内に収まらない場合は上端に合わせる（top0）
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [targetId]);

  return (
    <div onClick={handleClick} className="z-10 flex cursor-pointer justify-center" style={sx}>
      <div className="animate-bounce">
        <ChevronDown size={40} style={{ color: color, opacity: 0.8 }} />
      </div>
    </div>
  );
}
