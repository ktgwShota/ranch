'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Restaurant as RestaurantIcon,
  CalendarMonth as CalendarMonthIcon,
  HelpOutline as HelpOutlineIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LAYOUT_CONSTANTS } from '@/config/constants';


const HEADER_HEIGHT = 80;
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
export default function GlobalHeader({ isHeaderVisible: propIsHeaderVisible }: HeaderProps = {}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isOverHeroSection, setIsOverHeroSection] = useState(true);
  const [isOverBottomCTASection, setIsOverBottomCTASection] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

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

  // 初期状態でヒーローセクションまたはBottomCTASectionの上にいるかどうかを判定
  useEffect(() => {
    if (isHomePage) {
      const heroSection = document.getElementById('hero-section');
      const bottomCTASection = document.getElementById('bottom-cta-section');

      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        setIsOverHeroSection(heroRect.bottom > HEADER_HEIGHT);
      }

      if (bottomCTASection) {
        const ctaRect = bottomCTASection.getBoundingClientRect();
        setIsOverBottomCTASection(ctaRect.top <= HEADER_HEIGHT && ctaRect.bottom > HEADER_HEIGHT);
      }
    }
  }, [isHomePage]);

  // トップページの場合、スクロール位置を監視
  useScrollPosition(
    useCallback(() => {
      if (isHomePage) {
        const heroSection = document.getElementById('hero-section');
        const bottomCTASection = document.getElementById('bottom-cta-section');

        if (heroSection) {
          const heroRect = heroSection.getBoundingClientRect();
          setIsOverHeroSection(heroRect.bottom > HEADER_HEIGHT);
        }

        if (bottomCTASection) {
          const ctaRect = bottomCTASection.getBoundingClientRect();
          setIsOverBottomCTASection(ctaRect.top <= HEADER_HEIGHT && ctaRect.bottom > HEADER_HEIGHT);
        }
      }
    }, [isHomePage])
  );

  const handleScrollToHowItWorks = useCallback(() => {
    const howItWorksSection = document.getElementById('hot-to-use');
    howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
    handleMobileMenuClose();
  }, [handleMobileMenuClose]);

  const handleScrollToFaq = useCallback(() => {
    const faqSection = document.getElementById('faq');
    faqSection?.scrollIntoView({ behavior: 'smooth' });
    handleMobileMenuClose();
  }, [handleMobileMenuClose]);

  // スタイル計算
  const backgroundColor = isHomePage ? 'transparent' : '#fafafa';
  const position = isHomePage ? 'fixed' : 'static';
  const shouldUseWhiteText = isHomePage && (isOverHeroSection || isOverBottomCTASection);
  const logoColor = isHomePage
    ? shouldUseWhiteText ? '#f9fafb' : '#333333'
    : '#333';
  const navTextColor = isHomePage
    ? shouldUseWhiteText ? '#f9fafb' : '#333333'
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
      <Container maxWidth={false} sx={{
        maxWidth: LAYOUT_CONSTANTS.MAX_HEADER_WIDTH, px: { xs: 2.5, sm: 3 }
      }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            height: HEADER_HEIGHT,
            px: '0 !important'
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src="/logo.png" alt="ChoisuR Logo" width={140} />
          </Link>

          <DesktopNavigation
            textColor={navTextColor}
            opacity={navOpacity}
            isHomePage={isHomePage}
            onHowToUseClick={isHomePage ? handleScrollToHowItWorks : undefined}
            onFaqClick={isHomePage ? handleScrollToFaq : undefined}
          />

          <MobileNavigation
            isOpen={mobileMenuOpen}
            onToggle={handleMobileMenuToggle}
            onClose={handleMobileMenuClose}
            logoColor={logoColor}
            opacity={navOpacity}
            isHomePage={isHomePage}
            onHowToUseClick={handleScrollToHowItWorks}
            onFaqClick={handleScrollToFaq}
          />
        </Toolbar>
      </Container>
    </AppBar >
  );
}

interface DesktopNavigationProps {
  textColor: string;
  opacity: number;
  isHomePage: boolean;
  onHowToUseClick?: () => void;
  onFaqClick?: () => void;
}

function DesktopNavigation({
  textColor,
  opacity,
  isHomePage,
  onHowToUseClick,
  onFaqClick,
}: DesktopNavigationProps) {
  return (
    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
      <DesktopNavigationLinks
        textColor={textColor}
        opacity={opacity}
        onHowToUseClick={onHowToUseClick}
        onFaqClick={onFaqClick}
        isHomePage={isHomePage}
      />
    </Box>
  );
}

interface DesktopNavigationLinksProps {
  textColor: string;
  opacity?: number;
  onHowToUseClick?: () => void;
  onFaqClick?: () => void;
  isHomePage?: boolean;
}

// セグメントボタンの設定
const SEGMENT_BUTTONS = [
  {
    id: 'polls',
    label: '店決め',
    href: '/polls/create',
    pathPrefix: '/polls/',
    icon: RestaurantIcon,
  },
  {
    id: 'schedule',
    label: '日程調整',
    href: '/schedule/create',
    pathPrefix: '/schedule/',
    icon: CalendarMonthIcon,
  },
] as const;

