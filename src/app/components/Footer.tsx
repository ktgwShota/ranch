'use client';

import {
  ContactMail as ContactIcon,
  Gavel as GavelIcon,
  Info as InfoIcon,
  PrivacyTip as PrivacyIcon,
  AssignmentReturn as ReturnIcon,
  LocalShipping as ShippingIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { Box, Container, Divider, Link, Typography, useMediaQuery, useTheme } from '@mui/material';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const aboutLinks = [
    { label: 'サイト名について', href: '/about', icon: <InfoIcon fontSize="small" /> },
    { label: '利用規約', href: '/terms', icon: <GavelIcon fontSize="small" /> },
    { label: 'プライバシーポリシー', href: '/privacy', icon: <PrivacyIcon fontSize="small" /> },
    { label: 'お問い合わせ', href: '/contact', icon: <ContactIcon fontSize="small" /> },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: '#1f2937',
        color: 'white',
        mt: 'auto',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: 1000, pt: 6, pb: 3 }}>
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems={isMobile ? 'center' : 'flex-start'}
        >
          {/* タイトル */}
          <Box
            sx={{
              flex: 1,
              minWidth: 300,
              textAlign: isMobile ? 'center' : 'left',
            }}
          >
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                color: 'white',
                mb: 2,
                letterSpacing: '-0.02em',
              }}
            >
              サイト名
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.85rem',
                maxWidth: 400,
                mx: isMobile ? 'auto' : 0,
              }}
            >
              サイトのキャッチコピー
            </Typography>
          </Box>

          {/* リンクセクション */}
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            gap={6}
            justifyContent={isMobile ? 'center' : 'flex-end'}
            flexWrap="nowrap"
          >
            {/* ABOUT */}
            <Box textAlign={isMobile ? 'center' : 'left'}>
              <Typography
                variant="subtitle1"
                fontWeight="600"
                sx={{
                  color: 'white',
                  mb: 2,
                  fontSize: '1rem',
                }}
              >
                ABOUT
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {aboutLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease',
                      justifyContent: isMobile ? 'center' : 'flex-start',
                      '&:hover': {
                        color: 'white',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 区切り線 */}
        <Divider sx={{ mt: 3, mb: 3, borderColor: '#374151' }} />

        {/* コピーライト */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 400,
            fontSize: '0.8rem',
            textAlign: 'center',
          }}
        >
          © 2025 サイト名. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
