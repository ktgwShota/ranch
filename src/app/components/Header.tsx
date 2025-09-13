"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import Link from 'next/link';

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1000px' }}>
        <Toolbar sx={{
          justifyContent: 'space-between',
          height: '70px',
          px: 0.5,
        }}>
          {/* ロゴとタイトル */}
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="h1"
              fontWeight="700"
              sx={{
                color: 'white',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              チョイスル
            </Typography>
          </Link>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
