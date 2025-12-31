import type { ReactNode } from 'react';

interface PageLayoutProps {
  /**
   * ページ上部の通知バナー（任意）
   */
  banner?: ReactNode;
  /**
   * ページ上部のヘッダーコンテンツ（PageHeaderなどを想定）
   */
  header: ReactNode;
  /**
   * メインコンテンツ
   */
  contents: ReactNode;
  /**
   * ページ内で使用するモーダル/ダイアログ（任意）
   */
  modals?: ReactNode;
}

/**
 * 詳細ページ（投票画面、日程調整画面など）の共通レイアウト
 * ヘッダーとメインコンテンツの配置、間隔を統一的に管理する
 */
export function PageLayout({ banner, header, contents, modals }: PageLayoutProps) {
  return (
    <div className="flex w-full flex-col">
      {/* 通知バナーエリア */}
      {banner && <div className="w-full">{banner}</div>}

      {/* ヘッダーエリア */}
      <div className="w-full">{header}</div>

      {/* コンテンツエリア */}
      <div className="w-full">{contents}</div>

      {/* モーダルエリア */}
      {modals}
    </div>
  );
}
