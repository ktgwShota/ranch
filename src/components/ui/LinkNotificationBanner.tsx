'use client';

import { Megaphone } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button } from '@/components/primitives/button';

interface LinkNotificationBannerProps {
  /**
   * メインのメッセージ（太字で表示）
   */
  title: ReactNode;
  /**
   * サブメッセージ（補足説明）
   */
  description: ReactNode;
  /**
   * ボタンのラベル
   */
  buttonText: string;
  /**
   * リンク先のURL
   */
  href: string;
  /**
   * カラーバリエーション（デフォルトは orange）
   */
  color?: 'orange' | 'blue';
}

export function LinkNotificationBanner({
  title,
  description,
  buttonText,
  href,
  color = 'orange',
}: LinkNotificationBannerProps) {
  const isOrange = color === 'orange';

  // カラー定義
  const styles = isOrange
    ? {
        bgcolor: '#fff7ed', // orange-50 like
        border: '1px solid #ffedd5', // orange-100 like
        iconColor: '#f97316', // orange-500 like
        buttonBg: '#ea580c', // orange-600 like
        buttonHover: '#c2410c', // orange-700 like
        textColor: '#9a3412', // orange-900 like
      }
    : {
        bgcolor: '#eff6ff', // blue-50
        border: '1px solid #dbeafe', // blue-100
        iconColor: '#3b82f6', // blue-500
        buttonBg: '#2563eb', // blue-600
        buttonHover: '#1d4ed8', // blue-700
        textColor: '#1e3a8a', // blue-900
      };

  return (
    <div
      className="mb-7 flex flex-col items-start gap-6 rounded-[2px] p-6 transition-all sm:flex-row sm:items-center sm:gap-7 sm:p-7"
      style={{
        backgroundColor: styles.bgcolor,
        border: styles.border,
      }}
    >
      <div className="flex flex-1 items-center gap-6">
        <Megaphone size={26} className="shrink-0" style={{ color: styles.iconColor }} />
        <div>
          <div
            className="mb-2 font-bold text-base leading-[1.5]"
            style={{ color: styles.textColor }}
          >
            {title}
          </div>
          <div className="text-sm leading-[1.5] opacity-90" style={{ color: styles.textColor }}>
            {description}
          </div>
        </div>
      </div>

      <Link href={href} legacyBehavior passHref>
        <Button
          variant="default"
          className={`shrink-0 self-stretch whitespace-nowrap rounded-[2px] px-6 py-2 font-bold text-white shadow-none transition-shadow hover:shadow-md sm:self-center ${isOrange ? 'bg-[#ea580c] hover:bg-[#c2410c]' : 'bg-[#2563eb] hover:bg-[#1d4ed8]'}`}
        >
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}
