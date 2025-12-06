import { Box, Button, Container, Typography } from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import Link from 'next/link';

const CONTAINER_MAX_WIDTH = '960px';

interface FeatureBadgeProps {
  icon: React.ComponentType<any>;
  text: string;
  accentColor: string;
  textColor: string;
}

function FeatureBadge({ icon: Icon, text, accentColor, textColor }: FeatureBadgeProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Icon sx={{ fontSize: '1.5rem', color: accentColor }} />
      <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: textColor }}>
        {text}
      </Typography>
    </Box>
  );
}

export default function BottomCTASection() {
  const DARK_NAVY = '#1e293b';
  const TEAL_ACCENT = '#2dd4bf';
  const LIGHT_TEXT = '#f8fafc';
  const SUBTLE_TEXT = '#94a3b8';

  const features: Array<{ icon: React.ComponentType<any>; text: string }> = [
    { icon: CheckCircleIcon, text: '無料' },
    { icon: LockIcon, text: '匿名使用可能' },
  ];

  return (
    <Box
      id="bottom-cta-section"
      sx={{
        position: 'relative',
        background: DARK_NAVY,
        pt: { xs: 12, md: 16 },
        pb: { xs: 12, md: 16 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at center, ${DARK_NAVY} 0%, #0f172a 100%)`,
          opacity: 0.8,
          zIndex: 0,
        }}
      />

      <Container maxWidth={false} sx={{ maxWidth: CONTAINER_MAX_WIDTH, zIndex: 1, position: 'relative' }}>
        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 3,
              color: LIGHT_TEXT,
              textShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            多数決 = 公平な意思決定
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: SUBTLE_TEXT,
              lineHeight: 1.7,
              mb: 6,
            }}
          >
            もう一人で悩む必要はありません。
            <br />
            全員の意思を反映した結果がすぐにわかります。
          </Typography>

          <Button
            component={Link}
            href="/polls/create"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: TEAL_ACCENT,
              color: DARK_NAVY,
              borderRadius: '9999px',
              px: { xs: 2, md: 3 },
              py: { xs: 1.5, md: 2 },
              fontSize: { xs: '1rem', md: '1rem' },
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: `0 15px 30px -10px ${TEAL_ACCENT}50`,
            }}
          >
            今すぐ始める
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 3, md: 3 },
              mt: 6,
            }}
          >
            {features.map((item, index) => (
              <FeatureBadge
                key={index}
                icon={item.icon}
                text={item.text}
                accentColor={TEAL_ACCENT}
                textColor={SUBTLE_TEXT}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

