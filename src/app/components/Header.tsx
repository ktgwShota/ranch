"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: '#fafafa',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '900px' }}>
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
