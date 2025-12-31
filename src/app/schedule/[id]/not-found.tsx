'use client';
import Link from 'next/link';
import { Button } from '@/components/primitives/button';
// import { LAYOUT_CONSTANTS } from '@/config/constants';

export default function NotFound() {
  return (
    <div
      className="mx-auto flex min-h-[50vh] flex-col items-center justify-center px-8 py-16 text-center sm:px-12 sm:py-24"
      style={{
        maxWidth: 'var(--max-w-content)',
      }}
    >
      <h5 className="mb-8 font-bold">スケジュールが見つかりません</h5>
      <p className="mb-12 text-[rgba(0,0,0,0.6)]">
        お探しの日程調整は存在しないか、削除された可能性があります。
      </p>
      <Link href="/" legacyBehavior passHref>
        <Button variant="default">トップページへ戻る</Button>
      </Link>
    </div>
  );
}
