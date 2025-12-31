import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { closeSchedule, getSchedule } from '@/db/services/schedule';
import ActivePage from './components/active';
import ResultPage from './components/result';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  try {
    const result = await getSchedule(id);

    if (!result.success || !result.data) {
      notFound();
    }

    const scheduleResult = result.data;

    // 期限切れの場合は自動的に締め切る（確定日程なしで締め切り）
    if (!scheduleResult.isClosed && scheduleResult.endDateTime) {
      const endTime = new Date(scheduleResult.endDateTime).getTime();
      if (endTime <= Date.now()) {
        await closeSchedule(id);
        scheduleResult.isClosed = true;
      }
    }

    // 日程が決定済みの場合はResultPageを表示
    const isConfirmed = scheduleResult.confirmedDateTime !== null;

    return <>{isConfirmed ? <ResultPage id={id} /> : <ActivePage id={id} />}</>;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  if (!id) {
    return {
      title: '日程調整が見つかりません',
      robots: { index: false, follow: true },
    };
  }

  try {
    const result = await getSchedule(id);

    if (!result.success || !result.data) {
      return {
        title: '日程調整が見つかりません',
        robots: { index: false, follow: true },
      };
    }

    const schedule = result.data;
    const isClosed = schedule.isClosed || schedule.confirmedDateTime !== null;

    // Todo: 日程候補の数を取得するロジックがあれば良いが、現状データ構造から即座に計算できない場合は簡易的な説明にする
    // schedule.dates は string[] なので候補数はわかる
    const datesCount = schedule.dates?.length || 0;

    const title = schedule.title;
    const description = isClosed
      ? `日程調整結果: ${schedule.title}。`
      : `${schedule.title}の日程調整ページ。${datesCount}つの日程候補から都合の良い日時を選択してください。`;

    return {
      title,
      description,
      robots: {
        index: false,
        follow: true,
      },
      openGraph: {
        title,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '日程調整ページ',
      robots: { index: false, follow: true },
    };
  }
}
