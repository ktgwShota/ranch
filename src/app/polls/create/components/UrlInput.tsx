import type { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';

export function UrlInput({
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
  return (
    <div className="mb-8">
      <Label htmlFor={register.name} className="mb-3 block font-bold text-[#1a1a1c] text-base">
        URL<span className="ml-0.5 text-[#d32f2f]">*</span>
      </Label>
      <Input
        id={register.name}
        type="text"
        placeholder="https://tabelog.com/..."
        className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-white px-[14px] py-[16.5px] text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
        {...register}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          register.onChange(e);
          onChange(e.target.value);
        }}
      />
      {error && <p className="mx-[14px] mt-1 text-red-600 text-xs">{error}</p>}
    </div>
  );
}
