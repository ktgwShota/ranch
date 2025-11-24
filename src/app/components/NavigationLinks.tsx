'use client';

import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationLinksProps {
  textColor: string;
  opacity?: number;
  onHowToUseClick?: () => void;
}

export default function NavigationLinks({ textColor, opacity = 1, onHowToUseClick }: NavigationLinksProps) {
  const pathname = usePathname();
  const isCreatePollPage = pathname === '/polls/create';

  const linkStyle = {
    color: textColor,
    fontSize: '0.9375rem',
    fontWeight: 500,
    transition: 'opacity 0.3s ease',
    opacity,
    '&:hover': {
      opacity: opacity * 0.8,
    },
  };

  const createPollLinkStyle = {
    ...linkStyle,
    color: isCreatePollPage ? '#f97316' : textColor, // オレンジ色
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
            ...linkStyle,
          }}
        >
          使い方
        </Box>
      ) : (
        <Link
          href="/#hot-to-use"
          style={{ textDecoration: 'none' } as React.CSSProperties}
        >
          <Typography sx={linkStyle}>使い方</Typography>
        </Link>
      )}
      <Link
        href="/#faq"
        style={{ textDecoration: 'none' } as React.CSSProperties}
      >
        <Typography sx={linkStyle}>よくある質問</Typography>
      </Link>
      <Link
        href="/polls/create"
        style={{ textDecoration: 'none' } as React.CSSProperties}
      >
        <Typography sx={createPollLinkStyle}>投票作成</Typography>
      </Link>
    </Box>
  );
}

