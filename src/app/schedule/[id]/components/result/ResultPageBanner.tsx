'use client';

import { LinkNotificationBanner } from '@/components/ui/LinkNotificationBanner';
import type { ScheduleData } from '../shared/types';

interface ResultPageBannerProps {
  scheduleData: ScheduleData;
  hasPoll: boolean;
}

export function ResultPageBanner({ scheduleData, hasPoll }: ResultPageBannerProps) {
  return (
    <LinkNotificationBanner
      title={hasPoll ? '多数決（店決め）が作成されています！' : '行き先はもう決まりましたか？'}
      description={
        hasPoll
          ? '行き先（お店）の候補や、現在の投票結果が確認できます。'
          : 'まだ決まっていない場合は、投票機能を使って全員の希望を聞いてみましょう。'
      }
      buttonText={hasPoll ? '多数決を表示' : '行き先を決める'}
      href={
        hasPoll
          ? `/polls/${scheduleData.pollId}`
          : `/polls/create?title=${encodeURIComponent(scheduleData.title)}&scheduleId=${scheduleData.id}`
      }
      color={hasPoll ? 'blue' : 'orange'}
    />
  );
}
