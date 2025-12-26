'use client';

import React, { useState } from 'react';
import { Box, Stack, Typography, SxProps, Theme } from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  CalendarMonth as CalendarMonthIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  QuestionMark as QuestionMarkIcon,
  SvgIconComponent
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ui/ScrollReveal';

// -----------------------------------------------------------------------------
// Constants & Configuration
// -----------------------------------------------------------------------------

type FeatureType = 'voting' | 'scheduling';

interface FeatureConfig {
  id: FeatureType;
  title: string;
  subtitle: string;
  description: string;
  icon: SvgIconComponent;
  color: string;
  align: 'left' | 'right';
}

const FEATURES: Record<FeatureType, FeatureConfig> = {
  voting: {
    id: 'voting',
    title: '店決め',
    subtitle: 'VOTING UNIT',
    description: '候補を選んでシェア。参加者の好みが可視化。全員が納得する一軒がスムーズに見つかります。',
    icon: RestaurantIcon,
    color: '#f97316', // Orange
    align: 'left',
  },
  scheduling: {
    id: 'scheduling',
    title: '日程調整',
    subtitle: 'SCHEDULE UNIT',
    description: 'カレンダーから候補を選ぶだけ。参加者の出欠を把握し、最適な開催日を特定。',
    icon: CalendarMonthIcon,
    color: '#06b6d4', // Cyan
    align: 'right',
  },
};

// -----------------------------------------------------------------------------
// Sub-Components (HUDs)
// -----------------------------------------------------------------------------

// Common styles for HUD containers to ensure consistency
const hudContainerStyle = (color: string): SxProps<Theme> => ({
  width: { xs: '260px', sm: '320px' },
  p: { xs: 3, sm: 4 },
  borderRadius: '1px',
  bgcolor: 'rgba(15, 23, 42, 0.6)',
  border: `1px solid ${color}33`, // roughly 0.2 opacity
  backdropFilter: 'blur(8px)',
  position: 'relative',
  overflow: 'hidden',
});

