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
  title: 'ChoisuR | 日程調整 / 店決め（多数決）ツール',
  description: 'ChoisuR（チョイスル）は、飲み会やイベントの日程調整 / 店決め（多数決）をサポートする完全無料のツールです。会員登録やログインは不要。PC・スマホから誰でも簡単にご利用いただけます。',
  verification: {
    google: 'ofTAbzl-JBzpDPsfdbPZB74tnrA85pfVYutehiKDxsw',
  },
  other: {
    'google-adsense-account': 'ca-pub-1085041034271078',
  },
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
