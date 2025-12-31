'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function HeroScrollWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 899px)');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Hero Animations (Deep Dive Effect) - Only enabled on desktop
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5], ['0px', '40px']);
  const filter = useTransform(scrollYProgress, [0, 0.8], ['blur(0px)', 'blur(10px)']);

  return (
    <div className="w-full" ref={containerRef}>
      {/* 1. Sticky Hero Container - PC only */}
      <div
        className="z-0"
        style={{
          position: isMobile ? 'relative' : 'sticky',
          top: 0,
          height: isMobile ? 'auto' : '100vh',
          overflow: isMobile ? 'visible' : 'hidden',
        }}
      >
        <motion.div
          style={{
            scale: isMobile ? 1 : scale,
            opacity: isMobile ? 1 : opacity,
            borderRadius: isMobile ? 0 : borderRadius,
            filter: isMobile ? 'none' : filter,
            originX: 0.5,
            originY: 0.5,
            height: '100%',
            width: '100%',
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
