import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/lib/mui/theme';
import Footer from './components/Footer';
import Header from './components/Header';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'チョイスル',
  description:
    'チョイスルは、ランチのお店選びに特化したログイン不要・無料で使用できるの投票ツールです。主要なグルメサイトに対応、URLを貼るだけで写真付きのアンケートを簡単に作成・共有できます。',
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
