import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS クラス名をマージするユーティリティ関数
 * @param inputs - マージするクラス名（文字列、配列、オブジェクトなど）
 * @returns マージされたクラス名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a CSS clamp() function ensuring smooth scaling between varied screen widths.
 * Defaults to scaling between 320px and 900px viewports (mobile to tablet/desktop).
 *
 * 画面サイズ（ビューポート幅）に応じて数値を滑らかに変化させる CSS clamp() 関数を生成します。
 * デフォルトでは 320px（スマホ）〜 900px（タブレット/PC）の間でスケーリングします。
 *
 * @param minPx - The value in pixels at the minimum viewport width (最小ビューポート幅での値 px)
 * @param maxPx - The value in pixels at the maximum viewport width (最大ビューポート幅での値 px)
 * @param minWidth - The minimum viewport width in pixels (default: 320) (最小ビューポート幅 px)
 * @param maxWidth - The maximum viewport width in pixels (default: 900) (最大ビューポート幅 px)
 * @returns A CSS clamp() string
 */
export const getResponsiveValue = (
  minPx: number,
  maxPx: number,
  minWidth = 320,
  maxWidth = 900
): string => {
  const rootFontSize = 16; // 1rem = 16px

  const minRem = Number((minPx / rootFontSize).toFixed(3));
  const maxRem = Number((maxPx / rootFontSize).toFixed(3));

  const slope = (maxPx - minPx) / (maxWidth - minWidth);
  // Convert slope to VW units (slope * 100) and round to 3 decimal places
  const slopeVw = Number((slope * 100).toFixed(3));

  const interceptPx = minPx - slope * minWidth;
  const interceptRem = Number((interceptPx / rootFontSize).toFixed(3));

  const sign = interceptRem >= 0 ? '+' : '-';
  const absInterceptRem = Math.abs(interceptRem);

  // Consider swapping min/max if scaling down
  const [lower, upper] = minPx < maxPx ? [minRem, maxRem] : [maxRem, minRem];

  return `clamp(${lower}rem, ${slopeVw}vw ${sign} ${absInterceptRem}rem, ${upper}rem)`;
};
