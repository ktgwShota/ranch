import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/lib/mui/theme';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Tutorial } from '@/components/Tutorial';
import { ErrorSnackbar } from '@/components/ErrorSnackbar';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ChoisuR | 多数決ツール',
  description:
    'ChoisuR（チョイスル）は、無料で使用できる多数決ツールです。公平な意思決定をサポートします。',
  keywords: ['多数決', '投票', 'ChoisuR'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={roboto.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorSnackbar />
          <Tutorial />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
