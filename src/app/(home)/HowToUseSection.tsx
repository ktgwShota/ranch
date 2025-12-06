import React, { Fragment } from 'react';
import { Box, Container, Typography } from '@mui/material';
import {
  Create as CreateIcon,
  Share as ShareIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import BrowserWindow from '@/components/BrowserWindow';
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

export default function HowToUseSection() {
  return (
    <Box
      id="hot-to-use"
      sx={{
        pt: { xs: 8, md: 10 },
        pb: { xs: 8, md: 10 },
        backgroundColor: '#ffffff',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: CONTAINER_MAX_WIDTH }}>
        <ScrollReveal viewportAmount={1}>
          <Typography variant="h2" sx={{ ...sectionTitleStyles }}>
            How To Use
          </Typography>
          <Typography
            variant="body1"
            sx={{
              ...sectionSubtitleStyles,
              maxWidth: '600px',
              mb: 10,
            }}
          >
            利用方法
          </Typography>
        </ScrollReveal>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, md: 12 } }}>
          {STEPS.map((step, index) => (
            <Fragment key={index}>
              <ScrollReveal
                mode="slide"
                direction={index % 2 === 0 ? 'left' : 'right'}
                distance={100}
                duration={0.8}
              >
                <StepItem step={step} index={index} />
              </ScrollReveal>
              {index < STEPS.length - 1 && (
                <ScrollReveal delay={0.2} mode="fade" duration={0.8}>
                  <DividerLine />
                </ScrollReveal>
              )}
            </Fragment>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

type StepData = {
  step: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  address?: string;
};

const STEPS: StepData[] = [
  {
    step: 'ステップ1',
    title: 'ページを作成',
    description: '多数決の投票先となる候補の情報を入力して多数決を行うためのページを作成します。',
    imageSrc: '/1.png',
    imageAlt: '投票作成画面',
    icon: <CreateIcon sx={{ fontSize: '1.5rem', color: '#3b82f6' }} />,
    address: 'https://choisur.jp/polls/create',
  },
  {
    step: 'ステップ2',
    title: 'ページを共有',
    description: '多数決に参加するメンバーに作成したページを LINE や Slack などの SNS で共有します。',
    imageSrc: '/2.png',
    imageAlt: '投票ページ共有画面',
    icon: <ShareIcon sx={{ fontSize: '1.5rem', color: '#3b82f6' }} />,
    address: 'https://choisur.jp/polls/xxx',
  },
  {
    step: 'ステップ3',
    title: '行き先が決定',
    description: '全員の投票が完了したら結果が公開されます。',
    imageSrc: '/3.png',
    imageAlt: '投票結果画面',
    icon: <RestaurantIcon sx={{ fontSize: '1.5rem', color: '#3b82f6' }} />,
    address: 'https://choisur.jp/polls/xxx',
  },
];

interface StepContentProps {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isEven: boolean;
}

function StepContent({ step, title, description, icon, isEven }: StepContentProps) {
  return (
    <Box
      sx={{
        flex: { xs: 1, md: 0.5 },
        textAlign: { xs: 'center', md: 'left' },
        order: { xs: 1, md: isEven ? 1 : 2 },
      }}
    >
      <Typography
        sx={{
          color: '#3b82f6',
          fontSize: '0.875rem',
          fontWeight: 600,
          mb: 1,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {step}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        {icon}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: '1.75rem',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '1.125rem' }}
      >
        {description}
      </Typography>
    </Box>
  );
}

interface StepBrowserProps {
  imageSrc: string;
  imageAlt: string;
  address: string;
  isEven: boolean;
}

function StepBrowser({ imageSrc, imageAlt, address, isEven }: StepBrowserProps) {
  return (
    <Box
      sx={{
        flex: { xs: 1, md: 0.5 },
        display: 'flex',
        justifyContent: { xs: 'center', md: isEven ? 'flex-end' : 'flex-start' },
        alignItems: 'flex-start',
        order: { xs: 2, md: isEven ? 2 : 1 },
        position: 'relative',
        pr: 2,
        pb: 2,
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: '20px',
          bottom: '20px',
          bgcolor: 'rgba(0, 0, 0, 0.1)',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          borderBottomLeftRadius: '2px',
          borderBottomRightRadius: '2px',
          transform: 'translate(25px, 25px)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          zIndex: 1,
        }}
      >
        <BrowserWindow imageSrc={imageSrc} imageAlt={imageAlt} address={address} />
      </Box>
    </Box>
  );
}

function DividerLine() {
  return (
    <Box
      sx={{
        height: 2,
        width: '100vw',
        position: 'relative',
        left: '50%',
        background: 'linear-gradient(90deg, rgba(148,163,184,0), rgba(148,163,184,0.35), rgba(148,163,184,0))',
        opacity: 0.6,
        transform: 'translateX(-50%)',
      }}
    />
  );
}

function StepItem({ step, index }: { step: StepData; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 10,
      }}
    >
      <StepContent
        step={step.step}
        title={step.title}
        description={step.description}
        icon={step.icon}
        isEven={isEven}
      />
      <StepBrowser
        imageSrc={step.imageSrc}
        imageAlt={step.imageAlt}
        address={step.address!}
        isEven={isEven}
      />
    </Box>
  );
}

