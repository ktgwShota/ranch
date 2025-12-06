'use client';

import { Box, Container, Paper, Typography } from '@mui/material';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import PageHeader from '@/components/PageHeader';
import StyledList from '@/components/StyledList';

export default function PrivacyPage() {
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
        <PageHeader title="プライバシーポリシー" />

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            1. はじめに
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            ChoisuR（以下「当サービス」といいます）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            2. 収集する情報
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            当サービスは、以下の情報を収集する場合があります。
          </Typography>
          <StyledList items={[
            '投票作成時に入力された情報（投票タイトル、選択肢のURL、説明文など）',
            '投票参加時に入力された情報（投票者名など）',
            'アクセスログ、IPアドレス、ブラウザ情報などの技術的情報',
          ]} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            3. 情報の利用目的
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            当サービスは、収集した情報を以下の目的で利用します。
          </Typography>
          <StyledList items={[
            '投票サービスの提供・運営',
            'サービスの改善・新機能の開発',
            '不正利用の防止',
            'お問い合わせへの対応',
          ]} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            4. 情報の管理
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            当サービスは、ユーザーの個人情報を適切に管理し、以下の措置を講じます。
          </Typography>
          <StyledList items={[
            '個人情報への不正アクセス・紛失・破壊・改ざん・漏洩などのリスクに対して、適切かつ合理的な安全対策を実施します',
            '個人情報の取扱いに関する規程を整備し、従業員への教育を実施します',
          ]} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            5. 第三者への提供
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。
          </Typography>
          <StyledList items={[
            'ユーザーの同意がある場合',
            '法令に基づく場合',
            '人の生命、身体または財産の保護のために必要がある場合',
          ]} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            6. Cookie（クッキー）の使用
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            当サービスは、サービスの提供および改善のため、Cookieを使用する場合があります。
            Cookieの使用により収集された情報は、統計的な分析に利用されます。
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            7. プライバシーポリシーの変更
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            当サービスは、必要に応じて、本ポリシーの内容を変更することがあります。
            変更後のプライバシーポリシーは、当サービスに掲載した時点で効力を生じるものとします。
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            8. お問い合わせ
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            個人情報の取扱いに関するお問い合わせは、
            <a
              href="/contact"
              style={{ color: '#1976d2', textDecoration: 'none' }}
            >
              お問い合わせページ
            </a>
            からご連絡ください。
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

