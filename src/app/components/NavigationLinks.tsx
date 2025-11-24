'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationLinksProps {
  textColor: string;
  opacity?: number;
  onHowToUseClick?: () => void;
  onFaqClick?: () => void;
  isHomePage?: boolean;
}

export default function NavigationLinks({
  textColor,
  opacity = 1,
  onHowToUseClick,
  onFaqClick,
  isHomePage = false,
}: NavigationLinksProps) {
  const pathname = usePathname();
  const isCreatePollPage = pathname === '/polls/create';
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
    fontSize: '0.9375rem',
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

  const createPollLinkStyle = {
    ...linkStyle,
    color: isCreatePollPage ? '#f97316' : textColor,
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
      <Link
        href="/polls/create"
        style={{ textDecoration: 'none' } as React.CSSProperties}
      >
        <Typography sx={createPollLinkStyle}>投票作成</Typography>
      </Link>
    </Box>
  );
}
