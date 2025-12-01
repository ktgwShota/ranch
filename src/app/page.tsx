'use client';

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Create as CreateIcon,
  Share as ShareIcon,
  Restaurant as RestaurantIcon,
  Lock as LockIcon,
  FlashOn as FlashOnIcon,
  Group as GroupIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import Link from 'next/link';

const HEADER_HEIGHT = 80;
const CONTAINER_MAX_WIDTH = '960px';

const ANIMATION_DELAYS = {
  TITLE_START: 300,
  SUBTITLE_DELAY: 200,
  SUBTITLE_ANIMATION: 600,
  TYPING_COMPLETE_DELAY: 300,
  ARROW_DELAY: 1100,
  STEP_STAGGER: 100,
  FAQ_STAGGER: 100,
  FAQ_FIRST_ITEM_DELAY: 200,
} as const;

const TYPING_SPEED = 150;
const INTERSECTION_THRESHOLD = 0.5;
const FULL_VISIBILITY_THRESHOLD = 0.8;

type StepData = {
  step: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
};

type FAQItem = {
  question: string;
  answer: string;
};

const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement | null>,
  threshold: number,
  callback: (isIntersecting: boolean, intersectionRatio: number) => void
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        callback(entry.isIntersecting, entry.intersectionRatio);
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [ref, threshold, callback]);
};

const useScrollPosition = (callback: (scrollY: number) => void) => {
  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY) >= 1) {
          lastScrollY = currentScrollY;
          callback(currentScrollY);
        }
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [callback]);
};

function useElementVisibility(ref: React.RefObject<HTMLElement | null>, threshold: number) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold]);

  return isVisible;
}

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

const fadeInStyles = (isVisible: boolean, delay = '0s') => ({
  opacity: isVisible ? 1 : 0,
  transition: `opacity 1.2s ease ${delay}`,
});

export default function Index() {
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);

  const handleTypingComplete = useCallback(() => {
    setTimeout(() => setIsScrollEnabled(true), ANIMATION_DELAYS.ARROW_DELAY);
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <HeroSection
        isScrollEnabled={isScrollEnabled}
        onTypingComplete={handleTypingComplete}
      />
      <AboutSection />
      <HowItWorksSection />
      <BottomCTASection />
      <FAQSection />
    </Box>
  );
}

function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(
    sectionRef,
    0.2,
    useCallback((isIntersecting) => {
      if (isIntersecting) setIsVisible(true);
    }, [])
  );

  const features = [
    {
      title: '会員登録なしで即スタート',
      description: '面倒なアカウント登録やログインは一切不要。誰でもすぐに投票を作成できます。',
      icon: <FlashOnIcon sx={{ fontSize: 40 }} />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      title: 'URLをシェアするだけ',
      description: '投票ページを作成してURLを共有。LINEやSlackで簡単にメンバーを招待できます。',
      icon: <LinkIcon sx={{ fontSize: 40 }} />,
      color: '#0ea5e9',
      bgColor: '#f0f9ff',
    },
    {
      title: '全員で決める公平性',
      description: '多数決で行き先を決めることで全員の意見を尊重した公平な意思決定をサポートします。',
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
    },
  ];

  return (
    <Box
      ref={sectionRef}
      id="about-section"
      sx={{
        py: { xs: 10, md: 12 },
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景装飾 */}
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
        <Box
          sx={{
            textAlign: 'center',
            mb: 10,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
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
            ChoisuR はイベントの行き先を公平に決めるための多数決ツールです。
            <br />
            食事会 / 交流会 / 社員旅行など、あらゆるシーンでご利用いただけます。
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 4, md: 5 },
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: 'white',
                p: { xs: 4, md: 5 },
                borderRadius: 6,
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
                textAlign: 'center',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15 + 0.2}s`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                borderTop: `4px solid ${feature.color}`, // アクセントボーダー
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 40px -10px ${feature.color}25`, // 色付きシャドウ
                },
              }}
            >
              <Box
                sx={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  bgcolor: feature.bgColor,
                  color: feature.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {feature.icon}
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 2.5,
                  color: 'text.primary',
                  fontSize: '1.25rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {feature.title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '1rem' }}>
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* 境界線の点線 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          borderBottom: '6px dashed #3b82f6',
          opacity: 0.75,
        }}
      />
    </Box>
  );
}

