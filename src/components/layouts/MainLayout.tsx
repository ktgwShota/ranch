'use client';

import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { LAYOUT_CONSTANTS } from '@/config/constants';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return (
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { xs: '100%', sm: 'calc(100% - 48px)' },
        maxWidth: { xs: '100%', sm: LAYOUT_CONSTANTS.MAX_CONTENT_WIDTH },
        my: { xs: 0, sm: 3 },
        mx: 'auto',
        p: { xs: 2.5, sm: 3 },
        borderRadius: { xs: 0, sm: 0.5 },
        border: { xs: 'none', sm: '1px solid #ddd' },
        backgroundColor: 'white',
      }}
    >
      {children}
    </Box>
  );
}
