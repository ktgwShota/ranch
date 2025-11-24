'use client';

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
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
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import Link from 'next/link';

const HEADER_HEIGHT = 80;

// ヘッダーコンポーネント
function LandingHeader() {
  const [isInHowItWorksSection, setIsInHowItWorksSection] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    // 説明文と同じタイミングでアニメーションを発動
    setTimeout(() => {
      setIsHeaderVisible(true);
    }, 900);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const howItWorksSection = document.getElementById('how-it-works-section');
      if (!howItWorksSection) return;

      const sectionRect = howItWorksSection.getBoundingClientRect();

      // How to use Choiceruセクションの上端が画面の上部を通過した後（セクション内に入った後）に黒に変更
      setIsInHowItWorksSection(sectionRect.top < 0);
    };

    // 初期状態を設定
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'transparent',
        opacity: isHeaderVisible ? 1 : 0,
        transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: HEADER_HEIGHT,
          }}
        >
          {/* ロゴ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: isInHowItWorksSection ? '#333333' : '#f9fafb',
                transition: 'color 1s ease',
              }}
            >
              チョイスル
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// ヒーローセクションコンポーネント
function HeroSection({ isScrollEnabled }: { isScrollEnabled: boolean }) {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    // ページロード時に順番にアニメーションを発動
    setIsOverlayVisible(true);
    setTimeout(() => {
      setIsTitleVisible(true);
    }, 300);
    setTimeout(() => {
      setIsSubtitleVisible(true);
    }, 900);
  }, []);

  const handleScrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works-section');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          transition: 'opacity 1.2s ease-out',
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '980px',
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
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          "幹事の時間" もっと大切に。
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
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          店決めに悩む時代はもう終わり。行く店はみんなで決める。
          <br />
          チョイスルは店決めに悩む幹事のためのサービスを提供します。
        </Typography>
      </Container>

      {/* 下矢印アイコン */}
      {isScrollEnabled && (
        <Box
          onClick={handleScrollToHowItWorks}
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            opacity: 0,
            animation: 'fadeInUp 0.6s ease-out 0.2s forwards',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateX(-50%) translateY(-10px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateX(-50%) translateY(0)',
              },
            },
            '&:hover': {
              transform: 'translateX(-50%) translateY(5px)',
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
      )}
    </Box>
  );
}

