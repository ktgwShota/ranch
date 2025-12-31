'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { RHFForm } from '@/components/forms/RHFForm';
import { Button } from '@/components/primitives/button';
import { FormMessage } from '@/components/primitives/form';
import { Separator } from '@/components/primitives/separator';
import { scheduleFormSchema } from '@/db/validation/schedule';
import type { ScheduleFormData } from '@/db/validation/types';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { withMinDelay } from '@/utils/async';
import { addCreatedSchedule } from '@/utils/storage';
import { createScheduleAction } from '../../actions';
import AdvancedSettings from './AdvancedSettings';
import CandidateDatesField from './candidate-dates-field';
import SelectedList from './candidate-dates-field/SelectedList';
import TermsField from './TermsField';
import TitleField from './TitleField';

interface ScheduleFormProps {
  initialTitle?: string;
  pollId?: string;
}

export default function ScheduleForm({ initialTitle, pollId }: ScheduleFormProps) {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoadingStore();

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      title: initialTitle || '',
      dates: [],
      endDate: '',
      endTime: '',
      hasAgreedToTerms: true,
    },
    mode: 'onChange',
  });

  const { setError, handleSubmit, control } = form;

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      showLoading();

      // NOTE: ローディングアニメーションのクオリティを担保するために最低待機時間を確保
      const result = await withMinDelay(
        createScheduleAction({
          title: data.title.trim(),
          dates: data.dates,
          endDate: data.endDate || null,
          endTime: data.endTime || null,
          pollId: pollId || undefined,
        }),
        1500
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      addCreatedSchedule(result.data.id);

      router.push(`/schedule/${result.data.id}`);
      // NOTE: ローディングアニメーションのクオリティを担保するためにページ遷移後にローディングアニメーションを非表示にする
      setTimeout(() => hideLoading(), 500);
    } catch (e) {
      hideLoading();
      setError('root', {
        message: e instanceof Error ? e.message : '出欠表の作成に失敗しました',
      });
    }
  };

  return (
    <RHFForm form={form} onSubmit={onSubmit}>
      <TitleField />

      <CandidateDatesField control={control} />

      <SelectedList />

      <AdvancedSettings />

      <Separator className="mt-[20px] md:mt-6" />

      <TermsField />

      <Separator className="mb-[20px] md:mb-6" />

      {form.formState.errors.root && (
        <div className="mb-4">
          <FormMessage>{form.formState.errors.root.message}</FormMessage>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={form.formState.isSubmitting}
        className="h-15 w-full rounded-[2px] bg-[#1976d2] font-semibold text-white shadow-sm hover:bg-[#1565c0]"
      >
        {form.formState.isSubmitting ? '作成中...' : 'ページを作成'}
      </Button>
    </RHFForm>
  );
}
