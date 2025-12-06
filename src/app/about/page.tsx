import { Box, Container, Paper, Typography } from '@mui/material';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import PageHeader from '@/components/PageHeader';
import StyledList from '@/components/StyledList';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '当サイトについて | ChoisuR',
  description: 'ChoisuR（チョイスル）は、無料で会員登録不要の多数決ツールです。アプリの特徴をご紹介します。',
  openGraph: {
    title: '当サイトについて | ChoisuR',
    description: 'ChoisuR（チョイスル）は、無料で会員登録不要の多数決ツールです。アプリの特徴をご紹介します。',
  },
};

export default function AboutPage() {
  return (
    <Container maxWidth={false} sx={{ maxWidth: LAYOUT_CONSTANTS.MAX_CONTENT_WIDTH }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          my: { xs: 2, sm: 3 },
          borderRadius: 0.5,
          border: '1px solid #ddd',
          backgroundColor: 'white',
        }}
      >
        <PageHeader title="当サイトについて" />

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
      </Paper>
    </Container>
  );
}

