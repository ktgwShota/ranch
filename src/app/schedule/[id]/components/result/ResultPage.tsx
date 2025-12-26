'use client';

import { PageLayout } from '@/components/layouts/PageLayout';
import 'dayjs/locale/ja';

import { useScheduleActions } from '../../hooks/useScheduleActions';
import type { ScheduleData } from '../shared/types';
import { ResultPageBanner } from './ResultPageBanner';
import { ResultPageHeader } from './ResultPageHeader';
import { ResultPageContents } from './ResultPageContents';
import { ResultPageDialogs } from './ResultPageDialogs';

interface ResultPageProps {
  scheduleData: ScheduleData;
}

export default function ResultPage({ scheduleData }: ResultPageProps) {
  const actionsHook = useScheduleActions({
    scheduleId: scheduleData.id,
  });

  return (
    <PageLayout
      banner={<ResultPageBanner scheduleData={scheduleData} hasPoll={!!scheduleData.pollId} />}
      header={<ResultPageHeader scheduleData={scheduleData} actionsHook={actionsHook} />}
      contents={<ResultPageContents scheduleData={scheduleData} />}
      modals={<ResultPageDialogs actionsHook={actionsHook} />}
    />
  );
}