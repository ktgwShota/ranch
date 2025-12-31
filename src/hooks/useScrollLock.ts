import { useEffect } from 'react';

export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock) return;

    // 現在のスタイルを保存
    const _originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;

    // スクロールバーの幅を計算
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    // スクロールをロック
    document.body.style.overflow = 'hidden';

    // PC等でスクロールバーが消えた分のガタつきを防ぐためにpaddingRightを調整
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `calc(${originalPaddingRight} + ${scrollBarWidth}px)`;
    }

    // クリーンアップ
    return () => {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    };
  }, [lock]);
}
