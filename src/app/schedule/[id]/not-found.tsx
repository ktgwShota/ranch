import { Box, Typography, Button } from '@mui/material';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box
      sx={{
        maxWidth: LAYOUT_CONSTANTS.MAX_CONTENT_WIDTH,
        mx: 'auto',
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        スケジュールが見つかりません
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        お探しの日程調整は存在しないか、削除された可能性があります。
      </Typography>
      <Button component={Link} href="/" variant="contained">
        トップページへ戻る
      </Button>
    </Box>
  );
}

