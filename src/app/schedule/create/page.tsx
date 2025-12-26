import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import ScheduleCreateClientPage from './components/ScheduleCreateClientPage';

export const metadata: Metadata = {
  // ... (keep existing metadata)
  title: '日程調整（出欠表）の作成',
  description:
    'ChoisuR（チョイスル）では、飲み会やイベントの候補日を簡単に調整できる日程調整機能を利用できます。会員登録・ログイン不要で URL を共有するだけで出欠確認が完了します。',
  alternates: {
    canonical: 'https://choisur.jp/schedule/create',
  },
  openGraph: {
    title: '日程調整の作成',
    description:
      'ChoisuR（チョイスル）では、飲み会やイベントの候補日を簡単に調整できる日程調整機能を利用できます。会員登録・ログイン不要で URL を共有するだけで出欠確認が完了します。',
    url: 'https://choisur.jp/schedule/create',
    siteName: 'ChoisuR',
    locale: 'ja_JP',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '日程調整の作成',
    description:
      'ChoisuR（チョイスル）では、飲み会やイベントの候補日を簡単に調整できる日程調整機能を利用できます。会員登録・ログイン不要で URL を共有するだけで出欠確認が完了します。',
  },
};

export default function ScheduleCreatePage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      }
    >
      <ScheduleCreateClientPage />
    </Suspense>
  );
}