function DesktopNavigationLinks({
  textColor,
  opacity = 1,
  onHowToUseClick,
  onFaqClick,
  isHomePage = false,
}: DesktopNavigationLinksProps) {
  const pathname = usePathname();
  const [isHowToUseVisible, setIsHowToUseVisible] = useState(false);
  const [isFaqVisible, setIsFaqVisible] = useState(false);

  // トップページの場合のみ、セクションの可視性を監視
  useEffect(() => {
    if (!isHomePage) return;

    const howToUseSection = document.getElementById('hot-to-use');
    const faqSection = document.getElementById('faq');

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.target.id === 'hot-to-use') {
          setIsHowToUseVisible(entry.isIntersecting);
        } else if (entry.target.id === 'faq') {
          setIsFaqVisible(entry.isIntersecting);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (howToUseSection) {
      observer.observe(howToUseSection);
    }
    if (faqSection) {
      observer.observe(faqSection);
    }

    return () => {
      if (howToUseSection) {
        observer.unobserve(howToUseSection);
      }
      if (faqSection) {
        observer.unobserve(faqSection);
      }
    };
  }, [isHomePage]);

  const linkStyle = {
    color: textColor,
    fontSize: '14px',
    fontWeight: 500,
    transition: 'opacity 0.3s ease, color 0.3s ease',
    opacity,
    '&:hover': {
      opacity: opacity * 0.8,
    },
  };

  const howToUseLinkStyle = {
    ...linkStyle,
    color: isHomePage && isHowToUseVisible ? '#f97316' : textColor,
  };

  const faqLinkStyle = {
    ...linkStyle,
    color: isHomePage && isFaqVisible ? '#f97316' : textColor,
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {onHowToUseClick ? (
        <Box
          component="button"
          onClick={onHowToUseClick}
          sx={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            ...howToUseLinkStyle,
          }}
        >
          利用方法
        </Box>
      ) : (
        <Link
          href="/#hot-to-use"
          style={{ textDecoration: 'none' }}
        >
          <Typography sx={howToUseLinkStyle}>利用方法</Typography>
        </Link>
      )}
      {onFaqClick ? (
        <Box
          component="button"
          onClick={onFaqClick}
          sx={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            ...faqLinkStyle,
          }}
        >
          よくある質問
        </Box>
      ) : (
        <Link
          href="/#faq"
          style={{ textDecoration: 'none' }}
        >
          <Typography sx={faqLinkStyle}>よくある質問</Typography>
        </Link>
      )}

      {SEGMENT_BUTTONS.map((button) => {
        const isActive = pathname.startsWith(button.pathPrefix);
        const Icon = button.icon;

        return (
          <Link key={button.id} href={button.href} style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                ...linkStyle,
                color: isActive ? '#f97316' : textColor,
              }}
            >
              {button.label}
            </Typography>
          </Link>
        );
      })}
    </Box>
  );
}

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  logoColor: string;
  opacity: number;
  isHomePage: boolean;
  onHowToUseClick: () => void;
  onFaqClick: () => void;
}

function MobileNavigation({
  isOpen,
  onToggle,
  onClose,
  logoColor,
  opacity,
  isHomePage,
  onHowToUseClick,
  onFaqClick,
}: MobileNavigationProps) {
  return (
    <>
      {/* ハンバーガーメニューボタン */}
      <IconButton
        onClick={onToggle}
        sx={{
          display: { xs: 'flex', sm: 'none' },
          color: logoColor,
          opacity,
          p: 0,
          transition: isHomePage ? 'color 1.2s ease, opacity 1.2s ease 0.3s' : 'none',
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* ドロワー */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: 320,
            backgroundColor: '#1e293b',
            color: '#f8fafc',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* ドロワーヘッダー */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc' }}>
              ChoisuR
            </Typography>
            <IconButton onClick={onClose} sx={{ color: '#f8fafc' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

          {/* メインアクション */}
          <MobileActionButtons onClose={onClose} />

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

          {/* ナビゲーションリンク */}
          <MobileNavLinks
            isHomePage={isHomePage}
            onHowToUseClick={onHowToUseClick}
            onFaqClick={onFaqClick}
            onClose={onClose}
          />
        </Box>
      </Drawer>
    </>
  );
}

// モバイル用アクションボタン
function MobileActionButtons({ onClose }: { onClose: () => void }) {
  return (
    <List sx={{ mb: 2 }}>
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          href="/polls/create"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            mb: 1,
            backgroundColor: '#2dd4bf',
            color: '#1e293b',
            '&:hover': {
              backgroundColor: '#5eead4',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#1e293b', minWidth: 40 }}>
            <RestaurantIcon />
          </ListItemIcon>
          <ListItemText
            primary="店決め"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          href="/schedule/create"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            backgroundColor: '#f97316',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#fb923c',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }}>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText
            primary="日程調整"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
}

// モバイル用ナビゲーションリンク
interface MobileNavLinksProps {
  isHomePage: boolean;
  onHowToUseClick: () => void;
  onFaqClick: () => void;
  onClose: () => void;
}

function MobileNavLinks({ isHomePage, onHowToUseClick, onFaqClick, onClose }: MobileNavLinksProps) {
  const linkStyle = {
    borderRadius: 2,
    color: '#94a3b8',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: '#f8fafc',
    },
  };

  if (isHomePage) {
    return (
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onHowToUseClick} sx={linkStyle}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="利用方法" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={onFaqClick} sx={linkStyle}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="よくある質問" />
          </ListItemButton>
        </ListItem>
      </List>
    );
  }

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/#hot-to-use" onClick={onClose} sx={linkStyle}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="利用方法" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/#faq" onClick={onClose} sx={linkStyle}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <HelpOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="よくある質問" />
        </ListItemButton>
      </ListItem>
    </List>
  );
}

