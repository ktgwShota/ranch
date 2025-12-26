import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleSchema, type ScheduleFormData } from '@/lib/schemas/schedule';
import type { SelectedDate } from '../types';
import { useLoadingStore } from '@/stores/useLoadingStore';

interface UseScheduleFormProps {
  selectedDates: SelectedDate[];
  initialTitle?: string | null;
  pollId?: string | null;
}

export function useScheduleForm({ selectedDates, initialTitle, pollId }: UseScheduleFormProps) {
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
      title: initialTitle || '',
      dates: [],
      endDate: '',
      endTime: '',
      hasAgreedToTerms: true,
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

  const { showLoading, hideLoading } = useLoadingStore();

  const onSubmit = useCallback(
    async (data: ScheduleFormData) => {
      try {
        showLoading('作成中...');
        const [response] = await Promise.all([
          fetch('/api/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: data.title.trim(),
              dates: data.dates,
              endDate: data.endDate || null,
              endTime: data.endTime || null,
              pollId: pollId || undefined,
            }),
          }),
          // アニメーションを安定させるために最低1.5秒待機
          new Promise((resolve) => setTimeout(resolve, 1500)),
        ]);

        if (!response.ok) {
          const errorData = (await response.json()) as { error?: string };
          throw new Error(errorData.error || 'Failed to create schedule');
        }

        const result = (await response.json()) as { schedule: { id: string } };

        // 作成したスケジュールIDをローカルストレージに保存（主催者判定用）
        try {
          const CREATED_SCHEDULES_KEY = 'my_created_schedules';
          const stored = localStorage.getItem(CREATED_SCHEDULES_KEY);
          const createdSchedules: string[] = stored ? JSON.parse(stored) : [];
          if (!createdSchedules.includes(result.schedule.id)) {
            createdSchedules.push(result.schedule.id);
            localStorage.setItem(CREATED_SCHEDULES_KEY, JSON.stringify(createdSchedules));
          }
        } catch (e) {
          console.error('Failed to save created schedule to localStorage', e);
        }

        router.push(`/schedule/${result.schedule.id}`);
        // 遷移後のフェードアウト待ち
        setTimeout(() => hideLoading(), 500);
      } catch (error) {
        console.error('Error creating schedule:', error);
        hideLoading();
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
    validationMessages: (() => {
      const messages: string[] = [];
      if (title.trim().length === 0) messages.push('タイトル');
      if (selectedDates.length === 0) messages.push('日程候補');
      if (!hasAgreedToTerms) messages.push('利用規約への同意');
      return messages;
    })(),
  };
}