function VotingHUD({ hovered }: { hovered: boolean }) {
  const { color } = FEATURES.voting;
  const items = [
    { rank: 'A', label: '焼肉', width: 6 },
    { rank: 'B', label: '和食', width: 3 },
    { rank: 'C', label: '中華', width: 2 },
  ];

  return (
    <Box sx={hudContainerStyle(color)}>
      {/* Decorative Corners */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: 8, height: 8, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.85rem', color: color, fontWeight: 700, letterSpacing: '0.1em' }}>飲み会のお店はどこがいい？</Typography>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, boxShadow: `0 0 10px ${color}` }} />
      </Box>

      <Stack spacing={2}>
        {items.map((item, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 20, height: 20, borderRadius: '50%', bgcolor: `${color}33`, color: color,
              fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${color}80`
            }}>
              {item.rank}
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#cbd5e1', width: '40px', mr: 0.5 }}>{item.label}</Typography>
            <Box sx={{ flex: 1, height: '6px', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: hovered ? `${item.width}%` : '0%' }}
                transition={{ duration: 1, delay: i * 0.1 + 0.2, ease: "circOut" }}
                style={{ height: '100%', background: i === 0 ? color : '#475569' }}
              />
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: i === 0 ? color : '#475569', fontWeight: 700 }}>{item.width} 票</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function SchedulingHUD({ hovered }: { hovered: boolean }) {
  const { color } = FEATURES.scheduling;
  const topDates = [
    { label: '12/24 (金)', rank: 'A', ok: 6, maybe: 1, no: 1 },
    { label: '12/25 (土)', rank: 'B', ok: 4, maybe: 2, no: 2 },
    { label: '12/27 (月)', rank: 'C', ok: 3, maybe: 3, no: 2 },
  ];

  return (
    <Box sx={hudContainerStyle(color)}>
      {/* Decorative Corners */}
      <Box sx={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: 8, height: 8, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.85rem', color: color, fontWeight: 700, letterSpacing: '0.1em' }}>送別会はいつがいいですか？</Typography>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, boxShadow: `0 0 10px ${color}` }} />
      </Box>

      <Stack spacing={1.5}>
        {topDates.map((date, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 20, height: 20, borderRadius: '50%', bgcolor: `${color}33`, color: color,
              fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${color}80`
            }}>
              {date.rank}
            </Box>
            <Typography sx={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, letterSpacing: '0.05em' }}>{date.label}</Typography>
            <Box sx={{ flex: 1 }} />
            <Box sx={{ display: 'flex', gap: 1.2 }}>
              <StatusCount icon={CheckIcon} count={date.ok} color="#22c55e" />
              <StatusCount icon={QuestionMarkIcon} count={date.maybe} color="#f59e0b" textColor="#94a3b8" />
              <StatusCount icon={CloseIcon} count={date.no} color="#ff4359" textColor="#94a3b8" />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

const StatusCount = ({ icon: Icon, count, color, textColor = '#cbd5e1' }: { icon: any, count: number, color: string, textColor?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    <Icon sx={{ fontSize: '1rem', color }} />
    <Typography sx={{ fontSize: '0.75rem', color: textColor, fontWeight: 600 }}>{count}</Typography>
  </Box>
);

// -----------------------------------------------------------------------------
// Core Components
// -----------------------------------------------------------------------------

/**
 * Reusable Content Block for each feature (Text + HUD)
 */
function FeatureBlock({
  config,
  isActive,
  hovered,
  setHovered,
  index,
  children
}: {
  config: FeatureConfig,
  isActive: boolean,
  hovered: FeatureType | null,
  setHovered: (v: FeatureType | null) => void,
  index: number,
  children: React.ReactNode
}) {
  const isLeft = config.align === 'left';
  const { color } = config;

  return (
    <ScrollReveal
      mode="slide"
      direction={isLeft ? 'right' : 'left'}
      distance={40}
      delay={index * 0.2}
      duration={0.8}
      viewportAmount={0.2}
      style={{ width: '100%' }}
    >
      <Box
        onMouseEnter={() => setHovered(config.id)}
        onMouseLeave={() => setHovered(null)}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: isLeft ? 'row' : 'row-reverse' },
          alignItems: { xs: 'center', md: 'center' },
          pt: { xs: 3.5, md: 4 },
          pb: { xs: 5, md: 6 },
          pl: { xs: 3, md: 3 },
          pr: { xs: 3, md: 3 },
          width: '100%',
          bgcolor: { xs: isActive ? `${color}0D` : 'transparent', md: isActive ? `${color}08` : 'transparent' },
          transition: 'all 0.6s cubic-bezier(0.2, 1, 0.3, 1)',
          position: 'relative',
          gap: { xs: 4, md: 0 }, // Gap for mobile, handled by flex-grow on desktop
        }}
      >
        <Stack spacing={3} sx={{
          flex: { xs: 'none', md: 1 },
          alignItems: { xs: 'center', md: 'flex-start' },
          width: { xs: '100%', md: 'auto' }
        }}>
          {/* Label & Icon */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            mb: 2,
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}>
            <Box sx={{ color, display: 'flex' }}>
              <config.icon sx={{
                fontSize: 24,
                filter: isActive ? `drop-shadow(0 0 10px ${color}CC)` : 'none',
                transition: 'filter 0.4s'
              }} />
            </Box>
            <Typography variant="overline" sx={{
              color, fontWeight: 900, letterSpacing: '0.4em', fontSize: '0.8rem',
              textShadow: isActive ? `0 0 20px ${color}80` : 'none',
              transition: 'text-shadow 0.4s'
            }}>
              {config.subtitle}
            </Typography>
          </Box>

          {/* Headings */}
          <Typography variant="h3" sx={{
            color: '#f8fafc', fontWeight: 900, mb: 1.5, fontSize: { xs: '1.6rem', sm: '1.8rem', md: '1.8rem' },
            letterSpacing: '-0.04em', lineHeight: 1.1,
            textAlign: { xs: 'center', md: 'left' }
          }}>
            {config.title}
          </Typography>

          <Typography sx={{
            color: '#cbd5e1', fontSize: { xs: '0.9rem', md: '1.1rem' }, lineHeight: 1.7,
            opacity: 0.8, maxWidth: '400px', fontWeight: 500, mb: { xs: 2, md: 4 },
            textAlign: { xs: 'center', md: 'left' }
          }}>
            {config.description}
          </Typography>

        </Stack>

        {/* HUD Slot (placed side-by-side on desktop) */}
        <Box sx={{
          flex: { xs: 'none', md: 1 },
          display: 'flex',
          justifyContent: { xs: 'center', md: isLeft ? 'flex-end' : 'flex-start' },
          width: { xs: '100%', md: 'auto' },
        }}>
          {children}
        </Box>
      </Box>
    </ScrollReveal>
  );
}


// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export default function AboutSection() {
  const [hovered, setHovered] = useState<FeatureType | null>(null);

  return (
    <Box id="about-section" sx={{
      position: 'relative',
      minHeight: { xs: 'auto', md: '100vh' },
      background: '#0B0F19',
      overflow: 'hidden',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Header */}
      <ScrollReveal mode="slide" direction="up" duration={1} viewportAmount={0.5}>
        <Box sx={{
          pt: { xs: 4, md: 4 },
          pb: { xs: 5, md: 5 },
          textAlign: 'center',
          zIndex: 10,
          position: 'relative',
          borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.5), transparent)',
        }}>
          <Typography
            variant="overline"
            sx={{
              display: 'inline-block',
              color: '#eee',
              fontSize: '0.85rem',
              fontWeight: 800,
              mb: 1,
            }}
          >
            サービス
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: '#FFFFFF',
              fontSize: '2rem',
              fontWeight: 900,
              letterSpacing: '1px',
              lineHeight: 1,
              mb: 3,
            }}
          >
            SERVICES
          </Typography>
          <Box sx={{
            width: '60px',
            height: '4px',
            bgcolor: '#f97316',
            mx: 'auto',
            borderRadius: '2px',
            boxShadow: '0 0 15px rgba(249, 115, 22, 0.4)',
          }} />
        </Box>
      </ScrollReveal>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>

        {/* Content Stack */}
        <Box sx={{
          position: 'relative', zIndex: 3, maxWidth: '900px', mx: 'auto',
          display: 'flex', flexDirection: 'column', width: '100%',
        }}>

          <FeatureBlock
            config={FEATURES.voting}
            isActive={hovered === 'voting'}
            hovered={hovered}
            setHovered={setHovered}
            index={0}
          >
            <VotingHUD hovered={hovered === 'voting'} />
          </FeatureBlock>

          {/* Ordinary Horizontal Divider */}
          <Box sx={{
            width: '100%',
            height: '1px',
            background: 'linear-gradient(to right, transparent 5%, rgba(255,255,255,0.1) 50%, transparent 95%)',
          }} />

          <FeatureBlock
            config={FEATURES.scheduling}
            isActive={hovered === 'scheduling'}
            hovered={hovered}
            setHovered={setHovered}
            index={1}
          >
            <SchedulingHUD hovered={hovered === 'scheduling'} />
          </FeatureBlock>

        </Box>
      </Box>
    </Box>
  );
}