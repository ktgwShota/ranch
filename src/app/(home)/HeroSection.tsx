'use client';

import { Box, Container, Typography, Stack, Button, Avatar, AvatarGroup } from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  KeyboardArrowRight as ArrowForwardIcon,
  Restaurant as RestaurantIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import { Dialog, IconButton, Grid } from '@mui/material';
import { InteractiveHoneycomb } from './InteractiveHoneycomb';




import BrowserWindow from '@/components/ui/BrowserWindow';

const TITLE_1 = '公平な意思決定を。';
const SUBTITLE = '『誰かの一存』から『みんなの合意』へ。\n全員の想いをリアルタイムに反映することで誰もが納得できる意思決定を導き出します。';

// アニメーションのタイミングを再定義
// 1. TITLE: 0.5s 開始 (9文字 * 0.11 = 0.99s + 0.5s duration = 1.99s で完了)
// 2. SUBTITLE: 2.2s 開始 (TITLE完了後に少し余韻を置く)
// 3. CARD & BUTTONS: 3.3s 開始 (SUBTITLE表示完了後に開始)
const ANIMATION_DELAYS = {
  TITLE: 0.5,
  SUBTITLE: 2.2,
  BUTTONS: 3.3,
  CARD: 3.3,
  ARROW: 4.5,
};

export default function HeroSection() {
  const [openSelectionDialog, setOpenSelectionDialog] = useState(false);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('introduction-section');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      id="hero-section"
      sx={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        backgroundColor: '#0B0F19',
        overflow: 'hidden',
      }}
    >
      {/* Background Decor Layer */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>

        {/* Bottom Ambient Glow (Devin style) */}
        <Box sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1000%',
          height: '25%',
          background: 'radial-gradient(ellipse at center, rgba(34, 211, 238, 0.35) 0%, transparent 75%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />

        {/* Fullscreen Interactive Honeycomb Grid */}
        {/* <InteractiveHoneycomb delay={ANIMATION_DELAYS.ARROW} /> */}
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >


        <Container
          maxWidth={false}
          sx={{
            maxWidth: '900px',
            position: 'relative',
            zIndex: 10,
            py: { xs: 8, md: 0 }
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="space-between"
            gap={3}
          >
            {/* 左側: テキストエリア */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: ANIMATION_DELAYS.TITLE }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' },
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.2,
                    mb: 1,
                    color: '#fff',
                  }}
                >
                  {Array.from(TITLE_1).map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.5,
                        delay: ANIMATION_DELAYS.TITLE + index * 0.11,
                        ease: 'easeOut'
                      }}
                      style={{ display: 'inline-block' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </Typography>
              </motion.div>

              <Box
                sx={{
                  mt: 3,
                  mb: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                {SUBTITLE.split('\n').map((line, index) => (
                  <Box key={index} sx={{ overflow: 'hidden' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: ANIMATION_DELAYS.SUBTITLE,
                        ease: [0.33, 1, 0.68, 1] // スムーズなイージング
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                          color: 'rgba(255,255,255,0.6)',
                          lineHeight: 1.7,
                          mx: { xs: 'auto', md: 0 },
                        }}
                      >
                        {line}
                      </Typography>
                    </motion.div>
                  </Box>
                ))}
              </Box>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: ANIMATION_DELAYS.BUTTONS }}
              >
                <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrowIcon />}

                    onClick={() => setOpenSelectionDialog(true)}
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 800,
                      background: '#FFFFFF',
                      color: '#0B0F19',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.2, 1, 0.3, 1)',
                      textTransform: 'none',
                    }}
                  >
                    今すぐ始める
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PlayArrowIcon />}
                    onClick={scrollToAbout}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderColor: '#fff',
                        background: 'rgba(255,255,255,0.1)',
                      },
                      transition: 'all 0.3s ease',
                      textTransform: 'none',
                    }}
                  >
                    使い方を見る
                  </Button>
                </Stack>
              </motion.div>
            </Box>

            {/* 右側: ライブプレビューカード */}
            <Box
              sx={{
                flex: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                perspective: '1000px',
                position: 'relative',
                mt: { xs: 4, md: 0 },
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: ANIMATION_DELAYS.CARD }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0
                }}
              >
                {/* Circular ambient glow for the card itself */}
                <Box
                  sx={{
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(34, 211, 238, 0.05) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -10, rotateX: 5 }}
                animate={{ opacity: 1, scale: 1, rotateY: -5, rotateX: 0 }}
                transition={{ duration: 1.2, delay: ANIMATION_DELAYS.CARD }}
                style={{ position: 'relative', zIndex: 1, width: '100%' }}
              >
                <PreviewCard />
              </motion.div>
            </Box>
          </Stack>
        </Container>

        <ScrollArrow delay={ANIMATION_DELAYS.ARROW} />
      </Box>

      <CreateSelectionDialog open={openSelectionDialog} onClose={() => setOpenSelectionDialog(false)} />
    </Box>
  );
}

