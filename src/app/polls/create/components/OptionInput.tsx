import { Trash2 } from 'lucide-react';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Separator } from '@/components/primitives/separator';
import type { PollFormData } from '@/db/validation/types';
import type { PollOption } from '../types';
import { DescriptionInput } from './DescriptionInput';
import { TitleDisplay } from './TitleDisplay';
import { UrlInput } from './UrlInput';

export function OptionInput({
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
    <div
      className={`mb-6 rounded-[4px] border border-solid bg-white p-6 transition-colors duration-200 ${
        urlError ? 'border-red-500 bg-red-50/5' : 'border-slate-200'
      }`}
    >
      <div className="flex items-center gap-10">
        <div
          className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] font-bold text-sm text-white shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          }}
        >
          {index + 1}
        </div>
        <div className="flex flex-1 flex-col gap-12">
          <UrlInput
            value={option.url}
            onChange={(value) => onOptionChange({ url: value })}
            error={urlError || errors?.url?.message}
            register={register(`options.${index}.url`)}
          />
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-red-50 text-red-500 transition-all duration-200 hover:scale-105 hover:bg-red-100 hover:text-red-600"
            title="削除"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <Separator className="my-6 bg-slate-100" />

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
    </div>
  );
}
