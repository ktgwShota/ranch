import { Box } from '@mui/material';
import { Metadata } from 'next';
import AboutSection from './AboutSection';
import HowToUseSection from './HowToUseSection';
import BottomCTASection from './CtaSection';
import HeroSection from './HeroSection';
import FaqSection from './FaqSection';
import { FAQ_ITEMS } from './constants';

export const metadata: Metadata = {
  title: 'ChoisuR | 日程調整 / 店決め（多数決）ツール',
  description: 'ChoisuR（チョイスル）は、飲み会やイベントの日程調整 / 店決め（多数決）をサポートする完全無料のツールです。会員登録やログインは不要。PC・スマホから誰でも簡単にご利用いただけます。',
  alternates: {
    canonical: 'https://choisur.jp',
  },
  openGraph: {
    title: 'ChoisuR | 日程調整 / 店決め（多数決）ツール',
    description: 'ChoisuR（チョイスル）は、飲み会やイベントの日程調整 / 店決め（多数決）をサポートする完全無料のツールです。会員登録やログインは不要。PC・スマホから誰でも簡単にご利用いただけます。',
    url: 'https://choisur.jp',
    siteName: 'ChoisuR',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChoisuR | 日程調整 / 店決め（多数決）ツール',
    description: 'ChoisuR（チョイスル）は、飲み会やイベントの日程調整 / 店決め（多数決）をサポートする完全無料のツールです。会員登録やログインは不要。PC・スマホから誰でも簡単にご利用いただけます。',
  },
};

export default function Index() {
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
    "description": "ChoisuR（チョイスル）は無料のオンライン多数決ツールです。食事会 / 交流会 / 旅行先の決定など、あらゆるシーンでご利用いただけます。"
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

      <Box sx={{ width: '100%' }}>
        <HeroSection />
        <AboutSection />
        <HowToUseSection />
        <BottomCTASection />
        <FaqSection />
      </Box>
    </>
  );
}
