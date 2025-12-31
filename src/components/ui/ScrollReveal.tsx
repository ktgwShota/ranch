'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type AnimationMode = 'fade' | 'slide' | 'zoom' | 'pop';
type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollRevealProps {
  children: ReactNode;
  mode?: AnimationMode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  width?: string;
  distance?: number; // スライド距離
  viewportAmount?: number | 'some' | 'all'; // ビューポート検知の割合
  style?: React.CSSProperties;
  scale?: number; // 初期スケール
}

export default function ScrollReveal({
  children,
  mode = 'fade',
  direction = 'up',
  delay = 0,
  duration = 1,
  className = '',
  width = '100%',
  distance = 50,
  viewportAmount = 0.5,
  style,
  scale,
}: ScrollRevealProps) {
  const getVariants = (): Variants => {
    // ... existing implementation
    const slideOffset = {
      up: { y: distance, x: 0 },
      down: { y: -distance, x: 0 },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
      none: { x: 0, y: 0 },
    };

    switch (mode) {
      case 'slide':
        return {
          hidden: { opacity: 0, ...slideOffset[direction] },
          visible: { opacity: 1, x: 0, y: 0 },
        };
      case 'zoom':
        return {
          hidden: { opacity: 0, scale: scale ?? 0.8 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'pop':
        return {
          hidden: { opacity: 0, scale: scale ?? 0.5, ...slideOffset[direction] },
          visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            transition: {
              type: 'spring',
              damping: 12,
              stiffness: 100,
              delay: delay, // delayを明示的に渡す
              duration: duration,
            },
          },
        };
      default:
        return {
          hidden: {
            opacity: 0,
            ...(direction === 'up'
              ? { y: 30 }
              : direction === 'down'
                ? { y: -30 }
                : direction === 'left'
                  ? { x: 30 }
                  : direction === 'right'
                    ? { x: -30 }
                    : {}), // noneの場合は移動なし
          },
          visible: { opacity: 1, y: 0, x: 0 },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      variants={getVariants()}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      style={{ width, ...style }}
    >
      {children}
    </motion.div>
  );
}