function HeroSection({
  isScrollEnabled,
  onTypingComplete
}: {
  isScrollEnabled: boolean;
  onTypingComplete?: () => void;
}) {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = '"幹事の悩み" を解決。';

  const startTyping = useCallback(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, TYPING_SPEED);
  }, [fullText]);

  useEffect(() => {
    setIsOverlayVisible(true);
    setTimeout(() => {
      setIsTitleVisible(true);
      startTyping();
    }, ANIMATION_DELAYS.TITLE_START);
  }, [startTyping]);

  useEffect(() => {
    setShowCursor(displayedText.length < fullText.length);
  }, [displayedText.length, fullText.length]);

  useEffect(() => {
    if (displayedText.length === fullText.length && displayedText.length > 0) {
      const timeoutId = setTimeout(() => {
        setIsSubtitleVisible(true);
        onTypingComplete?.();
      }, ANIMATION_DELAYS.TYPING_COMPLETE_DELAY);

      return () => clearTimeout(timeoutId);
    }
  }, [displayedText.length, fullText.length, onTypingComplete]);

  const handleScrollToHowItWorks = useCallback(() => {
    const nextSection = document.getElementById('about-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      const howItWorksSection = document.getElementById('hot-to-use');
      howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <Box
      id="hero-section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        pt: `${HEADER_HEIGHT / 2}px`,
        backgroundImage: 'url(/hero-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
          opacity: isOverlayVisible ? 1 : 0,
          transition: 'opacity 1.2s ease',
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: CONTAINER_MAX_WIDTH,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.25rem', md: '2.75rem' },
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.2,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
            opacity: isTitleVisible ? 1 : 0,
            transform: isTitleVisible
              ? 'translateY(0) scale(1)'
              : 'translateY(50px) scale(0.9)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            minHeight: { xs: '3.6rem', md: '4.32rem' },
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {displayedText}
          {showCursor && (
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: '2px',
                height: { xs: '2.5rem', md: '3rem' },
                backgroundColor: 'white',
                marginLeft: '2px',
              }}
            />
          )}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.15rem' },
            color: 'rgba(255, 255, 255, 0.95)',
            maxWidth: '700px',
            mx: 'auto',
            mt: 3,
            mb: 4,
            lineHeight: 1.6,
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)',
            opacity: isSubtitleVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.2s',
          }}
        >
          行き先に悩む時代はもう終わり。目的地は全員で決める。
          <br />
          ChoisuR なら公平に全員の意思を反映した目的地が決まります。
        </Typography>
      </Container>

      <Box
        onClick={handleScrollToHowItWorks}
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          cursor: isScrollEnabled ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          opacity: isScrollEnabled ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: isScrollEnabled ? 'auto' : 'none',
          '&:hover': {
            transform: isScrollEnabled ? 'translateX(-50%) translateY(5px)' : 'translateX(-50%)',
            transition: 'transform 0.3s ease',
          },
        }}
      >
        <KeyboardArrowDownIcon
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '2.5rem',
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)',
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 100%': {
                transform: 'translateY(0)',
              },
              '50%': {
                transform: 'translateY(10px)',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}

const StepItem = React.forwardRef<
  HTMLDivElement,
  {
    step: StepData;
    index: number;
    isVisible?: boolean;
  }