// スマートフォンモックアップコンポーネント
function PhoneMockup({ children, bgColor }: { children: React.ReactNode; bgColor: string }) {
  return (
    <Box
      sx={{
        width: { xs: '100%', md: '440px' },
        height: { xs: 'auto', md: '450px' },
        maxWidth: '100%',
        backgroundColor: 'transparent',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2,
        px: 0,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Macウィンドウのタイトルバー */}
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #e0e0e0',
            px: 1.5,
            py: 0.75,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            flexShrink: 0,
          }}
        >
          {/* ウィンドウコントロールボタン */}
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
            <Box
              sx={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#ff5f57',
              }}
            />
            <Box
              sx={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#ffbd2e',
              }}
            />
            <Box
              sx={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#28ca42',
              }}
            />
          </Box>
          {/* URLバー */}
          <Box
            sx={{
              ml: 'auto',
              backgroundColor: 'white',
              border: '1px solid #d0d0d0',
              borderRadius: '4px',
              px: 1,
              py: 0.25,
              display: 'flex',
              alignItems: 'center',
              maxWidth: '60%',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.65rem',
                color: '#666',
                fontWeight: 400,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              localhost:3000/polls/create
            </Typography>
          </Box>
        </Box>
        {/* アプリ画面 */}
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
            p: 1.5,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ステップアイテムコンポーネント（アニメーション付き）
const StepItem = React.forwardRef<
  HTMLDivElement,
  {
    step: { step: string; title: string; description: string; imageSrc: string; imageAlt: string };
    index: number;
    isVisible?: boolean;
  }
>(({ step, index, isVisible: parentIsVisible }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  // 親から制御される場合（ステップ1）と、自分で監視する場合（ステップ2, 3）を分ける
  const shouldUseParentControl = parentIsVisible !== undefined;
  const finalIsVisible = shouldUseParentControl ? parentIsVisible : isVisible;

  useEffect(() => {
    if (shouldUseParentControl) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.5
      }
    );

    const currentRef = (ref as React.RefObject<HTMLDivElement>)?.current || stepRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [shouldUseParentControl, ref]);

  // refをマージ
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

  // 左右からフェードイン（偶数は左から、奇数は右から）
  const translateX = isEven ? (finalIsVisible ? 0 : -50) : (finalIsVisible ? 0 : 50);

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
        transition: `opacity 0.5s ease-out ${index === 0 ? '0.2s' : `${index * 0.1}s`}, transform 0.5s ease-out ${index === 0 ? '0.2s' : `${index * 0.1}s`}`,
      }}
    >
      {/* テキスト部分 */}
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
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1f2937',
            mb: 2,
            fontSize: '1.75rem',
          }}
        >
          {step.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#6b7280', lineHeight: 1.7, fontSize: '1.125rem' }}
        >
          {step.description}
        </Typography>
      </Box>

      {/* 画像部分 */}
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

// How it Works セクションコンポーネント
function HowItWorksSection() {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const [isStep1Visible, setIsStep1Visible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const step1Observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // ステップ1の位置に来たら、3つを順番に表示
          // How to use Choiceru（0秒）
          setIsTitleVisible(true);
          // チョイスルの使い方（0.1秒後）
          setTimeout(() => {
            setIsSubtitleVisible(true);
          }, 100);
          // ステップ1（0.2秒後）
          setTimeout(() => {
            setIsStep1Visible(true);
          }, 200);
        }
      },
      { threshold: 0.5 }
    );

    if (step1Ref.current) {
      step1Observer.observe(step1Ref.current);
    }

    return () => {
      if (step1Ref.current) {
        step1Observer.unobserve(step1Ref.current);
      }
    };
  }, []);

  const steps = [
    {
      step: 'ステップ1',
      title: '投票を作成',
      description: '候補となる店舗の URL を入力して投票を作成しましょう。店舗名や画像は自動的に入力されます。',
      imageSrc: 'https://placehold.co/440x600/fed7aa/ffffff?text=Step+1',
      imageAlt: '投票作成画面',
    },
    {
      step: 'ステップ2',
      title: '投票ページを共有',
      description: '作成した投票ページを LINE や Slack などの SNS で共有して、参加者の投票が終わるまで待ちます。',
      imageSrc: 'https://placehold.co/440x600/ccfbf1/ffffff?text=Step+2',
      imageAlt: '投票ページ共有画面',
    },
    {
      step: 'ステップ3',
      title: 'お店が決定',
      description: '投票受付時間に達すると投票結果が公開されます。',
      imageSrc: 'https://placehold.co/440x600/ccfbf1/ffffff?text=Step+3',
      imageAlt: '投票結果画面',
    },
  ];

  return (
    <Box
      id="how-it-works-section"
      sx={{
        pt: { xs: 8, md: 10 },
        pb: { xs: 8, md: 10 },
        backgroundColor: '#f9fafb',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
        <Typography
          ref={titleRef}
          variant="h2"
          sx={{
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            mb: 2,
            opacity: isTitleVisible ? 1 : 0,
            transition: 'opacity 1.2s ease-out',
          }}
        >
          How to use Choiceru
        </Typography>
        <Typography
          ref={subtitleRef}
          variant="body1"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.125rem',
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: '600px',
            mx: 'auto',
            mb: 6,
            opacity: isSubtitleVisible ? 1 : 0,
            transition: 'opacity 1.2s ease-out',
          }}
        >
          チョイスルの使い方
        </Typography>

        {/* ステップを縦に並べる */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, md: 12 } }}>
          {steps.map((step, index) => (
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

// FAQ セクションコンポーネント
function FAQSection() {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const [isFirstItemVisible, setIsFirstItemVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const faqItems = [
    {
      question: '利用料金はかかりますか？',
      answer:
        '無料でご利用いただけます。',
    },
    {
      question: '利用するにはアカウント登録が必要ですか？',
      answer:
        'アカウント登録は不要です。',
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

  useEffect(() => {
    // 最初のFAQアイテムをトリガーとして、タイトル、サブタイトル、最初のFAQアイテムを順番に表示
    const firstItemObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setIsTitleVisible(true);
          setTimeout(() => {
            setIsSubtitleVisible(true);
          }, 100);
          setTimeout(() => {
            setIsFirstItemVisible(true);
            setVisibleItems((prev) => new Set([...prev, 0]));

            // 1つ目のアイテム表示をトリガーに、残りのアイテムを順番に表示
            for (let index = 1; index < faqItems.length; index++) {
              setTimeout(() => {
                setVisibleItems((prev) => new Set([...prev, index]));
              }, 200 + index * 100);
            }
          }, 200);
        }
      },
      { threshold: 0.5 }
    );

    if (firstItemRef.current) {
      firstItemObserver.observe(firstItemRef.current);
    }

    return () => {
      if (firstItemRef.current) {
        firstItemObserver.unobserve(firstItemRef.current);
      }
    };
  }, [faqItems]);

  return (
    <Box
      ref={sectionRef}
      sx={{
        pt: { xs: 8, md: 10 },
        pb: { xs: 4, md: 5 },
        backgroundColor: 'white',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
        <Typography
          ref={titleRef}
          variant="h2"
          sx={{
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            mb: 2,
            opacity: isTitleVisible ? 1 : 0,
            transition: 'opacity 1.2s ease-out',
          }}
        >
          Frequently Asked Questions
        </Typography>
        <Typography
          ref={subtitleRef}
          variant="body1"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.125rem',
            color: '#6b7280',
            textAlign: 'center',
            mx: 'auto',
            mb: 4,
            opacity: isSubtitleVisible ? 1 : 0,
            transition: 'opacity 1.2s ease-out',
          }}
        >
          よくある質問
        </Typography>

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {faqItems.map((item, idx) => (
            <Accordion
              key={idx}
              ref={(node) => {
                if (idx === 0) {
                  (firstItemRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
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
                transform: idx === 0 ? (isFirstItemVisible ? 'translateY(0)' : 'translateY(20px)') : (visibleItems.has(idx) ? 'translateY(0)' : 'translateY(20px)'),
                transition: idx === 0
                  ? `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s`
                  : `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s`,
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

// ボトムCTA セクションコンポーネント
function BottomCTASection() {
  const [isHeightExpanded, setIsHeightExpanded] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const actualHeightRef = useRef<number>(0);
  const measureRef = useRef<HTMLDivElement>(null);

  // 実際の高さを測定（非表示要素で測定）
  useLayoutEffect(() => {
    if (measureRef.current) {
      actualHeightRef.current = measureRef.current.offsetHeight;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || actualHeightRef.current === 0) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // セクションの上端位置
      const sectionTop = sectionRect.top;

      // 展開後のセクションの中点位置（展開後の高さの半分）
      const expandedSectionMidpoint = sectionTop + actualHeightRef.current / 2;

      // 展開後の高さの半分がビューポートに入る位置（セクションの中点がビューポートの下端に到達）
      const shouldExpand = expandedSectionMidpoint <= viewportHeight && sectionTop >= 0;

      if (shouldExpand && !isHeightExpanded) {
        setIsHeightExpanded(true);
        // 高さを展開したと同時に文字を表示開始
        setIsTitleVisible(true);
        setTimeout(() => {
          setIsDescriptionVisible(true);
        }, 200);
        setTimeout(() => {
          setIsButtonVisible(true);
        }, 400);
      }
    };

    // 初期チェック
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHeightExpanded]);

  return (
    <>
      {/* 高さ測定用の非表示要素 */}
      <Box
        ref={measureRef}
        sx={{
          position: 'absolute',
          visibility: 'hidden',
          height: 'auto',
          width: '100%',
          pointerEvents: 'none',
          background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
        }}
      >
        <Box sx={{ pt: 6 }}>
          <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'white',
                  mb: 3,
                }}
              >
                意思決定 = ストレスフリー
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                テストテキストテストテキストテストテキスト<br />
                『簡単3ステップ』で全員が納得するお店を決めましょう！
              </Typography>
              <Button
                component={Link}
                href="/polls/create"
                variant="contained"
                sx={{
                  backgroundColor: 'white',
                  color: '#3b82f6',
                  borderRadius: '8px',
                  mt: 3,
                  mb: 4,
                  px: 2,
                  py: 1.5,
                  fontSize: '15px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  fontWeight: 600,
                }}
              >
                無料で始める
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      <Box
        ref={sectionRef}
        sx={{
          background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
          maxHeight: isHeightExpanded ? `${actualHeightRef.current}px` : '0px',
          overflow: 'hidden',
          transition: 'max-height 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Box ref={contentRef} sx={{ pt: 6 }}>
          <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'white',
                  mb: 3,
                  opacity: isTitleVisible ? 1 : 0,
                  transform: isTitleVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                  transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                意思決定 = ストレスフリー
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  opacity: isDescriptionVisible ? 1 : 0,
                  transform: isDescriptionVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                }}
              >
                テストテキストテストテキストテストテキスト<br />
                『簡単3ステップ』で全員が納得するお店を決めましょう！
              </Typography>
              <Button
                component={Link}
                href="/polls/create"
                variant="contained"
                sx={{
                  backgroundColor: 'white',
                  color: '#3b82f6',
                  opacity: isButtonVisible ? 1 : 0,
                  transform: isButtonVisible ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.95)',
                  transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
                  borderRadius: '8px',
                  mt: 3,
                  mb: 4,
                  px: 2,
                  py: 1.5,
                  fontSize: '15px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#f3f4f6' },
                }}
              >
                無料で始める
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}

// メインコンポーネント
export default function HomePage() {
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);

  useEffect(() => {
    // アニメーションが完了したら下矢印アイコンを表示（説明文のアニメーション: 900ms開始 + 200ms遅延 + 600ms duration = 1700ms）
    const animationDuration = 900 + 200 + 600;
    const timeoutId = setTimeout(() => {
      setIsScrollEnabled(true);
    }, animationDuration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LandingHeader />
      <HeroSection isScrollEnabled={isScrollEnabled} />
      <HowItWorksSection />
      <BottomCTASection />
      <FAQSection />
    </Box>
  );
}
