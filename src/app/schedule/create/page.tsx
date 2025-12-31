import type { Metadata } from 'next';
import ScheduleForm from './components/form';

export const metadata: Metadata = {
  title: '日程調整（出欠表）の作成',
  description:
    'Choisur（チョイスル）では、飲み会やイベントの候補日を簡単に調整できる日程調整機能を利用できます。会員登録・ログイン不要で URL を共有するだけで出欠確認が完了します。',
  alternates: {
    canonical: 'https://choisur.jp/schedule/create',
  },
  openGraph: {
    title: '日程調整の作成',
    description:
      'Choisur（チョイスル）では、飲み会やイベントの候補日を簡単に調整できる日程調整機能を利用できます。会員登録・ログイン不要で URL を共有するだけで出欠確認が完了します。',
    url: 'https://choisur.jp/schedule/create',
    siteName: 'Choisur',
    locale: 'ja_JP',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '日程調整の作成',
    description:
      'Choisur（チョイスル）では、飲み会やイベントの候補日を簡単に調整できる日程調整機能を利用できます。会員登録・ログイン不要で URL を共有するだけで出欠確認が完了します。',
  },
};

export default async function ScheduleCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const title = typeof resolvedParams.title === 'string' ? resolvedParams.title : undefined;
  const pollId = typeof resolvedParams.pollId === 'string' ? resolvedParams.pollId : undefined;

  return <ScheduleForm initialTitle={title} pollId={pollId} />;
}
