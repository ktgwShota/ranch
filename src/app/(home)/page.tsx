'use client';

import { Box } from '@mui/material';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FeaturesSection from './FeaturesSection';
import AboutSection from './AboutSection';
import HowToUseSection from './HowToUseSection';
import BottomCTASection from './CtaSection';
import HeroSection from './HeroSection';
import { FAQ_ITEMS } from './constants';
import FaqSection from './FAQSection';

// Since this is a client component, metadata export is not supported directly.
// We should move metadata to layout.tsx or a separate server page wrapper if needed.
// However, for this task, we will keep the schema scripts.

export default function Index() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Hero Animations (Deep Dive Effect)
  // Scale down slightly and fade out as user scrolls down
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5], ["0px", "40px"]);
  const filter = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(10px)"]);

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ChoisuR",
    "url": "https://choisur.jp"
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChoisuR",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "description": "ChoisuR（チョイスル）は無料のオンライン多数決アプリです。食事会 / 交流会 / 旅行先の決定など、あらゆるシーンでご利用いただけます。"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Box sx={{ width: '100%', bgcolor: '#0B0F19' }} ref={containerRef}>

        {/* 1. Sticky Hero Container */}
        {/* The container is tall (e.g. 100vh) to allow scrolling, but the content sticks. 
            Actually, to make the scrub animation work, we might want the hero wrapper to be sticky 
            while we scroll *past* it. 
        */}
        <Box sx={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', zIndex: 0 }}>
          <motion.div style={{ scale, opacity, borderRadius, filter, originX: 0.5, originY: 0.5, height: '100%', width: '100%' }}>
            <HeroSection />
          </motion.div>
        </Box>

        {/* 2. Content Overlay (About & others) */}
        {/* We need margin-top so this starts *after* the initial view, or overlaps correctly.
            Since Hero is sticky top:0 for 100vh, we need to make sure this content 
            scrolls *into* view. 
        */}
        <Box sx={{ position: 'relative', zIndex: 10, bgcolor: '#020617', }}>
          <AboutSection />
          {/* <FeaturesSection /> */}
          <HowToUseSection />
          {/* <BottomCTASection /> */}
          <FaqSection />
        </Box>

      </Box>
    </>
  );
}
