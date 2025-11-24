'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import NavigationLinks from './NavigationLinks';

const HEADER_HEIGHT = 80;
const CONTAINER_MAX_WIDTH = '960px';

// スクロール位置を監視するカスタムフック
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

interface HeaderProps {
  isHeaderVisible?: boolean;
}

const TYPING_SPEED = 150;
const TYPING_COMPLETE_DELAY = 300;
const TITLE_START = 300;
const fullText = '"幹事の時間" もっと大切に。';
const TYPING_DURATION = TITLE_START + (fullText.length * TYPING_SPEED) + TYPING_COMPLETE_DELAY;

/**
 * NOTE: このコンポーネントをサーバーコンポーネントにしない理由
 *
 * サーバーコンポーネントは初回レンダリング時のみ実行されるため、
 * Next.jsのクライアントサイドルーティング（ページ遷移）時には再実行されません。
 * そのため、サーバーコンポーネントでパス名を判定すると、遷移後も古い値（例: トップページ判定がtrueのまま）
 * が残り続け、ヘッダーが正しく表示されなくなる問題が発生します。
 *
 * クライアントコンポーネントとして実装することで、usePathname()フックにより
 * クライアント側での遷移をリアルタイムで検知し、適切なヘッダーを表示できます。
 */
export default function Header({ isHeaderVisible: propIsHeaderVisible }: HeaderProps = {}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isInHowItWorksSection, setIsInHowItWorksSection] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  // タイピングアニメーションの完了を検知
  useEffect(() => {
    if (isHomePage && propIsHeaderVisible === undefined) {
      const timer = setTimeout(() => {
        setIsHeaderVisible(true);
      }, TYPING_DURATION);
      return () => clearTimeout(timer);
    } else if (propIsHeaderVisible !== undefined) {
      setIsHeaderVisible(propIsHeaderVisible);
    }
  }, [isHomePage, propIsHeaderVisible]);

  // トップページの場合、スクロール位置を監視
  useScrollPosition(
    useCallback(() => {
      if (isHomePage) {
        const howItWorksSection = document.getElementById('hot-to-use');
        if (howItWorksSection) {
          const sectionRect = howItWorksSection.getBoundingClientRect();
          // セクションの上端がヘッダーの下端に到達した時点で黒にする
          setIsInHowItWorksSection(sectionRect.top <= HEADER_HEIGHT);
        }
      }
    }, [isHomePage])
  );

  const handleScrollToHowItWorks = useCallback(() => {
    const howItWorksSection = document.getElementById('hot-to-use');
    howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScrollToFaq = useCallback(() => {
    const faqSection = document.getElementById('faq');
    faqSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 背景色以外は同じスタイルを適用
  const backgroundColor = isHomePage ? 'transparent' : '#fafafa';
  const position = isHomePage ? 'fixed' : 'static';
  const logoColor = isHomePage
    ? isInHowItWorksSection
      ? '#333333'
      : '#f9fafb'
    : '#333';
  const navTextColor = isHomePage
    ? isInHowItWorksSection
      ? '#333333'
      : '#f9fafb'
    : '#333';
  const navOpacity = isHomePage && isHeaderVisible !== undefined ? (isHeaderVisible ? 1 : 0) : 1;

  return (
    <AppBar
      position={position as 'fixed' | 'static'}
      elevation={0}
      sx={{
        background: backgroundColor,
        backdropFilter: isHomePage ? 'none' : 'blur(10px)',
        borderBottom: isHomePage ? 'none' : '1px solid #e0e0e0',
        zIndex: 1000,
        opacity: isHomePage ? (isHeaderVisible !== undefined ? (isHeaderVisible ? 1 : 0) : 1) : 1,
        transition: isHomePage ? 'opacity 1.2s ease 0.3s' : 'none',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: LAYOUT_CONSTANTS.MAX_HEADER_WIDTH }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            height: HEADER_HEIGHT,
            px: 0.5,
          }}
        >
          {/* ロゴとタイトル */}
          <Link
            href="/"
            style={{ textDecoration: 'none', color: 'inherit' } as React.CSSProperties}
          >
            <Typography
              variant="h6"
              component="h1"
              fontWeight="700"
              sx={{
                color: logoColor,
                letterSpacing: '-0.02em',
                textShadow: isHomePage ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: isHomePage ? 'color 1.2s ease' : 'none',
              }}
            >
              チョイスル
            </Typography>
          </Link>

          {/* ナビゲーション */}
          <NavigationLinks
            textColor={navTextColor}
            opacity={navOpacity}
            onHowToUseClick={isHomePage ? handleScrollToHowItWorks : undefined}
            onFaqClick={isHomePage ? handleScrollToFaq : undefined}
            isHomePage={isHomePage}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
