'use client';

import { Box, Container, Paper, Typography } from '@mui/material';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import PageHeader from '@/app/components/PageHeader';

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
        <PageHeader title="チョイスルについて" />

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            サービス概要
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            チョイスルは、ランチのお店選びに特化したログイン不要・無料で使用できる投票ツールです。
            主要なグルメサイトに対応し、URLを貼るだけで写真付きのアンケートを簡単に作成・共有できます。
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            幹事の時間を大切にし、メンバー全員が納得できるお店選びをサポートします。
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            主な機能
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            • グルメサイトのURLから自動で店舗情報を取得
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            • 写真付きの投票ページを簡単に作成
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            • ログイン不要で誰でも投票可能
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            • リアルタイムで投票結果を確認
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            対応グルメサイト
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            • 食べログ
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            • ぐるなび
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

