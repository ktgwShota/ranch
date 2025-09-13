"use client";

import {
  Box,
  Typography,
  Container,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
  Restaurant as RestaurantIcon,
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

  const socialLinks = [
    { icon: <GitHubIcon />, href: '#', label: 'GitHub' },
    { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
    { icon: <EmailIcon />, href: '#', label: 'Email' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        mt: 'auto',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.3), transparent)',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 6, pb: 3 }}>
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
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              justifyContent={isMobile ? 'center' : 'flex-start'}
              mb={3}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RestaurantIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                  チョイスル
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                mb: 2,
                fontSize: '0.95rem'
              }}
            >
              xxxx Webツール
            </Typography>
          </Box>

          {/* リンクセクション */}
          <Box
            display="flex"
            flexDirection={isMobile ? 'row' : 'column'}
            gap={isMobile ? 4 : 3}
            alignItems={isMobile ? 'center' : 'flex-start'}
            sx={{ flex: isMobile ? 'none' : '0 0 auto' }}
          >
            <Box>
              <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                サポート
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
                      color: 'text.secondary',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: 'primary.main',
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

          {/* ソーシャルリンク */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems={isMobile ? 'center' : 'flex-end'}
            gap={3}
            sx={{ flex: isMobile ? 'none' : '0 0 auto' }}
          >
            <Box textAlign={isMobile ? 'center' : 'right'}>
              <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                フォローする
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                最新情報をお届け
              </Typography>
            </Box>
            <Box display="flex" gap={1.5}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  size="medium"
                  sx={{
                    color: 'text.secondary',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'white',
                      backgroundColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    }
                  }}
                  title={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>

        {/* 区切り線 */}
        <Divider
          sx={{
            my: 4,
            '&::before, &::after': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
            }
          }}
        />

        {/* コピーライト */}
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            © 2024 ランチ投票ツール. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
