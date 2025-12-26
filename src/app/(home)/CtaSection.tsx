import { Box, Button, Container, Typography } from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  CalendarMonth as CalendarMonthIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

const CONTAINER_MAX_WIDTH = '1100px';

export default function BottomCTASection() {
  return (
    <Box
      id="bottom-cta-section"
      sx={{
        pb: { xs: 12, md: 20 },
        pt: { xs: 0, md: 0 }, // Adjust based on previous section spacing
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: CONTAINER_MAX_WIDTH }}>
        <ScrollReveal mode="zoom" duration={0.8} scale={0.95}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: { xs: '32px', md: '48px' },
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', // Slate dark
              px: { xs: 3, md: 8 },
              py: { xs: 8, md: 10 },
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
            }}
          >
            {/* Background Accents */}
            <Box
              sx={{
                position: 'absolute',
                top: '-50%',
                left: '-20%',
                width: '80%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 70%)',
                transform: 'rotate(-15deg)',
                pointerEvents: 'none',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: '-50%',
                right: '-20%',
                width: '80%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0) 70%)',
                transform: 'rotate(-15deg)',
                pointerEvents: 'none',
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  fontWeight: 800,
                  color: 'white',
                  lineHeight: 1.2,
                  mb: 3,
                  letterSpacing: '-0.02em',
                }}
              >
                面倒な調整は、<br />
                もう終わりにしよう。
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  color: '#94a3b8', // slate-400
                  mb: 6,
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                アカウント登録はいりません。<br />
                今すぐ、新しい体験を始めましょう。
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'center',
                  gap: { xs: 2.5, sm: 4 },
                }}
              >
                <Button
                  component={Link}
                  href="/polls/create"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: '#0f172a',
                    px: { xs: 4, md: 5 },
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    textTransform: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: '#f1f5f9',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.3)',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.25rem',
                    }
                  }}
                >
                  お店を決める
                </Button>
                <Button
                  component={Link}
                  href="/schedule/create"
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    px: { xs: 4, md: 5 },
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    textTransform: 'none',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.25rem',
                    }
                  }}
                >
                  日程を調整する
                </Button>
              </Box>
            </Box>
          </Box>
        </ScrollReveal>
      </Container>
    </Box>
  );
}

