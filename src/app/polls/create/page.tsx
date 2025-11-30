'use client';

import {
  Alert,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pollSchema, type PollFormData } from '@/lib/schemas/poll';
import { PollOption } from './types';
import { validateUrl } from '../../../utils/url';
import { OptionCard } from './components/OptionCard';
import { AddOptionButton } from './components/AddOptionButton';
import { VotingDeadline } from './components/VotingDeadline';
import { CreatePollButton } from './components/CreatePollButton';
import { LAYOUT_CONSTANTS } from '@/config/constants';

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

export default function Index() {
  // 今日の日付を取得（YYYY-MM-DD形式）
  const todayDate = new Date().toISOString().split('T')[0];
  // 現在時刻を取得（HH:MM形式）
  const currentDateTime = new Date();
  const currentTimeString = `${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}`;

  // 1週間後の日付と時刻を計算（デフォルト値）
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  const defaultEndDate = oneWeekLater.toISOString().split('T')[0];
  const defaultEndTime = `${oneWeekLater.getHours().toString().padStart(2, '0')}:${oneWeekLater.getMinutes().toString().padStart(2, '0')}`;

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
    clearErrors,
  } = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      title: '',
      options: [
        { url: '', title: '', budgetMin: '', budgetMax: '', description: '' },
        { url: '', title: '', budgetMin: '', budgetMax: '', description: '' },
      ],
      endDate: '',
      endTime: '',
      password: '',
      hasAgreedToTerms: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const watchedOptions = watch('options');
  const watchedEndDate = watch('endDate');
  const watchedEndTime = watch('endTime');

  // 内部状態としてPollOptionを管理（OGP取得などのロジック用）
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: 1, url: '', showCustomBudget: false },
    { id: 2, url: '', showCustomBudget: false },
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
          budgetMin: formOption.budgetMin || '',
          budgetMax: formOption.budgetMax || '',
          description: formOption.description || '',
          showCustomBudget: existing?.showCustomBudget || false,
          budgetOptions: existing?.budgetOptions,
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
        budgetMin: '',
        budgetMax: '',
        description: '',
      });
      setPollOptions([
        ...pollOptions,
        {
          id: Date.now(),
          url: '',
          budget: '',
          budgetMin: '',
          budgetMax: '',
          description: '',
          showCustomBudget: false,
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
      if (updates.budgetMin !== undefined) {
        setValue(`options.${index}.budgetMin`, updates.budgetMin || '');
      }
      if (updates.budgetMax !== undefined) {
        setValue(`options.${index}.budgetMax`, updates.budgetMax || '');
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

  const onSubmit = async (data: PollFormData) => {
    try {
      // 空のURLを持つオプションを除外
      const validOptions = data.options.filter((option) => option.url.trim() !== '');

      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title.trim(),
          options: validOptions.map((option) => ({
            url: option.url.trim(),
            title: option.title.trim(),
            budgetMin: option.budgetMin || undefined,
            budgetMax: option.budgetMax || undefined,
            description: option.description || undefined,
          })),
          endDate: data.endDate || null,
          endTime: data.endTime || null,
          password: data.password || null,
        }),
      });

      if (!response.ok) {
        throw new Error('多数決の作成に失敗しました');
      }

      const result: { poll?: { id?: string } } = await response.json();
      console.log('投票作成レスポンス:', result);

      if (result.poll && result.poll.id) {
        // パスワード設定の有無に関わらず、localStorageに主催者フラグを保存
        const organizerKey = `organizer_${result.poll.id}`;
        localStorage.setItem(organizerKey, 'true');
        window.location.href = `/polls/${result.poll.id}`;
      } else {
        throw new Error('投票IDが取得できませんでした');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      setError('root', {
        message: error instanceof Error ? error.message : '多数決の作成に失敗しました。もう一度お試しください。',
      });
    }
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: LAYOUT_CONSTANTS.MAX_CONTENT_WIDTH }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          my: { xs: 2, sm: 3 },
          borderRadius: 0.5,
          border: '1px solid #ddd',
          backgroundColor: 'white',
        }}
      >
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
                候補 <span style={{ color: '#f44336' }}>*</span>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                候補となるお店の情報を入力してください。
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                <a href="https://tabelog.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>食べログ</a> または <a href="https://www.gnavi.co.jp/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>ぐるなび</a> で取得した URL を使用するとタイトルと予算を自動入力されます。
              </Typography>
            </Box>

            {fields.map((field, index) => {
              const option = pollOptions[index];
              const optionErrors = errors.options?.[index];
              return (
                <OptionCard
                  key={field.id}
                  option={option || { id: Date.now() + index, url: '', showCustomBudget: false }}
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
          <Accordion
            sx={{
              boxShadow: 'none',
              border: '1px solid #e5e7eb',
              borderRadius: 0.5,
              '&:before': {
                display: 'none',
              },
              mb: 3,
              '&.Mui-expanded': {
                mb: 3,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                py: 2.5,
                px: 3,
                minHeight: '56px',
                '&.Mui-expanded': {
                  minHeight: '56px',
                  borderBottom: '1px solid #e5e7eb',
                },
                '& .MuiAccordionSummary-content': {
                  my: 0,
                  margin: 0,
                  alignItems: 'center',
                  '&.Mui-expanded': {
                    margin: 0,
                  },
                },
                '& .MuiAccordionSummary-expandIconWrapper': {
                  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: 'text.secondary',
                  '&.Mui-expanded': {
                    transform: 'rotate(180deg)',
                  },
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '1rem',
                  lineHeight: 1.5,
                }}
              >
                詳細設定
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3 }}>
              <VotingDeadline
                endDate={watchedEndDate}
                endTime={watchedEndTime}
                todayDate={todayDate}
                maxDate={maxEndDate}
                currentTimeString={currentTimeString}
                onEndDateChange={(value) => {
                  setValue('endDate', value);
                  if (value === todayDate && watchedEndTime && watchedEndTime < currentTimeString) {
                    setValue('endTime', '');
                  }
                }}
                onEndTimeChange={(value) => setValue('endTime', value)}
                register={register}
                errors={errors}
              />

              <Box>
                <Typography
                  variant="h6"
                  sx={{ mt: 2, fontWeight: 600, color: 'text.primary', mb: 1, fontSize: '15px' }}
                >
                  編集用パスワード
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                  パスワードを設定すると主催者以外のメンバーがパスワードを使用して投票に関する操作ができるようになります。
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  {...register('password')}
                  variant="outlined"
                  sx={{
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
            </AccordionDetails>
          </Accordion>

          <Box
            sx={{
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
              mb: 3,
              mx: 2,
            }}
          />


          <Box display="flex" justifyContent="center" my={4}>
            <FormControlLabel
              control={
                <Checkbox
                  {...register('hasAgreedToTerms')}
                  color="primary"
                  size="small"
                  sx={{
                    p: 0,
                  }}
                />
              }
              label={
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 500, position: 'relative', top: '0.5px', fontSize: '0.875rem' }}
                >
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#1976d2',
                      textDecoration: 'none',
                      paddingLeft: 4,
                    }}
                  >
                    利用規約
                  </a>
                  に同意する
                </Typography>
              }
            />
            {errors.hasAgreedToTerms && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errors.hasAgreedToTerms.message}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
              mb: 3,
              mx: 2,
            }}
          />

          <Box component="div">
            <CreatePollButton
              loading={isSubmitting}
              disabled={isSubmitting || !watch('hasAgreedToTerms')}
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
      </Paper>
    </Container>
  );
}
