import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleSchema, type ScheduleFormData } from '@/lib/schemas/schedule';
import { SelectedDate } from '../types';

interface UseScheduleFormProps {
  selectedDates: SelectedDate[];
}

export function useScheduleForm({ selectedDates }: UseScheduleFormProps) {
  const router = useRouter();

  // 日付関連の計算
  const todayDate = new Date().toISOString().split('T')[0];
  const currentDateTime = new Date();
  const currentTimeString = `${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}`;

  // 1ヶ月後の日付を計算（最大値）
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const maxEndDate = oneMonthLater.toISOString().split('T')[0];

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      title: '',
      dates: [],
      endDate: '',
      endTime: '',
      hasAgreedToTerms: false,
    },
  });

  const title = watch('title');
  const hasAgreedToTerms = watch('hasAgreedToTerms');
  const endDate = watch('endDate');
  const endTime = watch('endTime');

  // selectedDates（Dayjs）をフォームのdates（string）に同期
  useEffect(() => {
    const formattedDates = selectedDates.map((d) => ({
      date: d.date.format('YYYY-MM-DD'),
      times: d.times,
    }));
    setValue('dates', formattedDates);

    // 日程が選択されたらエラーをクリア
    if (formattedDates.length > 0) {
      clearErrors('dates');
    }
  }, [selectedDates, setValue, clearErrors]);

  const onSubmit = useCallback(
    async (data: ScheduleFormData) => {
      try {
        const response = await fetch('/api/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title.trim(),
            dates: data.dates,
            endDate: data.endDate || null,
            endTime: data.endTime || null,
          }),
        });

        if (!response.ok) {
          const errorData = (await response.json()) as { error?: string };
          throw new Error(errorData.error || 'Failed to create schedule');
        }

        const result = (await response.json()) as { schedule: { id: string } };
        router.push(`/schedule/${result.schedule.id}`);
      } catch (error) {
        console.error('Error creating schedule:', error);
        setError('root', {
          message: error instanceof Error ? error.message : 'スケジュールの作成に失敗しました',
        });
      }
    },
    [router, setError]
  );

  const handleSubmit = rhfHandleSubmit(onSubmit);

  const canSubmit =
    title.trim().length > 0 && selectedDates.length > 0 && !isSubmitting && hasAgreedToTerms;

  return {
    register,
    errors,
    title,
    setTitle: (value: string) => setValue('title', value),
    isSubmitting,
    handleSubmit,
    canSubmit,
    hasAgreedToTerms,
    setHasAgreedToTerms: (value: boolean) => setValue('hasAgreedToTerms', value),
    // 締切日時関連
    endDate,
    endTime,
    setEndDate: (value: string) => setValue('endDate', value),
    setEndTime: (value: string) => setValue('endTime', value),
    todayDate,
    maxEndDate,
    currentTimeString,
  };
}
