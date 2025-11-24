'use client';

import { useEffect, useRef } from 'react';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Divider, IconButton } from '@mui/material';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { PollFormData } from '@/lib/schemas/poll';
import { PollOption } from '../types';
import { UrlInput } from './UrlInput';
import { BudgetSelector } from './BudgetSelector';
import { DescriptionInput } from './DescriptionInput';
import { TitleDisplay } from './TitleDisplay';
import { validateUrl } from '@/utils/url';

export function OptionCard({
  option,
  index,
  urlError,
  canRemove,
  onOptionChange,
  onRemove,
  register,
  control,
  errors,
}: {
  option: PollOption;
  index: number;
  urlError?: string;
  canRemove: boolean;
  onOptionChange: (updates: Partial<PollOption>) => void;
  onRemove: () => void;
  register: UseFormRegister<PollFormData>;
  control: Control<PollFormData>;
  errors?: FieldErrors<PollFormData['options'][0]>;
}) {
  const onOptionChangeRef = useRef(onOptionChange);
  const optionRef = useRef(option);

  // onOptionChangeとoptionの最新の参照を保持
  useEffect(() => {
    onOptionChangeRef.current = onOptionChange;
    optionRef.current = option;
  }, [onOptionChange, option]);

  // OGPデータを取得（プレビューは表示しない）
  useEffect(() => {
    // URLが空、またはバリデーションエラーがある場合は取得しない
    if (!option.url.trim() || validateUrl(option.url) !== null) {
      const updates: Partial<PollOption> = {};
      // URLが空になった場合は、タイトルとbudgetOptionsをクリア
      if (!option.url.trim() && optionRef.current.title) {
        updates.title = undefined;
      }
      if (optionRef.current.budgetOptions) {
        updates.budgetOptions = undefined;
        // ぐるなびのオプションから選択した予算もクリア
        const wasGurunaviBudget = optionRef.current.budgetOptions.some(
          opt => opt.min === optionRef.current.budgetMin && opt.max === optionRef.current.budgetMax
        );
        if (wasGurunaviBudget) {
          updates.budgetMin = undefined;
          updates.budgetMax = undefined;
        }
      }
      // 更新がある場合のみonOptionChangeを呼ぶ
      if (Object.keys(updates).length > 0) {
        onOptionChangeRef.current(updates);
      }
      return;
    }

    // debounce処理
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/ogp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: option.url }),
        });

        const responseData = await response.json().catch(() => null);
        if (!responseData) return;

        const data: {
          title?: string;
          budgetMin?: string;
          budgetMax?: string;
          budgetOptions?: Array<{ label: string; min: string; max: string }>;
        } = responseData;

        const updates: Partial<PollOption> = {};

        // タイトルを更新（値が実際に変更された場合のみ）
        if (data.title && data.title !== optionRef.current.title) {
          updates.title = data.title;
        }

        // budgetOptionsを更新（値が実際に変更された場合のみ）
        const budgetOptionsChanged = JSON.stringify(optionRef.current.budgetOptions) !== JSON.stringify(data.budgetOptions);
        if (budgetOptionsChanged) {
          updates.budgetOptions = data.budgetOptions || undefined;
        }

        // 予算情報が自動取得された場合、既に手動で設定されていない場合のみ自動設定
        if (data.budgetMin && data.budgetMax) {
          // 既に予算が設定されていない場合のみ自動設定
          if (!optionRef.current.budgetMin && !optionRef.current.budgetMax) {
            updates.budgetMin = data.budgetMin;
            updates.budgetMax = data.budgetMax;
            updates.showCustomBudget = true;
          }
        } else {
          // 予算情報がない場合で、ぐるなびから別のURLに変更した場合のみ予算をクリア
          // （budgetOptionsがあったが、新しいデータにはない場合）
          if (optionRef.current.budgetOptions && !data.budgetOptions) {
            // ただし、手動で入力された予算は保持する
            // （ぐるなびのオプションから選択した予算のみクリア）
            const wasGurunaviBudget = optionRef.current.budgetOptions.some(
              opt => opt.min === optionRef.current.budgetMin && opt.max === optionRef.current.budgetMax
            );
            if (wasGurunaviBudget) {
              updates.budgetMin = undefined;
              updates.budgetMax = undefined;
            }
          }
        }

        // 更新がある場合のみonOptionChangeを呼ぶ
        if (Object.keys(updates).length > 0) {
          onOptionChangeRef.current(updates);
        }
      } catch (error) {
        console.error('Error fetching OGP:', error);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [option.url]);

  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 0.5,
        border: '1px solid',
        borderColor: urlError ? '#f44336' : '#ddd',
        backgroundColor: 'white',
      }}
    >
      <Box display="flex" gap={2.5} alignItems="center">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: 700,
            flexShrink: 0,
            marginLeft: '4px',
          }}
        >
          {index + 1}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <UrlInput
            value={option.url}
            onChange={(value) => onOptionChange({ url: value })}
            error={urlError || errors?.url?.message}
            register={register(`options.${index}.url`)}
          />
        </Box>
        {canRemove && (
          <IconButton
            onClick={onRemove}
            size="small"
            sx={{
              color: '#f44336',
              backgroundColor: '#ffebee',
              borderRadius: 0.5,
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: '#ffcdd2',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ my: 3, }} />

      <TitleDisplay
        value={option.title || ''}
        onChange={(value) => onOptionChange({ title: value })}
        register={register(`options.${index}.title`)}
        error={errors?.title?.message}
      />

      <BudgetSelector
        option={option}
        onOptionChange={onOptionChange}
        registerMin={register(`options.${index}.budgetMin`)}
        registerMax={register(`options.${index}.budgetMax`)}
        errors={errors}
      />

      <DescriptionInput
        value={option.description || ''}
        onChange={(value) => onOptionChange({ description: value })}
        register={register(`options.${index}.description`)}
        error={errors?.description?.message}
      />
    </Box >
  );
}
