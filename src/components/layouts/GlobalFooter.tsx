import { LAYOUT_CONSTANTS } from '@/config/constants';
import {
  ContactMail as ContactIcon,
  Gavel as GavelIcon,
  Info as InfoIcon,
  PrivacyTip as PrivacyIcon,
} from '@mui/icons-material';
import { Box, Container, Divider, Link, Typography } from '@mui/material';

export default function GlobalFooter() {
  const aboutLinks = [
    { label: '当サイトについて', href: '/about', icon: <InfoIcon fontSize="small" /> },
    { label: '利用規約', href: '/terms', icon: <GavelIcon fontSize="small" /> },
    { label: 'プライバシーポリシー', href: '/privacy', icon: <PrivacyIcon fontSize="small" /> },
    { label: 'お問い合わせ', href: '/contact', icon: <ContactIcon fontSize="small" /> },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: '#1e293b',
        color: 'white',
        mt: 'auto',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: LAYOUT_CONSTANTS.MAX_CONTENT_WIDTH, pt: 6, pb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
          }}
        >
          {/* タイトル */}
          <Box
            sx={{
              flex: 1,
              minWidth: 300,
              textAlign: { xs: 'center', sm: 'left' },
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
              ChoisuR
            </Typography>
          </Box>

          {/* リンクセクション */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 6,
              justifyContent: { xs: 'center', sm: 'flex-end' },
              flexWrap: 'nowrap',
            }}
          >
            {/* ABOUT */}
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant="h6"
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
                      justifyContent: { xs: 'center', sm: 'flex-start' },
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
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 400,
            fontSize: '0.8rem',
            textAlign: 'center',
          }}
        >
          © 2025 ChoisuR. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
