import { Box } from '@mui/material';
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: { xs: 0, sm: 0 }, // Remove gap since components handle their own spacing
      }}
    >
      {/* 通知バナーエリア */}
      {banner && (
        <Box sx={{ width: '100%' }}>
          {banner}
        </Box>
      )}

      {/* ヘッダーエリア */}
      <Box sx={{ width: '100%' }}>
        {header}
      </Box>

      {/* コンテンツエリア */}
      <Box sx={{ width: '100%' }}>
        {contents}
      </Box>

      {/* モーダルエリア */}
      {modals}
    </Box>
  );
}
