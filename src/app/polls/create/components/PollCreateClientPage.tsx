'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { createPollAction } from '@/app/polls/actions';
import AdvancedSettings from '@/app/schedule/create/components/form/AdvancedSettings';
import TermsAgreementCheckbox from '@/components/forms/TermsAgreementCheckbox';
import { Alert, AlertDescription } from '@/components/primitives/alert';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
// import { LAYOUT_CONSTANTS } from '@/config/constants';
import { pollFormSchema } from '@/db/validation/poll';
import type { PollFormData } from '@/db/validation/types';
import { useLoadingStore } from '@/stores/useLoadingStore';
import type { PollOption } from '../types';
import { AddOptionButton } from './AddOptionButton';
import { CreatePollButton } from './CreatePollButton';
import { OptionInput } from './OptionInput';

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

export default function PollCreateClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 今日の日付を取得（YYYY-MM-DD形式）
  const _todayDate = new Date().toISOString().split('T')[0];
  // 現在時刻を取得（HH:MM形式）
  const currentDateTime = new Date();
  const _currentTimeString = `${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}`;

  // 1週間後の日付と時刻を計算（デフォルト値）
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);

  // 1ヶ月後の日付を計算（最大値）
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const _maxEndDate = oneMonthLater.toISOString().split('T')[0];

  const methods = useForm<PollFormData>({
    resolver: zodResolver(pollFormSchema),
    defaultValues: {
      title: '',
      options: [
        { url: '', title: '', description: '' },
        { url: '', title: '', description: '' },
      ],
      endDate: '',
      endTime: '',
      password: '',
      hasAgreedToTerms: true,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const watchedOptions = watch('options');
  const watchedHasAgreedToTerms = watch('hasAgreedToTerms');

  // NOTE: 日程調節ページから遷移してきた場合
  // URLパラメータからタイトルを設定
  useEffect(() => {
    const titleParam = searchParams.get('title');
    if (titleParam) {
      setValue('title', titleParam);
    }
  }, [searchParams, setValue]);

  // 内部状態としてPollOptionを管理（OGP取得などのロジック用）
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: 1, url: '' },
    { id: 2, url: '' },
  ]);

  // react-hook-formの値と内部状態を同期
  useEffect(() => {
    const formOptions = watchedOptions || [];
    setPollOptions((prev: PollOption[]) => {
      const newOptions = formOptions.map((formOption, index) => {
        const existing = prev[index];
        return {
          id: existing?.id || Date.now() + index,
          url: formOption.url || '',
          title: formOption.title || '',
          description: formOption.description || '',
        };
      });
      return newOptions;
    });
  }, [watchedOptions]);

  const handleAddOption = () => {
    if (fields.length < MAX_OPTIONS) {
      append({
        url: '',
        title: '',
        description: '',
      });
      setPollOptions([
        ...pollOptions,
        {
          id: Date.now(),
          url: '',
          description: '',
        },
      ]);
    }
  };

  const updateOption = (index: number, updates: Partial<PollOption>) => {
    const option = pollOptions[index];
    if (option) {
      const updatedOption = { ...option, ...updates };
      setPollOptions(
        pollOptions.map((opt: PollOption, i: number) => (i === index ? updatedOption : opt))
      );
      // react-hook-formの値も更新
      if (updates.url !== undefined) {
        setValue(`options.${index}.url`, updates.url);
      }
      if (updates.title !== undefined) {
        setValue(`options.${index}.title`, updates.title);
      }
      if (updates.description !== undefined) {
        setValue(`options.${index}.description`, updates.description || '');
      }
    }
  };

  const handleRemoveOption = (index: number) => {
    if (fields.length > MIN_OPTIONS) {
      remove(index);
      setPollOptions(pollOptions.filter((_: PollOption, i: number) => i !== index));
    }
  };

  const { showLoading, hideLoading } = useLoadingStore();
  const onSubmit = async (data: PollFormData) => {
    try {
      showLoading('作成中...');
      // 空のURLを持つオプションを除外
      const validOptions = data.options.filter((option) => option.url.trim() !== '');

      const _scheduleId = searchParams.get('scheduleId');

      // createPollActionの呼び出し
      const result = await createPollAction({
        title: data.title.trim(),
        options: validOptions.map((option) => ({
          url: option.url.trim(),
          title: option.title.trim(),
          description: option.description || undefined,
        })),
        endDate: data.endDate || null,
        endTime: data.endTime || null,
        password: data.password || null,
        createdBy: 'user', // 仮ID、アクション側で要修正だが一旦合わせる
      });

      // アニメーションを安定させるために最低1.5秒待機
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!result.success || !result.data) {
        throw new Error(result.error || '多数決の作成に失敗しました');
      }

      const pollId = result.data.id;
      console.log('投票作成レスポンス:', result);

      if (pollId) {
        // パスワード設定の有無に関わらず、localStorageに主催者フラグを保存
        const organizerKey = `organizer_${pollId}`;
        localStorage.setItem(organizerKey, 'true');

        // Next.js Navigation (Router Push)
        router.push(`/polls/${pollId}`);

        // Navigation完了までオーバーレイを表示し続けるための猶予
        // ページ遷移後500ms経過してからLoadingを解除（フェードアウト開始）
        setTimeout(() => {
          hideLoading();
        }, 500);
      } else {
        throw new Error('投票IDが取得できませんでした');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      hideLoading();
      setError('root', {
        message:
          error instanceof Error
            ? error.message
            : '多数決の作成に失敗しました。もう一度お試しください。',
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <Label htmlFor="title" className="mb-3 block font-bold text-[#1a1a1c] text-base">
            タイトル<span className="ml-0.5 text-[#d32f2f]">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="歓迎会のお店はどこがいい？"
            value={watch('title')}
            onChange={(e) => {
              setValue('title', e.target.value);
            }}
            className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-white px-[14px] py-[16.5px] text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
          />
          {errors.title?.message && (
            <p className="mx-[14px] mt-1 text-red-600 text-xs">{errors.title.message}</p>
          )}
        </div>

        <div className="relative">
          <div className="mb-4">
            <Label className="mb-2 font-semibold text-[rgba(0,0,0,0.87)]">
              候補リスト<span className="ml-0.5 text-[#f44336]">*</span>
            </Label>
            <p className="text-[0.875rem] text-muted-foreground">
              候補となる店舗の情報を入力してください
            </p>
          </div>

          {fields.map((field, index) => {
            const option = pollOptions[index];
            const optionErrors = errors.options?.[index];
            return (
              <OptionInput
                key={field.id}
                option={option || { id: Date.now() + index, url: '' }}
                index={index}
                urlError={optionErrors?.url?.message}
                canRemove={fields.length > MIN_OPTIONS}
                onOptionChange={(updates) => updateOption(index, updates)}
                onRemove={() => handleRemoveOption(index)}
                register={register}
                control={control}
                errors={optionErrors}
              />
            );
          })}

          {fields.length < MAX_OPTIONS && <AddOptionButton onClick={handleAddOption} />}
        </div>

        {/* 詳細設定 */}
        <AdvancedSettings />

        <div
          className="mx-8 mt-10 h-[1px] sm:mt-12"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
          }}
        />

        <TermsAgreementCheckbox
          checked={watchedHasAgreedToTerms}
          onChange={(checked) => setValue('hasAgreedToTerms', checked)}
          error={errors.hasAgreedToTerms?.message}
        />

        <div
          className="mx-8 mb-10 h-[1px] sm:mb-12"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
          }}
        />

        <div>
          <CreatePollButton
            loading={isSubmitting}
            disabled={isSubmitting || !watchedHasAgreedToTerms}
            onClick={handleSubmit(onSubmit)}
          />
        </div>

        {errors.root && (
          <Alert variant="destructive" className="mt-8 border-red-200 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="font-medium">{errors.root.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </FormProvider>
  );
}