>(({ step, index, isVisible: parentIsVisible }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  const shouldUseParentControl = parentIsVisible !== undefined;
  const finalIsVisible = shouldUseParentControl ? parentIsVisible : isVisible;

  useIntersectionObserver(
    stepRef,
    INTERSECTION_THRESHOLD,
    useCallback(
      (isIntersecting, intersectionRatio) => {
        if (!shouldUseParentControl && isIntersecting && intersectionRatio >= INTERSECTION_THRESHOLD) {
          setIsVisible(true);
        }
      },
      [shouldUseParentControl]
    )
  );

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else if ('current' in ref) {
          ref.current = node;
        }
      }
      stepRef.current = node;
    },
    [ref]
  );

  const translateX = isEven ? (finalIsVisible ? 0 : -50) : (finalIsVisible ? 0 : 50);
  const delay = index === 0 ? '0.2s' : `${index * 0.1}s`;

  return (
    <Box
      ref={mergedRef}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 10,
        opacity: finalIsVisible ? 1 : 0,
        transform: `translateX(${translateX}px)`,
        transition: `opacity 0.5s ease ${delay}, transform 0.5s ease ${delay}`,
      }}
    >
      <Box
        sx={{
          flex: { xs: 1, md: 0.55 },
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
          {step.step}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          {step.icon}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: '1.75rem',
            }}
          >
            {step.title}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '1.125rem' }}
        >
          {step.description}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: { xs: 1, md: 0.4 },
          display: 'flex',
          justifyContent: { xs: 'center', md: isEven ? 'flex-end' : 'flex-start' },
          alignItems: 'flex-start',
          order: { xs: 2, md: isEven ? 2 : 1 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', md: 420 },
            aspectRatio: '4 / 3',
            borderRadius: 3,
            overflow: 'hidden',
            background: isEven
              ? 'linear-gradient(135deg, rgba(191,219,254,0.4), rgba(59,130,246,0.1))'
              : 'linear-gradient(135deg, rgba(254,215,170,0.4), rgba(251,146,60,0.1))',
            border: '1px solid rgba(15,23,42,0.08)',
            boxShadow: '0 25px 50px rgba(15,23,42,0.2)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 12,
              borderRadius: 2,
              backgroundColor: '#fff',
              boxShadow: '0 18px 40px rgba(15,23,42,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <Box
              component="img"
              src={step.imageSrc}
              alt={step.imageAlt}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 1.5,
              }}
            />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: isEven
                ? 'radial-gradient(circle, rgba(59,130,246,0.35), rgba(59,130,246,0))'
                : 'radial-gradient(circle, rgba(251,146,60,0.35), rgba(251,146,60,0))',
              top: -40,
              right: -20,
              filter: 'blur(8px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(15,23,42,0.15), transparent)',
              bottom: -50,
              left: '20%',
              filter: 'blur(20px)',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
});

StepItem.displayName = 'StepItem';

const STEPS: StepData[] = [
  {
    step: 'ステップ1',
    title: '投票を作成',
    description: '候補となる行き先の情報を入力して投票用のページを作成します。',
    imageSrc: '/1.png',
    imageAlt: '投票作成画面',
    icon: <CreateIcon sx={{ fontSize: '1.5rem', color: '#3b82f6' }} />,
  },
  {
    step: 'ステップ2',
    title: '投票を待つ',
    description: '作成した投票ページを LINE や Slack などの SNS で共有して投票が終わるのを待ちます。',
    imageSrc: '/2.png',
    imageAlt: '投票ページ共有画面',
    icon: <ShareIcon sx={{ fontSize: '1.5rem', color: '#3b82f6' }} />,
  },
  {
    step: 'ステップ3',
    title: '行き先が決定',
    description: '投票受付時間に達すると投票結果が公開されます。',
    imageSrc: '/3.png',
    imageAlt: '投票結果画面',
    icon: <RestaurantIcon sx={{ fontSize: '1.5rem', color: '#3b82f6' }} />,
  },
];

