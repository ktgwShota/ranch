'use client';

import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Divider, IconButton } from '@mui/material';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { PollFormData } from '@/lib/schemas/poll';
import { PollOption } from '../types';
import { UrlInput } from './UrlInput';
import { DescriptionInput } from './DescriptionInput';
import { TitleDisplay } from './TitleDisplay';

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

      <DescriptionInput
        value={option.description || ''}
        onChange={(value) => onOptionChange({ description: value })}
        register={register(`options.${index}.description`)}
        error={errors?.description?.message}
      />
    </Box >
  );
}
