import { notFound } from 'next/navigation';
import { Box } from '@mui/material';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import { getSchedule, closeSchedule } from '@/services/db/schedule';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import ActivePage from './components/active/ActivePage';
import ResultPage from './components/result/ResultPage';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  try {
    const context = getCloudflareContext();
    const env = context.env;

    if (!env?.DB) {
      throw new Error('Database not available');
    }

    const result = await getSchedule(id, env);

    if (!result.success || !result.data) {
      notFound();
    }

    let scheduleResult = result.data;

    // 期限切れの場合は自動的に締め切る（確定日程なしで締め切り）
    if (!scheduleResult.isClosed && scheduleResult.endDateTime) {
      const endTime = new Date(scheduleResult.endDateTime).getTime();
      if (endTime <= Date.now()) {
        await closeSchedule(id, env);
        scheduleResult.isClosed = true;
      }
    }

    const scheduleData = {
      id: scheduleResult.id,
      title: scheduleResult.title,
      createdAt: scheduleResult.createdAt,
      isClosed: scheduleResult.isClosed,
      endDateTime: scheduleResult.endDateTime,
      confirmedDateTime: scheduleResult.confirmedDateTime,
      dates: scheduleResult.dates,
      responses: scheduleResult.responses ?? [],
    };

    // 日程が決定済みの場合はResultPageを表示
    const isConfirmed = scheduleResult.confirmedDateTime !== null;

    return (
      <Box
        sx={{
          maxWidth: LAYOUT_CONSTANTS.MAX_CONTENT_WIDTH,
          mx: 'auto',
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          boxSizing: 'border-box',
        }}
      >
        {isConfirmed ? (
          <ResultPage scheduleData={scheduleData} />
        ) : (
          <ActivePage scheduleData={scheduleData} />
        )}
      </Box>
    );
  } catch (error) {
    console.error('Error fetching schedule:', error);
    notFound();
  }
}
