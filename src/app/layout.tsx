import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import '@/lib/dayjs';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/lib/mui/theme';
import GlobalFooter from '@/components/layouts/GlobalFooter';
import MainLayout from '@/components/layouts/MainLayout';
import GlobalHeader from '@/components/layouts/GlobalHeader';
import { Tutorial } from '@/components/ui/Tutorial';
import { ErrorSnackbar } from '@/components/ui/ErrorSnackbar';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import SmoothScroll from '@/components/ui/SmoothScroll';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | ChoisuR（チョイスル）',
    default: 'ChoisuR（チョイスル）| 日程調整 / 店決め（多数決）アプリ',
  },
  description: 'ChoisuR（チョイスル）は、飲み会やイベントの日程調整 / 店決め（多数決）を簡単に作成・共有できる無料の幹事アプリです。会員登録・ログイン不要でご利用いただけます。',
  verification: {
    google: 'ofTAbzl-JBzpDPsfdbPZB74tnrA85pfVYutehiKDxsw',
  },
  other: {
    'google-adsense-account': 'ca-pub-1085041034271078',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://choisur.jp',
    siteName: 'ChoisuR（チョイスル）',
    title: {
      template: '%s | ChoisuR（チョイスル）',
      default: 'ChoisuR（チョイスル）| 日程調整 / 店決め（多数決）アプリ',
    },
    description: 'ChoisuR（チョイスル）は、飲み会やイベントの日程調整 / 店決め（多数決）を簡単に作成・共有できる無料の幹事アプリです。会員登録・ログイン不要でご利用いただけます。',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s | ChoisuR（チョイスル）',
      default: 'ChoisuR（チョイスル）| 日程調整 / 店決め（多数決）アプリ',
    },
    description: 'ChoisuR（チョイスル）は、飲み会やイベントの日程調整 / 店決め（多数決）を簡単に作成・共有できる無料の幹事アプリです。会員登録・ログイン不要でご利用いただけます。',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={roboto.className} style={{ minWidth: '320px' }}>
        <ThemeProvider theme={theme}>
          <SmoothScroll>
            <CssBaseline />
            <ErrorSnackbar />
            <Tutorial />
            <LoadingOverlay />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <GlobalHeader />
              <MainLayout>{children}</MainLayout>
              <GlobalFooter />
            </Box>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
