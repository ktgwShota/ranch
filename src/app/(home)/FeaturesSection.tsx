import { Box, Container, Typography, Grid } from '@mui/material';
import {
  AutoFixHigh as AutoFixHighIcon,
  MoneyOff as MoneyOffIcon,
  TouchApp as TouchAppIcon,
  RocketLaunch as RocketLaunchIcon,
} from '@mui/icons-material';
import ScrollReveal from '@/components/ui/ScrollReveal';

// Mapping icons to match the reference image vibe while keeping current text logic
// Reference Image Icons:
// Top Left (Orange): Shield -> Security/Safe (Login Unnecessary fits "No Account" safety?)
// Top Right (Blue): Rocket -> Speed/Performance (Intuitive fits Speed?)
// Bottom Left (Purple): Infinity -> Scalability (URL Share fits infinite reach?)
// Bottom Right (Teal): Handshake -> Support (Fair Decisions fits fairness?)

const CONTAINER_MAX_WIDTH = '900px';

const sectionTitleStyles = {
  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
  fontWeight: 800,
  color: '#ffffff',
  textAlign: 'center' as const,
  mb: 6,
  textShadow: '0 0 20px rgba(255,255,255,0.3)',
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
  glowColor: string;
}

function FeatureCard({ title, description, icon, delay, glowColor }: FeatureCardProps) {
  return (
    <ScrollReveal
      mode="pop"
      distance={20}
      delay={delay}
      duration={0.8}
      viewportAmount={0.3}
      style={{ height: '100%' }}
    >
      <Box
        sx={{
          height: '100%',
          p: { xs: 4, md: 6 },
          borderRadius: '24px',
          // Glass Style strictly matching reference
          bgcolor: 'rgba(255, 255, 255, 0.05)', // Very subtle fill
          backdropFilter: 'blur(20px)', // Strong blur
          border: '1px solid rgba(255, 255, 255, 0.2)', // Visible thin border
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',

          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Centered alignment
          justifyContent: 'center',
          textAlign: 'center',
          transition: 'transform 0.3s ease, border-color 0.3s ease',

          '&:hover': {
            transform: 'translateY(-5px)',
            borderColor: `rgba(${glowColor}, 0.6)`,
            boxShadow: `0 8px 40px -10px rgba(${glowColor}, 0.3)`,
          },
        }}
      >
        {/* Large Neon Icon */}
        <Box
          sx={{
            mb: 3,
            color: 'white', // Icon stroke color (or handled by specific component)
            filter: `drop-shadow(0 0 10px rgba(${glowColor}, 0.8))`, // Neon glow effect
            '& svg': {
              fontSize: '4.5rem', // Large icon
              color: `rgb(${glowColor})`, // Set the icon structure color
            }
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            color: '#f8fafc',
            fontSize: '1.25rem',
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#cbd5e1',
            lineHeight: 1.6,
            fontSize: '0.95rem',
            opacity: 0.9,
          }}
        >
          {description}
        </Typography>
      </Box>
    </ScrollReveal>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      title: '圧倒的な利便性',
      description: '面倒なアカウント登録やログインは一切不要。サイトを開けばその場で利用開始できます。',
      icon: <RocketLaunchIcon />,
      glowColor: '60, 150, 255',
    },
    {
      title: '直感的な操作性',
      description: 'マニュアル不要のシンプル設計。PCでもスマホでも、誰でも直感的に操作できます。',
      icon: <TouchAppIcon />,
      glowColor: '200, 80, 255',
    },
    {
      title: '完全無料',
      description: '初期費用も課金も一切ありません。すべての機能をずっと無料でご利用いただけます。',
      icon: <MoneyOffIcon />,
      glowColor: '50, 230, 200',
    },
  ];

  return (
    <Box
      id="about-section"
      sx={{
        py: { xs: 12, md: 16 },
        backgroundColor: '#020617', // Match HeroSection base color
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 16, md: 16 }, // Extra top padding to account for the wave visual overlap if needed, or just standard spacing
        pb: { xs: 12, md: 16 },
      }}
    >
      {/* Background Orbs - Matching Reference Positions */}

      {/* <Box
        sx={{
          position: 'absolute',
          top: '0%',
          left: '0%',
          width: '20vw',
          minWidth: '100px',
          height: '50vw',
          minHeight: '600px',
          background: 'radial-gradient(circle, rgba(255, 120, 50, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      /> */}

      {/* Top Right - Blue */}
      {/* <Box
        sx={{
          position: 'absolute',
          top: '0%',
          right: '0%',
          width: '20vw',
          minWidth: '100px',
          height: '50vw',
          minHeight: '500px',
          background: 'radial-gradient(circle, rgba(60, 100, 255, 0.25) 0%, transparent 70%)',
          filter: 'blur(90px)',
          zIndex: 0,
        }}
      /> */}

      {/* Bottom Left - Purple */}
      {/* <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          left: '0%',
          width: '20vw',
          minWidth: '100px',
          height: '50vw',
          minHeight: '500px',
          background: 'radial-gradient(circle, rgba(180, 60, 255, 0.2) 0%, transparent 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
        }}
      /> */}

      {/* Bottom Right - Teal/Green */}
      {/* <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '0%',
          width: '20vw',
          minWidth: '100px',
          height: '50vw',
          minHeight: '550px',
          background: 'radial-gradient(circle, rgba(50, 220, 180, 0.2) 0%, transparent 70%)',
          filter: 'blur(90px)',
          zIndex: 0,
        }}
      /> */}

      <Container maxWidth={false} sx={{ maxWidth: CONTAINER_MAX_WIDTH, position: 'relative', zIndex: 1 }}>
        <ScrollReveal mode="slide" direction="up" distance={30} duration={0.8}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={sectionTitleStyles}>
              Choisur が使われる理由
            </Typography>
            {/* Reference image doesn't show subtitle, but keeping it small/subtle is safer or removing it to match strict minimal look. 
                I'll keep it but very subtle. */}
          </Box>
        </ScrollReveal>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            // Using size prop for MUI Grid v2/v6 compatibility
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                delay={index * 0.1}
                glowColor={feature.glowColor}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
