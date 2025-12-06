import { Box, Container, Paper, Typography } from '@mui/material';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import PageHeader from '@/components/PageHeader';
import StyledList from '@/components/StyledList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約 | ChoisuR',
  description: 'ChoisuR（チョイスル）の利用規約を記載したページです。',
  openGraph: {
    title: '利用規約 | ChoisuR',
    description: 'ChoisuR（チョイスル）の利用規約を記載したページです。',
  },
};

export default function TermsPage() {
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
        <PageHeader title="利用規約" />

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            第1条（適用）
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            本利用規約（以下「本規約」といいます）は ChoisuR（以下「当サービス」といいます）の利用条件を定めるものです。
            利用者（以下「ユーザー」といいます）は本規約に同意した場合のみ当サービスを利用することができます。
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            第2条（利用登録）
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            当サービスは、ログイン不要でご利用いただけます。
            投票の作成や参加は、本規約に同意した上で行ってください。
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            第3条（禁止事項）
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。
          </Typography>
          <StyledList items={[
            '法令または公序良俗に違反する行為',
            '犯罪行為に関連する行為',
            '当サービスの内容等、当サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為',
            '当サービス、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為',
            '当サービスによって得られた情報を商業的に利用する行為',
          ]} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            第4条（当サービスの提供の停止等）
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            当サービスは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当サービスの全部または一部の提供を停止または中断することができるものとします。
          </Typography>
          <StyledList items={[
            '当サービスにかかるコンピュータシステムの保守点検または更新を行う場合',
            '地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合',
            'その他、当サービスが提供の停止または中断を必要と判断した場合',
          ]} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            第5条（保証の否認および免責）
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
            当サービスは、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            当サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            第6条（サービス内容の変更等）
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            当サービスは、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあります。
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            第7条（利用規約の変更）
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            当サービスは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
            なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
          >
            第8条（準拠法・裁判管轄）
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            本規約の解釈にあたっては、日本法を準拠法とします。
            本サービスに関して紛争が生じた場合には、当サービスの本店所在地を管轄する裁判所を専属的合意管轄とします。
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

