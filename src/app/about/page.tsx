import { Box, Container, Paper, Typography } from '@mui/material';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import PageHeader from '@/components/layouts/PageHeader';
import StyledList from '@/components/ui/StyledList';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '当サイトについて',
  description:
    'ChoisuR（チョイスル）は、飲み会やイベントの日程調整や店決め（多数決）を簡単に作成・共有できる無料の幹事アプリです。当サイトについてご紹介します。',
  alternates: {
    canonical: 'https://choisur.jp/about',
  },
  openGraph: {
    title: '当サイトについて',
    description:
      'ChoisuR（チョイスル）は、飲み会やイベントの日程調整や店決め（多数決）を簡単に作成・共有できる無料の幹事アプリです。当サイトについてご紹介します。',
    url: 'https://choisur.jp/about',
    siteName: 'ChoisuR',
    locale: 'ja_JP',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '当サイトについて | ChoisuR（チョイスル）',
    description:
      'ChoisuR（チョイスル）は、飲み会やイベントの日程調整や店決め（多数決）を簡単に作成・共有できる無料の幹事アプリです。当サイトについてご紹介します。',
  },
};


export default function AboutPage() {
  return (
    <>
      <Typography
        variant="h1"
        sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '18px', sm: '20px' }, mb: 2 }}
      >
        当サイトについて
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
        >
          サービス概要
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
          ChoisuR（チョイスル）は、意思決定を公正かつ迅速に行うためのオンライン多数決サービスです。
        </Typography>
        <StyledList items={[
          'いつまで経っても決まらない飲み会の場所',
          'やっぱりこちらの方が良かった...といった周囲からの不満',
        ]} />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
          あらゆる選択を参加者全員の納得感をもって決定することを支援します。
        </Typography>
      </Box>
    </>
  );
}

