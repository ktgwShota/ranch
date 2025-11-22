'use client';

import { Add as AddIcon } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LAYOUT_CONSTANTS } from '@/config/constants';

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // トップページではヘッダーを非表示
  if (isHomePage) {
    return null;
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: '#fafafa',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e0e0e0',
        zIndex: 1000,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: LAYOUT_CONSTANTS.MAX_CONTENT_WIDTH }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            height: '70px',
            px: 0.5,
          }}
        >
          {/* ロゴとタイトル */}
          <Link
            href="/"
            style={{ textDecoration: 'none', color: 'inherit' } as React.CSSProperties}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              component="h1"
              fontWeight="700"
              sx={{
                color: '#777',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              サイトロゴ【仮】
            </Typography>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
