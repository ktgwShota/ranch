'use client';

import React, { useRef } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * スクロールエフェクトのサンプルギャラリー
 */
export default function ScrollGalleryPage() {
  return (
    <Box sx={{ bgcolor: '#050810', color: 'white', minHeight: '100vh' }}>
      {/* Introduction */}
      <Box sx={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Container>
          <Typography variant="h2" fontWeight={800} gutterBottom>
            Scroll Effects Gallery
          </Typography>
          <Typography variant="h5" color="rgba(255,255,255,0.6)">
            モダンなウェブサイトで使われる主なスクロール演出のサンプルです。
            <br />下にスクロールして体験してください。
          </Typography>
        </Container>
      </Box>

      {/* 1. Scale Down Reveal (ヒーローセクションでよく使われる) */}
      <SectionTitle title="1. Scale Down Reveal" subtitle="スクロールすると前面の要素が奥へ縮小し、次が出てくる演出" />
      <ScaleDownSection />

      {/* 2. Stacking Cards (セクションが重なっていく) */}
      <SectionTitle title="2. Stacking Cards" subtitle="カードが順番に積み上がっていくような演出" />
      <StackingCardsSection />

      {/* 3. Horizontal Scroll (横スクロール) */}
      <SectionTitle title="3. Horizontal Scroll" subtitle="縦スクロール中に横方向の動きを入れる演出" />
      <HorizontalScrollSection />

      {/* 4. Parallax Effect (視差効果) */}
      <SectionTitle title="4. Parallax Effect" subtitle="背景と前景の速度を変えて奥行きを出す演出" />
      <ParallaxSection />

      <Box sx={{ height: '50vh' }} />
    </Box>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>{title}</Typography>
      <Typography variant="h6" color="rgba(255,255,255,0.5)">{subtitle}</Typography>
    </Container>
  );
}

// --- 1. Scale Down Reveal ---
function ScaleDownSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <Box ref={containerRef} sx={{ height: '200vh', position: 'relative' }}>
      <motion.div
        style={{
          scale,
          opacity,
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '40px',
          margin: '0 20px',
          overflow: 'hidden'
        }}
      >
        <Typography variant="h2">奥へ消えていく...</Typography>
      </motion.div>
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3">次のコンテンツが登場</Typography>
      </Box>
    </Box>
  );
}

// --- 2. Stacking Cards ---
function StackingCardsSection() {
  const cards = [
    { title: 'Step 01', color: '#3b82f6' },
    { title: 'Step 02', color: '#8b5cf6' },
    { title: 'Step 03', color: '#ec4899' },
    { title: 'Step 04', color: '#f59e0b' },
  ];

  return (
    <Container sx={{ pb: 20 }}>
      {cards.map((card, i) => (
        <Box
          key={i}
          sx={{
            position: 'sticky',
            top: 100 + i * 40,
            height: '60vh',
            mb: '10vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: card.color,
            borderRadius: '32px',
            boxShadow: '0 -20px 40px rgba(0,0,0,0.3)',
          }}
        >
          <Typography variant="h2" fontWeight={800}>{card.title}</Typography>
        </Box>
      ))}
    </Container>
  );
}

// --- 3. Horizontal Scroll ---
function HorizontalScrollSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} style={{ height: "400vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <motion.div style={{ x, display: "flex", gap: "40px", padding: "0 100px" }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Paper
              key={item}
              elevation={0}
              sx={{
                minWidth: "60vw",
                height: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "24px",
                backdropFilter: "blur(10px)"
              }}
            >
              <Typography variant="h1" fontWeight={900}>{item}</Typography>
            </Paper>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- 4. Parallax Effect ---
function ParallaxSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["-50%", "50%"]);

  return (
    <Box
      ref={ref}
      sx={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050810'
      }}
    >
      {/* Background Layer (Moves Slower) */}
      <motion.div
        style={{
          y: yBg,
          position: 'absolute',
          fontSize: '20vw',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.03)',
          whiteSpace: 'nowrap',
          zIndex: 0
        }}
      >
        PARALLAX PARALLAX PARALLAX
      </motion.div>

      {/* Foreground Layer (Moves Faster) */}
      <motion.div style={{ y: yText, zIndex: 1, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight={800}>奥行きを感じる動き</Typography>
        <Typography variant="h5" color="rgba(255,255,255,0.7)">背景と文字の速度が違います</Typography>
      </motion.div>
    </Box>
  );
}
