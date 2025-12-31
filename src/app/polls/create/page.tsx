import type { Metadata } from 'next';
import { Suspense } from 'react';
import PollCreateClientPage from './components/PollCreateClientPage';

export const metadata: Metadata = {
  title: '店決め（多数決）の作成',
  description:
    'Choisur（チョイスル）では、飲み会やイベントに使用するお店を多数決で簡単に決められる店決め機能を利用できます。会員登録・ログイン不要で URL を共有するだけで簡単にお店が決まります。',
  alternates: {
    canonical: 'https://choisur.jp/shop/create',
  },
  openGraph: {
    title: '店決め（多数決）の作成',
    description:
      'Choisur（チョイスル）では、飲み会やイベントに使用するお店を多数決で簡単に決められる店決め機能を利用できます。会員登録・ログイン不要で URL を共有するだけで簡単にお店が決まります。',
    url: 'https://choisur.jp/shop/create',
    siteName: 'Choisur',
    locale: 'ja_JP',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '店決め（多数決）の作成',
    description:
      'Choisur（チョイスル）では、飲み会やイベントに使用するお店を多数決で簡単に決められる店決め機能を利用できます。会員登録・ログイン不要で URL を共有するだけで簡単にお店が決まります。',
  },
};

export default function PollCreatePage() {
  return (
    <Suspense>
      <PollCreateClientPage />
    </Suspense>
  );
}
