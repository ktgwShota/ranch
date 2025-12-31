import type { Dayjs } from 'dayjs';

interface FormattedDateProps {
  date: Dayjs;
}

/**
 * 日付を "M/D" 形式で表示するコンポーネント
 * スラッシュ(/)の前後に微小なスペース(1px)を挿入します
 */
export const FormattedDate = ({ date }: FormattedDateProps) => {
  return (
    <>
      {date.format('M')}
      <span className="mx-[1px]">/</span>
      {date.format('D')}
      <span className="ml-0.5">({date.format('ddd')})</span>
    </>
  );
};
