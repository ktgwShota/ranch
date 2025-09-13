"use client";

import {
  Box,
  Typography,
  Container,
  Link,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Announcement as AnnouncementIcon,
  Gavel as GavelIcon,
  PrivacyTip as PrivacyIcon,
  ContactMail as ContactIcon,
} from '@mui/icons-material';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const footerLinks = [
    { label: 'お知らせ', href: '#', icon: <AnnouncementIcon fontSize="small" /> },
    { label: '利用規約', href: '#', icon: <GavelIcon fontSize="small" /> },
    { label: 'プライバシーポリシー', href: '#', icon: <PrivacyIcon fontSize="small" /> },
    { label: 'お問い合わせ', href: '#', icon: <ContactIcon fontSize="small" /> },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        mt: 'auto',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        }
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1000px', pt: 4, pb: 2 }}>
        {/* メインコンテンツ */}
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems={isMobile ? 'center' : 'flex-start'}
          gap={4}
          mb={4}
        >
          {/* ロゴと説明 */}
          <Box
            textAlign={isMobile ? 'center' : 'left'}
            sx={{
              maxWidth: isMobile ? '100%' : 400,
              flex: isMobile ? 'none' : 1
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
              チョイスル
            </Typography>
          </Box>

          {/* リンクセクション */}
          <Box
            display="flex"
            flexDirection={isMobile ? 'row' : 'column'}
            gap={isMobile ? 4 : 2}
            alignItems={isMobile ? 'center' : 'flex-start'}
            sx={{ flex: isMobile ? 'none' : '0 0 auto' }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="600"
                sx={{
                  color: 'white',
                  mb: 2,
                  fontSize: '0.95rem'
                }}
              >
                ABOUT US
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {footerLinks.map((link) => (
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
                      '&:hover': {
                        color: 'white',
                        transform: 'translateX(4px)',
                      }
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
        <Divider
          sx={{
            mt: 3,
            mb: 2,
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />

        {/* コピーライト */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 400,
            fontSize: '0.8rem'
          }}
        >
          © 2025 チョイスル. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
