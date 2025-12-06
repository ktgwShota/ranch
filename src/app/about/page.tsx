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
            ChoisuR は無料で使用できる多数決ツールです。
            <br />
            食事会 / 交流会 / 旅行先の決定など、あらゆるシーンでご利用いただけます。
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
            '会員登録不要で、すぐに投票ページを作成',
            'URLをシェアするだけで、メンバー全員が投票可能',
            '多数決で公平に全員の意思を反映',
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

