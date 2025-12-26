'use client';

import {
  Alert,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pollSchema, type PollFormData } from '@/lib/schemas/poll';
import type { PollOption } from '../types';
import { OptionInput } from './OptionInput';
import { AddOptionButton } from './AddOptionButton';
import { CreatePollButton } from './CreatePollButton';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import AdvancedSettingsAccordion from '@/components/ui/AdvancedSettingsAccordion';
import DeadlineInput from '@/components/forms/DeadlineInput';
import Link from 'next/link';
import TermsAgreementCheckbox from '@/components/forms/TermsAgreementCheckbox';
import { useLoadingStore } from '@/stores/useLoadingStore';

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

export default function PollCreateClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 今日の日付を取得（YYYY-MM-DD形式）
  const todayDate = new Date().toISOString().split('T')[0];
  // 現在時刻を取得（HH:MM形式）
  const currentDateTime = new Date();
  const currentTimeString = `${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}`;

  // 1週間後の日付と時刻を計算（デフォルト値）
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);

  // 1ヶ月後の日付を計算（最大値）
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const maxEndDate = oneMonthLater.toISOString().split('T')[0];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
  } = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const watchedOptions = watch('options');
  const watchedEndDate = watch('endDate');
  const watchedEndTime = watch('endTime');
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

      const scheduleId = searchParams.get('scheduleId');

      const [response] = await Promise.all([
        fetch('/api/polls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: data.title.trim(),
            options: validOptions.map((option) => ({
              url: option.url.trim(),
              title: option.title.trim(),
              description: option.description || undefined,
            })),
            endDate: data.endDate || null,
            endTime: data.endTime || null,
            password: data.password || null,
            scheduleId: scheduleId || undefined,
          }),
        }),
        // アニメーションを安定させるために最低1.5秒待機
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      if (!response.ok) {
        throw new Error('多数決の作成に失敗しました');
      }

      const result: { poll?: { id?: string } } = await response.json();
      console.log('投票作成レスポンス:', result);

      if (result.poll && result.poll.id) {
        // パスワード設定の有無に関わらず、localStorageに主催者フラグを保存
        const organizerKey = `organizer_${result.poll.id}`;
        localStorage.setItem(organizerKey, 'true');

        // Next.js Navigation (Router Push)
        router.push(`/polls/${result.poll.id}`);

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
        message: error instanceof Error ? error.message : '多数決の作成に失敗しました。もう一度お試しください。',
      });
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5, fontSize: '1rem' }}
          >
            タイトル <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            placeholder="歓迎会のお店はどこがいい？"
            value={watch('title')}
            onChange={(e) => {
              setValue('title', e.target.value);
            }}
            variant="outlined"
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.5,
                fontSize: '1rem',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                  borderWidth: 2,
                },
              },
              '& .MuiInputBase-input::placeholder': {
                fontSize: '0.875rem',
              },
            }}
          />
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Box mb={2}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: 'text.primary', mb: 1, fontSize: '1rem' }}
            >
              候補リスト <span style={{ color: '#f44336' }}>*</span>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              候補となる店舗の情報を入力してください
            </Typography>
          </Box>

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
        </Box>

        {/* 詳細設定 */}
        <AdvancedSettingsAccordion>
          <DeadlineInput
            endDate={watchedEndDate || ''}
            endTime={watchedEndTime || ''}
            todayDate={todayDate}
            maxEndDate={maxEndDate}
            currentTimeString={currentTimeString}
            onEndDateChange={(value) => setValue('endDate', value)}
            onEndTimeChange={(value) => setValue('endTime', value)}
            dateError={errors.endDate?.message}
            timeError={errors.endTime?.message}
          />
        </AdvancedSettingsAccordion>

        <Box
          sx={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
            mt: { xs: 2.5, sm: 3 },
            mx: 2,
          }}
        />

        <TermsAgreementCheckbox
          checked={watchedHasAgreedToTerms}
          onChange={(checked) => setValue('hasAgreedToTerms', checked)}
          error={errors.hasAgreedToTerms?.message}
        />

        <Box
          sx={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
            mb: { xs: 2.5, sm: 3 },
            mx: 2,
          }}
        />

        <Box component="div">
          <CreatePollButton
            loading={isSubmitting}
            disabled={isSubmitting || !watchedHasAgreedToTerms}
            onClick={handleSubmit(onSubmit)}
          />
        </Box>

        {errors.root && (
          <Alert
            severity="error"
            sx={{
              mt: 4,
              mb: 0,
              border: '1px solid #ffebee',
              backgroundColor: '#ffebee',
              '& .MuiAlert-message': {
                fontSize: '0.875rem',
                fontWeight: 500,
              },
            }}
          >
            {errors.root.message}
          </Alert>
        )}
      </Box>
    </>
  );
}
