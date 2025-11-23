'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import Link from 'next/link';

const HEADER_HEIGHT = 80;

// ヘッダーコンポーネント
function LandingHeader() {
  const [isInHeroSection, setIsInHeroSection] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (!heroSection) return;

      const heroRect = heroSection.getBoundingClientRect();
      const scrollY = window.scrollY;
      const heroBottom = heroRect.bottom + scrollY;

      // ヒーローセクション内にいるかどうかを判定
      setIsInHeroSection(scrollY < heroBottom - HEADER_HEIGHT);
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
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
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
                color: isInHeroSection ? 'rgba(255, 255, 255, 0.9)' : '#6b7280',
              }}
            >
              チョイスル
            </Typography>
          </Box>

          {/* ナビゲーション */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography
              component="a"
              href="polls/create"
              sx={{
                color: isInHeroSection ? 'rgba(255, 255, 255, 0.9)' : '#6b7280',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                '&:hover': { color: isInHeroSection ? 'white' : '#1f2937' },
              }}
            >
              投票ページ作成
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// ヒーローセクションコンポーネント
function HeroSection() {
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
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
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
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.2,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
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
          }}
        >
          店決めに悩む時代はもう終わり。行く店はみんなで決める。
          <br />
          チョイスルは店決めに悩む幹事のためのサービスを提供します。
        </Typography>
      </Container>
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
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
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
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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

