"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Share as ShareIcon,
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
        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* ロゴとタイトル */}
        <Box display="flex" alignItems="center" gap={2}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box display="flex" alignItems="center" gap={1}>
              <RestaurantIcon sx={{ fontSize: 32 }} />
              <Typography
                variant={isMobile ? "h6" : "h5"}
                component="h1"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                チョイスル
              </Typography>
            </Box>
          </Link>
        </Box>

        {/* ナビゲーション */}
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            component={Link}
            href="/"
            startIcon={<ShareIcon />}
            sx={{
              color: 'white',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {isMobile ? '' : '新しい投票を作成'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