function HowItWorksSection() {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const [isStep1Visible, setIsStep1Visible] = useState(false);
  const step1Ref = useRef<HTMLDivElement>(null);

  useIntersectionObserver(
    step1Ref,
    INTERSECTION_THRESHOLD,
    useCallback((isIntersecting, intersectionRatio) => {
      if (isIntersecting && intersectionRatio >= INTERSECTION_THRESHOLD) {
        setIsTitleVisible(true);
        setTimeout(() => setIsSubtitleVisible(true), ANIMATION_DELAYS.STEP_STAGGER);
        setTimeout(() => setIsStep1Visible(true), ANIMATION_DELAYS.STEP_STAGGER * 2);
      }
    }, [])
  );

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
        <Typography variant="h2" sx={{ ...sectionTitleStyles, ...fadeInStyles(isTitleVisible) }}>
          How To Use
        </Typography>
        <Typography
          variant="body1"
          sx={{
            ...sectionSubtitleStyles,
            maxWidth: '600px',
            mb: 10,
            ...fadeInStyles(isSubtitleVisible),
          }}
        >
          利用方法
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, md: 12 } }}>
          {STEPS.map((step, index) => (
            <Fragment key={index}>
              <StepItem
                step={step}
                index={index}
                ref={index === 0 ? step1Ref : undefined}
                isVisible={index === 0 ? isStep1Visible : undefined}
              />
              {index < STEPS.length - 1 && (
                <Box
                  sx={{
                    height: 2,
                    width: '100vw',
                    position: 'relative',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(90deg, rgba(148,163,184,0), rgba(148,163,184,0.35), rgba(148,163,184,0))',
                    opacity: 0.6,
                  }}
                />
              )}
            </Fragment>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: '利用料金はかかりますか？',
    answer: '無料でご利用いただけます。',
  },
  {
    question: '利用するにはアカウント登録が必要ですか？',
    answer: 'アカウント登録は不要です。',
  },
  {
    question: '対応しているブラウザを教えてくれますか？',
    answer:
      '本アプリは最新バージョンの Google Chrome / Safari のみをサポートしております。古いバージョンの Google Chrome / Safari または その他のブラウザ（Microsoft Edge / Firefox など）はサポート外です。',
  },
  {
    question: 'シークレットモード / プライベートモード に対応していますか？',
    answer:
      'シークレットモード / プライベートモード には対応していません。必ず標準モードをご利用ください。',
  },
];

function FAQSection() {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const [isFirstItemVisible, setIsFirstItemVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const secondItemRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useIntersectionObserver(
    secondItemRef,
    INTERSECTION_THRESHOLD,
    useCallback(
      (isIntersecting, intersectionRatio) => {
        if (isIntersecting && intersectionRatio >= INTERSECTION_THRESHOLD) {
          setIsTitleVisible(true);
          setTimeout(() => setIsSubtitleVisible(true), ANIMATION_DELAYS.FAQ_STAGGER);
          setTimeout(() => {
            setIsFirstItemVisible(true);
            setVisibleItems((prev) => new Set([...prev, 0]));

            for (let index = 1; index < FAQ_ITEMS.length; index++) {
              setTimeout(() => {
                setVisibleItems((prev) => new Set([...prev, index]));
              }, ANIMATION_DELAYS.FAQ_FIRST_ITEM_DELAY + index * ANIMATION_DELAYS.FAQ_STAGGER);
            }
          }, ANIMATION_DELAYS.FAQ_STAGGER * 2);
        }
      },
      []
    )
  );

  return (
    <Box
      id="faq"
      sx={{
        pt: { xs: 8, md: 10 },
        pb: { xs: 4, md: 5 },
        backgroundColor: 'white',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: CONTAINER_MAX_WIDTH }}>
        <Typography variant="h2" sx={{ ...sectionTitleStyles, ...fadeInStyles(isTitleVisible) }}>
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="body1"
          sx={{
            ...sectionSubtitleStyles,
            mb: 10,
            ...fadeInStyles(isSubtitleVisible),
          }}
        >
          よくある質問
        </Typography>

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {FAQ_ITEMS.map((item, idx) => (
            <Accordion
              key={idx}
              ref={(node) => {
                if (idx === 1) {
                  secondItemRef.current = node;
                } else {
                  itemRefs.current[idx] = node;
                }
              }}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px !important',
                mb: 2,
                boxShadow: 'none',
                '&:before': { display: 'none' },
                opacity: idx === 0 ? (isFirstItemVisible ? 1 : 0) : (visibleItems.has(idx) ? 1 : 0),
                transform:
                  idx === 0
                    ? isFirstItemVisible
                      ? 'translateY(0)'
                      : 'translateY(20px)'
                    : visibleItems.has(idx)
                      ? 'translateY(0)'
                      : 'translateY(20px)',
                transition:
                  idx === 0
                    ? 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s'
                    : `opacity 0.6s ease ${idx * 0.1}s, transform 0.6s ease ${idx * 0.1}s`,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: 3,
                  py: 2,
                  minHeight: '64px',
                  '&.Mui-expanded': {
                    minHeight: '64px',
                  },
                  '& .MuiAccordionSummary-content': {
                    my: 0,
                    '&.Mui-expanded': {
                      my: 0,
                    },
                  },
                }}
              >
                <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}


function BottomCTASection() {
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 既存のアニメーションロジックは維持
  // const isSectionVisible = useElementVisibility(sectionRef, FULL_VISIBILITY_THRESHOLD);
  // useEffect(() => {
  //   if (isSectionVisible) {
  //     setIsBackgroundVisible(true);
  //     setIsTitleVisible(true);
  //     setTimeout(() => setIsButtonVisible(true), ANIMATION_DELAYS.SUBTITLE_DELAY * 2);
  //   }
  // }, [isSectionVisible]);

  // デモのためアニメーションを無効化
  useEffect(() => {
    setIsBackgroundVisible(true);
    setIsTitleVisible(true);
    setIsButtonVisible(true);
  }, []);

  // --- 新しいカラースキーム ---
  const DARK_NAVY = '#1e293b'; // 背景色
  const TEAL_ACCENT = '#2dd4bf'; // アクセントカラー（ボタン、アイコン）
  const LIGHT_TEXT = '#f8fafc'; // テキスト色
  const SUBTLE_TEXT = '#94a3b8'; // サブテキスト色

  const features: Array<{ icon: React.ComponentType<any>; text: string }> = [
    { icon: CheckCircleIcon, text: '無料' },
    { icon: LockIcon, text: '匿名使用可能' },
  ];

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        // 背景をダークカラーに変更
        background: DARK_NAVY,
        pt: { xs: 12, md: 16 },
        pb: { xs: 12, md: 16 },
        overflow: 'hidden',
        opacity: isBackgroundVisible ? 1 : 0,
        transition: 'opacity 1.2s ease',
      }}
    >
      {/* 背景に円形グラデーションを追加して奥行きを出す */}
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
            opacity: isTitleVisible ? 1 : 0,
            transform: isTitleVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
          }}
        >
          {/* メイン見出し */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 900, // 極太フォント
              lineHeight: 1.1,
              mb: 3,
              color: LIGHT_TEXT,
              textShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            全員の<Box component="span" sx={{ color: TEAL_ACCENT }}>
              意思</Box>を反映
          </Typography>

          {/* 説明文 */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: SUBTLE_TEXT,
              lineHeight: 1.7,
              mb: 6,
            }}
          >
            xxx
            <br />
            ChoisuRを使うことで誰でも簡単に全員が納得するイベントや場所決めができます。
          </Typography>

          {/* CTAボタン */}
          <Button
            component={Link}
            href="/polls/create"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: TEAL_ACCENT,
              color: DARK_NAVY, // ボタン内の文字色
              borderRadius: '9999px',
              px: { xs: 2, md: 3 },
              py: { xs: 1.5, md: 2 },
              fontSize: { xs: '1rem', md: '1rem' },
              fontWeight: 700,
              textTransform: 'none',
              // 立体的なシャドウ（アクセントカラー）
              boxShadow: `0 15px 30px -10px ${TEAL_ACCENT}50`,
              opacity: isButtonVisible ? 1 : 0,
            }}
          >
            今すぐ始める
          </Button>

          {/* 特典表示をアイコン付きで横並びに */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 3, md: 3 },
              mt: 6, // ボタンからより離す
              opacity: isButtonVisible ? 1 : 0,
              transition: 'opacity 0.6s ease 0.7s',
            }}
          >
            {features.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <item.icon sx={{ fontSize: '1.5rem', color: TEAL_ACCENT }} />
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: SUBTLE_TEXT }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
