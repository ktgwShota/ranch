/**
 * 指定された要素IDの要素にスムーズにスクロールする
 * @param elementId - スクロール先の要素ID
 * @param delay - スクロール実行前の遅延時間（ミリ秒）。デフォルトは100ms
 */
export function scrollToElement(elementId: string, delay: number = 100): void {
  setTimeout(() => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, delay);
}