// How it Works セクションコンポーネント
function HowItWorksSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;
  const sectionRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <Box ref={sectionRef} sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#f9fafb' }}>
      <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            mb: 2,
          }}
        >
          How to use Choiceru
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.125rem',
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: '600px',
            mx: 'auto',
            mb: 6,
          }}
        >
          チョイスルの使い方
        </Typography>

        {/* カルーセルコンテナ */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          {/* スライドコンテンツ */}
          <Box sx={{ overflow: 'hidden', mb: 4, width: '100%', position: 'relative', isolation: 'isolate' }}>
            <Box
              sx={{
                display: 'flex',
                width: `${totalSlides * 100}%`,
                transform: `translateX(-${(currentSlide * 100) / totalSlides}%)`,
                transition: 'transform 0.3s ease-in-out',
                willChange: 'transform',
                position: 'relative',
              }}
            >
              {/* Step 1: テキスト左、画像右 */}
              <Box sx={{ width: `${100 / totalSlides}%`, flexShrink: 0, boxSizing: 'border-box', overflow: 'hidden' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
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
                      ステップ1
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#1f2937',
                        mb: 2,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                      }}
                    >
                      投票ページを作成
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#6b7280', lineHeight: 1.7, fontSize: '1.125rem' }}
                    >
                      候補となる店舗の URL を入力して投票ページを作成しましょう。店舗名や画像は自動的に入力されます。
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      height: { xs: 'auto', md: '450px' },
                    }}
                  >
                    <Box
                      component="img"
                      src="https://placehold.co/440x600/fed7aa/ffffff?text=Step+1"
                      alt="投票ページ作成画面"
                      sx={{
                        width: { xs: '100%', md: '440px' },
                        height: { xs: 'auto', md: '600px' },
                        objectFit: 'contain',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Step 2: テキスト左、画像右 */}
              <Box sx={{ width: `${100 / totalSlides}%`, flexShrink: 0, boxSizing: 'border-box', overflow: 'hidden' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
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
                      ステップ2
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#1f2937',
                        mb: 2,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                      }}
                    >
                      投票ページを共有
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#6b7280', lineHeight: 1.7, fontSize: '1.125rem' }}
                    >
                      作成した投票ページを LINE や Slack などの SNS で共有して、参加者の投票が終わるまで待ちます。
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      height: { xs: 'auto', md: '450px' },
                    }}
                  >
                    <Box
                      component="img"
                      src="https://placehold.co/440x600/ccfbf1/ffffff?text=Step+2"
                      alt="投票ページ共有画面"
                      sx={{
                        width: { xs: '100%', md: '440px' },
                        height: { xs: 'auto', md: '600px' },
                        objectFit: 'contain',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Step 3: テキスト左、画像右 */}
              <Box sx={{ width: `${100 / totalSlides}%`, flexShrink: 0, boxSizing: 'border-box', overflow: 'hidden' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
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
                      ステップ3
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#1f2937',
                        mb: 2,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                      }}
                    >
                      お店が決定
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#6b7280', lineHeight: 1.7, fontSize: '1.125rem' }}
                    >
                      投票受付時間に達すると投票結果が公開されます。
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      height: { xs: 'auto', md: '450px' },
                    }}
                  >
                    <Box
                      component="img"
                      src="https://placehold.co/440x600/ccfbf1/ffffff?text=Step+3"
                      alt="投票結果画面"
                      sx={{
                        width: { xs: '100%', md: '440px' },
                        height: { xs: 'auto', md: '600px' },
                        objectFit: 'contain',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ナビゲーション */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            {/* 左矢印ボタン */}
            <IconButton
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#f9fafb',
                  opacity: 0.5,
                },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: '20px', color: '#6b7280' }} />
            </IconButton>

            {/* ドットインジケーター */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {Array.from({ length: totalSlides }).map((_, index) => (
                <Box
                  key={index}
                  onClick={() => handleDotClick(index)}
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: currentSlide === index ? '#3b82f6' : '#d1d5db',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: currentSlide === index ? '#3b82f6' : '#9ca3af',
                    },
                  }}
                />
              ))}
            </Box>

            {/* 右矢印ボタン */}
            <IconButton
              onClick={handleNext}
              disabled={currentSlide === totalSlides - 1}
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#f9fafb',
                  opacity: 0.5,
                },
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: '20px', color: '#6b7280' }} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// FAQ セクションコンポーネント
function FAQSection() {
  const faqItems = [
    {
      question: '利用料金はかかりますか？',
      answer:
        '本サービスは完全無料でご利用いただけます。',
    },
    {
      question: '利用するにはアカウント登録が必要ですか？',
      answer:
        'アカウント登録は必要ありません。誰でもすぐにご利用いただけます。',
    },
    {
      question: '投票者名を後から変更できますか？',
      answer:
        '投票ページのメニュー（歯車アイコン）から投票者名を変更できます。',
    },
    {
      question: '投票締切日時よりも前に投票を締め切ることはできますか？',
      answer:
        '投票ページのメニュー（歯車アイコン）から任意のタイミングで投票を締め切ることができます。\n投票結果は投票を締め切ると同時に公開されます。',
    }
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'white' }}>
      <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            mb: 2,
          }}
        >
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.125rem',
            color: '#6b7280',
            textAlign: 'center',
            mx: 'auto',
            mb: 6,
          }}
        >
          よくある質問
        </Typography>

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {faqItems.map((item, idx) => (
            <Accordion
              key={idx}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px !important',
                mb: 2,
                boxShadow: 'none',
                '&:before': { display: 'none' },
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
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#3b82f6',
        color: 'white',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '980px' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: 'white',
              mb: 2,
            }}
          >
            早速試してみませんか？
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            煩わしい調整はもう終わりです。3ステップで誰でも簡単に、みんなが納得するお店が決定します。幹事の時間を大切にする新しい方法を、今すぐ無料で体験してください。
          </Typography>
          <Button
            component={Link}
            href="/polls/create"
            variant="contained"
            sx={{
              backgroundColor: 'white',
              color: '#3b82f6',
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            今すぐ試す
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// メインコンポーネント
export default function HomePage() {
  return (
    <Box sx={{ width: '100%' }}>
      <LandingHeader />
      <HeroSection />
      <HowItWorksSection />
      <BottomCTASection />
      <FAQSection />
    </Box>
  );
}
