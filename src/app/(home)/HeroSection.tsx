'use client';

import { Box, Container, Typography } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';

const HEADER_HEIGHT = 80;
const CONTAINER_MAX_WIDTH = '960px';
const TITLE = '"何でもいいよ" に終止符を。';
const SUBTITLE_1 = '幹事の悩みは「公平な多数決」で解決できます。';
const SUBTITLE_2 = 'ChoisuR が忖度なしで全員が納得する答えを導き出します。';

const ANIMATION_DELAYS = {
  TITLE_START: 300,
  TYPING_COMPLETE_DELAY: 300,
  ARROW_DELAY: 1100,
} as const;

const TYPING_SPEED = 150;

/**
 * ヒーローセクション
 * SSR時は完全なテキストを opacity: 0 でレンダリングし、SEOを確保。
 * マウント後に opacity: 1 にしつつ、JSでタイピングアニメーションを開始する。
 */
export default function HeroSection() {
  // SSR時の初期値としてテキストを入れておく（SEO対策）
  const [displayedText, setDisplayedText] = useState(TITLE);
  const [isTitleVisible, setIsTitleVisible] = useState(false); // opacity制御用

  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // アニメーション制御用の一連のフロー
    const runAnimation = async () => {
      // 0. マウント直後はフルテキストが入っているが、一旦アニメーションのためにクリアする
      // ただしハイドレーション不一致を防ぐため、useEffect内で実行

      // 1. タイトルフェードインまでの待機
      await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAYS.TITLE_START));

      // 2. フェードイン開始と同時にテキストをリセットしてタイピング準備
      setIsTitleVisible(true);
      setDisplayedText('');

      // 3. タイピングアニメーション
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        if (currentIndex < TITLE.length) {
          setDisplayedText(TITLE.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          // タイピング完了

          // 4. サブタイトル表示までの待機
          setTimeout(() => {
            setIsSubtitleVisible(true);
            // カーソルを消すならここ
            setShowCursor(false);
          }, ANIMATION_DELAYS.TYPING_COMPLETE_DELAY);
        }
      }, TYPING_SPEED);

      return () => clearInterval(intervalId);
    };

    runAnimation();
  }, []);

  useEffect(() => {
    // カーソル表示制御（タイピング中は表示）
    if (displayedText.length === TITLE.length) {
      // タイピング完了後もしばらく表示させておくなどの制御が可能
    }
  }, [displayedText]);

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
            minHeight: { xs: '3.6rem', md: '4.32rem' },
            display: 'inline-flex',
            alignItems: 'center',
            opacity: isTitleVisible ? 1 : 0,
            transform: isTitleVisible
              ? 'translateY(0) scale(1)'
              : 'translateY(50px) scale(0.9)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
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
          {SUBTITLE_1}
          <br />
          {SUBTITLE_2}
        </Typography>
      </Container>

      <ScrollArrow />
    </Box>
  );
}

function ScrollArrow() {
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);

  useEffect(() => {
    const totalDelay =
      ANIMATION_DELAYS.TITLE_START +
      (TITLE.length * TYPING_SPEED) +
      ANIMATION_DELAYS.TYPING_COMPLETE_DELAY +
      ANIMATION_DELAYS.ARROW_DELAY;

    const timer = setTimeout(() => {
      setIsScrollEnabled(true);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = useCallback(() => {
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
      onClick={handleClick}
      style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        cursor: isScrollEnabled ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: isScrollEnabled ? 1 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: isScrollEnabled ? 'auto' : 'none',
      }}
      sx={{
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
  );
}
