'use client';

import { PageLayout } from '@/components/layouts/PageLayout';
import { useScheduleActions } from '../../hooks/useScheduleActions';
import type { ScheduleData } from '../shared/types';
import { ActivePageHeader } from './ActivePageHeader';
import { ActivePageContents } from './ActivePageContents';
import { ActivePageDialogs } from './ActivePageDialogs';

interface ActivePageProps {
  scheduleData: ScheduleData;
}

export default function ActivePage({ scheduleData }: ActivePageProps) {
  const actionsHook = useScheduleActions({
    scheduleId: scheduleData.id,
  });

  return (
    <PageLayout
      header={<ActivePageHeader scheduleData={scheduleData} actionsHook={actionsHook} />}
      contents={<ActivePageContents scheduleData={scheduleData} />}
      modals={<ActivePageDialogs scheduleData={scheduleData} actionsHook={actionsHook} />}
    />
  );
}

