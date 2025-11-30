import { Box, Container, Paper, Typography } from '@mui/material';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import PageHeader from '@/app/components/PageHeader';
import StyledList from '@/app/components/StyledList';

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
        <PageHeader title="ChoisuRについて" />

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            サービス概要
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            ChoisuR は、飲み会や食事会のお店選びに特化したログイン不要・無料で使用できる投票ツールです。
            主要なグルメサイトに対応し、URLを貼るだけで写真付きのアンケートを簡単に作成・共有できます。
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            主な機能
          </Typography>
          <StyledList items={[
            'グルメサイトのURLから自動で店舗情報を取得',
            '写真付きの投票ページを簡単に作成',
            'ログイン不要で誰でも投票可能',
            'リアルタイムで投票結果を確認',
          ]} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            対応グルメサイト
          </Typography>
          <StyledList items={['食べログ', 'ぐるなび']} />
        </Box>
      </Paper>
    </Container>
  );
}

