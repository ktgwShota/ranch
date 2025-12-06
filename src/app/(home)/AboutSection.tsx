import { Box, Container, Typography } from '@mui/material';
import {
  FlashOn as FlashOnIcon,
  Group as GroupIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import ScrollReveal from '@/components/ScrollReveal';

const CONTAINER_MAX_WIDTH = '960px';

const sectionTitleStyles = {
  fontSize: { xs: '1.75rem', md: '2.25rem' },
  fontWeight: 700,
  color: 'text.primary',
  textAlign: 'center' as const,
  mb: 2,
};

const sectionSubtitleStyles = {
  fontWeight: 'bold' as const,
  fontSize: '1.125rem',
  color: 'text.secondary',
  textAlign: 'center' as const,
  mx: 'auto',
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  index: number;
}

function FeatureCard({ title, description, icon, color, bgColor, index }: FeatureCardProps) {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: '12px 12px 1px 1px',
        borderTop: `1px solid ${color}`,
        borderLeft: '1px solid',
        borderRight: '1px solid',
        borderBottom: '1px solid',
        borderColor: '#e5e7eb',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pt: 5,
          pb: 4,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: bgColor,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>

      <Box
        sx={{
          px: 4,
          pb: 5,
          pt: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2.5,
            color: 'text.primary',
            fontSize: '1.125rem',
            letterSpacing: '-0.01em',
            lineHeight: 1.5,
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.8,
            fontSize: '0.9375rem',
            textAlign: 'center',
            flex: 1,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

export default function AboutSection() {
  const features = [
    {
      title: '会員登録なしで即スタート',
      description: '面倒なアカウント登録やログインは一切不要。誰でもすぐに投票を作成できます。',
      icon: <FlashOnIcon sx={{ fontSize: 32 }} />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      title: 'URLをシェアするだけ',
      description: '投票ページを作成してURLを共有。LINEやSlackで簡単にメンバーを招待できます。',
      icon: <LinkIcon sx={{ fontSize: 32 }} />,
      color: '#0ea5e9',
      bgColor: '#f0f9ff',
    },
    {
      title: '全員で決める公平性',
      description: '多数決で行き先を決めることで全員の意見を尊重した公平な意思決定をサポートします。',
      icon: <GroupIcon sx={{ fontSize: 32 }} />,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
    },
  ];

  return (
    <Box
      id="about-section"
      sx={{
        py: { xs: 10, md: 12 },
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.03) 0%, rgba(59,130,246,0) 70%)',
          zIndex: 0,
        }}
      />

      <Container maxWidth={false} sx={{ maxWidth: CONTAINER_MAX_WIDTH, position: 'relative', zIndex: 1 }}>
        <ScrollReveal mode="slide" direction="none" distance={30} duration={1} viewportAmount={0.9}>
          <Box
            sx={{
              textAlign: 'center',
              mb: 12,
            }}
          >
            <Typography
              variant="h2"
              sx={{ ...sectionTitleStyles, mb: 3, fontSize: { xs: '2rem', md: '2.5rem' }, letterSpacing: '-0.02em' }}
            >
              ChoisuR について
            </Typography>
            <Typography
              variant="body1"
              sx={{ ...sectionSubtitleStyles, maxWidth: '700px', lineHeight: 1.8, color: 'text.secondary' }}
            >
              ChoisuR は無料で使用できるオンライン多数決サービスです。
              <br />
              「飲み会」や「旅行先」の決定など、あらゆるシーンでご利用いただけます。
            </Typography>
          </Box>
        </ScrollReveal>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 3, md: 4 },
          }}
        >
          {features.map((feature, index) => (
            <ScrollReveal
              key={index}
              mode="pop"
              distance={40}
              delay={index * 0.2}
              duration={1}
              viewportAmount={0.4}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
                bgColor={feature.bgColor}
                index={index}
              />
            </ScrollReveal>
          ))}
        </Box>
      </Container>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          borderBottom: '4px dashed #eee',
          opacity: 1,
        }}
      />
    </Box>
  );
}

