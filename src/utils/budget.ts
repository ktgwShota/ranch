// 数値をコンマ区切りにフォーマット
export function formatNumber(value: string): string {
  if (!value) return '';
  const numericValue = value.replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  return Number(numericValue).toLocaleString();
}

// コンマ区切りの数値を数値のみに変換
export function parseNumber(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

// 予算表示用フォーマット
export function formatBudgetDisplay(min?: string, max?: string): string {
  if (!min && !max) return '';
  if (min && max) return `${Number(min).toLocaleString()}〜${Number(max).toLocaleString()}円`;
  if (min) return `${Number(min).toLocaleString()}円〜`;
  if (max) return `〜${Number(max).toLocaleString()}円`;
  return '';
}