function PreviewCard() {
  const dates = [
    { date: '12/25', day: '(木)', score: 4, total: 4, bg: '#f0f9f0' },
    { date: '12/26', day: '(金)', score: 4, total: 4, bg: '#f0f9f0' },
    { date: '12/27', day: '(土)', score: 1, total: 4, bg: 'white' },
    { date: '12/28', day: '(日)', score: 4, total: 4, bg: '#f0f9f0' },
  ];

  const users = [
    { name: '北川', answers: ['ok', 'ok', 'ok', 'ok'] },
    { name: '田中', answers: ['ok', 'ok', 'ng', 'ok'] },
    { name: '佐藤', answers: ['ng', 'ok', 'ok', 'ok'] },
    { name: '鈴木', answers: ['ok', 'ok', 'ok', 'maybe'] },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckIcon sx={{ color: '#22c55e', fontSize: 24 }} />;
      case 'ng': return <CloseIcon sx={{ color: '#f43f5e', fontSize: 24 }} />;
      case 'maybe': return <Typography sx={{ color: '#f59e0b', fontSize: 22, fontWeight: 800 }}>?</Typography>;
      default: return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <BrowserWindow address="https://choisur.jp/schedule/demo">
        <Box sx={{ bgcolor: 'white', color: '#0f172a', border: '1px solid #e2e8f0', borderBottom: 0, m: 1.5 }}>
          {/* Header Row */}
          <Box sx={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
            <Box sx={{ width: 100, flexShrink: 0, borderRight: '1px solid #e2e8f0' }} />
            {dates.map((item, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  p: 1.5,
                  bgcolor: item.bg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRight: i === dates.length - 1 ? 'none' : '1px solid #e2e8f0',
                }}
              >
                <Typography sx={{ fontSize: '13px', fontWeight: 800 }}>
                  {item.date} <Box component="span" sx={{ fontSize: '11px' }}>{item.day}</Box>
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#64748b', mb: 0.5 }}>19:00 〜</Typography>
                <Box sx={{ width: '80%', height: 5, bgcolor: '#e2e8f0', borderRadius: 3, mb: 0.5 }}>
                  <Box
                    sx={{
                      width: `${(item.score / item.total) * 100}%`,
                      height: '100%',
                      bgcolor: item.score >= 3 ? '#4caf50' : item.score > 1 ? '#f59e0b' : '#cbd5e1',
                      borderRadius: 3
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: item.score >= 3 ? '#4caf50' : item.score > 0 ? '#f59e0b' : '#f43f5e' }}>
                  {item.score}/{item.total}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* User Rows */}
          {users.map((user, i) => (
            <Box key={i} sx={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
              <Box
                sx={{
                  width: 100,
                  flexShrink: 0,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  borderRight: '1px solid #e2e8f0',
                }}
              >
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                  {user.name}
                </Typography>
              </Box>
              {user.answers.map((status, j) => (
                <Box
                  key={j}
                  sx={{
                    flex: 1,
                    p: 1.5,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRight: j === user.answers.length - 1 ? 'none' : '1px solid #e2e8f0',
                    bgcolor: dates[j].bg === '#f0f9f0' ? '#f8fdf8' : 'white'
                  }}
                >
                  {getStatusIcon(status)}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </BrowserWindow>
    </Box>
  );
}



function ScrollArrow({ delay }: { delay: number }) {
  const handleClick = useCallback(() => {
    const nextSection = document.getElementById('about-section');
    if (!nextSection) return;

    const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000; // Slower duration in ms
    let start: number | null = null;

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function: easeInOutCubic
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        translateX: '-50%',
        cursor: 'pointer',
        zIndex: 10,
        textAlign: 'center',
      }}
      onClick={handleClick}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <KeyboardArrowDownIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '2.5rem' }} />
      </motion.div>
    </motion.div>
  );
}

function CreateSelectionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const options = [
    {
      title: '店決め',
      subtitle: 'RESTAURANT VOTING',
      description: '行きたいお店の候補を出し、多数決で決定。',
      icon: <RestaurantIcon sx={{ fontSize: '2.5rem' }} />,
      href: '/polls/create',
      color: '#f97316',
      glow: 'rgba(249, 115, 22, 0.3)',
    },
    {
      title: '日程調整',
      subtitle: 'SCHEDULE ADJUSTMENT',
      description: '全員が空いている日を可視化して開催日を特定。',
      icon: <CalendarMonthIcon sx={{ fontSize: '2.5rem' }} />,
      href: '/schedule/create',
      color: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.3)',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0a0f1c',
          backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(15, 23, 42, 0.8) 0%, transparent 50%)',
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          position: 'relative',
        },
      }}
    >
      <Box sx={{ p: { xs: 3, md: 5 }, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'rgba(255, 255, 255, 0.4)',
            '&:hover': { color: '#fff', bgcolor: 'rgba(255, 255, 255, 0.05)' },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
            どちらの機能を使用しますか？
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            用途に合わせて最適なツールをお選びください
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {options.map((opt, i) => (
            <Grid size={{ xs: 12, sm: 6 }} key={i}>
              <Box
                component={Link}
                href={opt.href}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: '24px',
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  gap: 2.5,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: opt.color,
                    bgcolor: 'rgba(255, 255, 255, 0.06)',
                    boxShadow: `0 12px 40px -10px ${opt.glow}`,
                    '& .opt-icon': {
                      color: opt.color,
                      transform: 'scale(1.1) rotate(-5deg)',
                    }
                  }
                }}
              >a
                <Box
                  className="opt-icon"
                  sx={{
                    flexShrink: 0,
                    width: { xs: 50, md: 64 },
                    height: { xs: 50, md: 64 },
                    borderRadius: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.4s ease',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {opt.icon}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="overline"
                    sx={{ color: opt.color, fontWeight: 800, letterSpacing: '0.1em', opacity: 0.8, display: 'block', mb: 0.5 }}
                  >
                    {opt.subtitle}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: '#fff', fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.25rem', md: '1.5rem' } }}
                  >
                    {opt.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, maxWidth: '400px' }}>
                    {opt.description}
                  </Typography>
                </Box>

                <ArrowForwardIcon
                  className="opt-arrow"
                  sx={{
                    color: opt.color,
                    opacity: 0.3,
                    fontSize: '1.2rem',
                    ml: 'auto'
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Dialog>
  );
}

