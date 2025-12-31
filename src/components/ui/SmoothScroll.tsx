'use client';

import Lenis from 'lenis';
import { type ReactNode, useEffect } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Lenisの初期化
    const lenis = new Lenis({
      duration: 0.5, // スクロールの長さ（秒）。Devinのようなゆったり感
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), // 指数関数的な滑らかさ
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // アニメーションフレーム毎にスクロールを更新
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
