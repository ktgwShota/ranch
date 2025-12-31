import type { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';

export function DescriptionInput({
  value,
  onChange,
  register,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  register: UseFormRegisterReturn;
  error?: string;
}) {
  const currentLength = String(value || '').length;
  return (
    <div className="mb-0">
      <Label htmlFor={register.name} className="mb-3 block font-bold text-[#1a1a1c] text-base">
        備考
      </Label>
      <div className="relative">
        <Input
          id={register.name}
          type="text"
          placeholder="会社から徒歩10分 / 個室あり / 駐車場なし"
          className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-white px-[14px] py-[16.5px] pr-12 text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
          {...register}
          value={value}
          onChange={(e) => {
            register.onChange(e);
            onChange(e.target.value);
          }}
          maxLength={50}
        />
        <span className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2 font-normal text-[12px] text-[rgba(0,0,0,0.38)]">
          {currentLength}/50
        </span>
      </div>
      {error && <p className="mx-[14px] mt-1 text-red-600 text-xs">{error}</p>}
    </div>
  );
}
