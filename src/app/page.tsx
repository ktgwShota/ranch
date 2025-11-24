'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import React from 'react';
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
  color: '#1f2937',
  textAlign: 'center' as const,
  mb: 2,
};

const sectionSubtitleStyles = {
  fontWeight: 'bold' as const,
  fontSize: '1.125rem',
  color: '#6b7280',
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
      <HowItWorksSection />
      <BottomCTASection />
      <FAQSection />
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
  const fullText = '"幹事の時間" もっと大切に。';

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
    const howItWorksSection = document.getElementById('hot-to-use');
    howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
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
            fontSize: { xs: '2.5rem', md: '3rem' },
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
          店決めに悩む時代はもう終わり。行く店はみんなで決める。
          <br />
          チョイスルは店決めに悩む幹事のためのサービスを提供します。
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
        } else {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
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
        gap: 6,
        opacity: finalIsVisible ? 1 : 0,
        transform: `translateX(${translateX}px)`,
        transition: `opacity 0.5s ease ${delay}, transform 0.5s ease ${delay}`,
      }}
    >
      <Box
        sx={{
          flex: 1,
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
              color: '#1f2937',
              fontSize: '1.75rem',
            }}
          >
            {step.title}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ color: '#6b7280', lineHeight: 1.7, fontSize: '1.125rem' }}
        >
          {step.description}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: { xs: 'center', md: isEven ? 'flex-end' : 'flex-start' },
          alignItems: 'center',
          height: { xs: 'auto', md: '450px' },
          order: { xs: 2, md: isEven ? 2 : 1 },
        }}
      >
        <Box
          component="img"
          src={step.imageSrc}
          alt={step.imageAlt}
          sx={{
            width: { xs: '100%', md: '440px' },
            aspectRatio: 1,
            objectFit: 'contain',
            borderRadius: '8px',
          }}
        />
      </Box>
    </Box>
  );
});

StepItem.displayName = 'StepItem';

const STEPS: StepData[] = [
  {
    step: 'ステップ1',
    title: '投票作成',
    description: '候補となる店舗の URL を入力して投票作成しましょう。店舗名や画像は自動的に入力されます。',
    imageSrc: 'https://placehold.co/440x600/fed7aa/ffffff?text=Step+1',
    imageAlt: '投票作成画面',
    icon: <CreateIcon sx={{ fontSize: '1.5rem', color: '#3b82f6' }} />,
  },
  {
    step: 'ステップ2',
    title: '投票ページを共有',
    description: '作成した投票ページを LINE や Slack などの SNS で共有して、参加者の投票が終わるまで待ちます。',
    imageSrc: 'https://placehold.co/440x600/ccfbf1/ffffff?text=Step+2',
    imageAlt: '投票ページ共有画面',
    icon: <ShareIcon sx={{ fontSize: '1.5rem', color: '#3b82f6' }} />,
  },
  {
    step: 'ステップ3',
    title: 'お店が決定',
    description: '投票受付時間に達すると投票結果が公開されます。',
    imageSrc: 'https://placehold.co/440x600/ccfbf1/ffffff?text=Step+3',
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
            mb: 6,
            ...fadeInStyles(isSubtitleVisible),
          }}
        >
          利用方法
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, md: 12 } }}>
          {STEPS.map((step, index) => (
            <StepItem
              key={index}
              step={step}
              index={index}
              ref={index === 0 ? step1Ref : undefined}
              isVisible={index === 0 ? isStep1Visible : undefined}
            />
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
            mb: 4,
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
                  (secondItemRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
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
                <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <Typography sx={{ color: '#6b7280', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
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
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const isSectionVisible = useElementVisibility(sectionRef, FULL_VISIBILITY_THRESHOLD);

  useEffect(() => {
    if (isSectionVisible) {
      setIsBackgroundVisible(true);
      setIsTitleVisible(true);
      setTimeout(() => setIsDescriptionVisible(true), ANIMATION_DELAYS.SUBTITLE_DELAY);
      setTimeout(() => setIsButtonVisible(true), ANIMATION_DELAYS.SUBTITLE_DELAY * 2);
    }
  }, [isSectionVisible]);

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        pt: { xs: 10, md: 14 },
        pb: { xs: 10, md: 14 },
        background: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
        opacity: isBackgroundVisible ? 1 : 0,
        transition: 'opacity 1.2s ease',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: CONTAINER_MAX_WIDTH }}>
        <Box
          sx={{
            textAlign: 'center',
            opacity: isTitleVisible ? 1 : 0,
            transform: isTitleVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              color: '#1f2937',
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            意思決定 = ストレスフリー
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: '#6b7280',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            店決めに悩む時間を、もっと大切なことに使えます。
            <br />
            <Box component="span" sx={{ color: '#3b82f6', fontWeight: 600 }}>
              『簡単3ステップ』
            </Box>
            で全員が納得するお店を決めましょう。
          </Typography>

          <Button
            component={Link}
            href="/polls/create"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              fontSize: '15px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              opacity: isButtonVisible ? 1 : 0,
              transform: isButtonVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s',
              '&:hover': {
                backgroundColor: '#2563eb',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              },
              '& .MuiButton-endIcon': {
                transition: 'transform 0.3s ease',
              },
              '&:hover .MuiButton-endIcon': {
                transform: 'translateX(4px)',
              },
            }}
          >
            今すぐ始める
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mt: 4,
              opacity: isButtonVisible ? 1 : 0,
              transition: 'opacity 0.6s ease 0.7s',
            }}
          >
            {['完全無料', 'アカウント不要'].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: '#6b7280',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: '1rem', color: '#3b82f6' }} />
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
