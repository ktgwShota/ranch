'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/primitives/form';
import { Input } from '@/components/primitives/input';
import type { ScheduleFormData } from '@/db/validation/types';
import { getResponsiveValue } from '@/utils/styles';

export default function TitleInput() {
  const { control } = useFormContext<ScheduleFormData>();

  return (
    <div style={{ paddingTop: getResponsiveValue(2, 4), marginBottom: getResponsiveValue(20, 28) }}>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem style={{ gap: getResponsiveValue(12, 16) }}>
            <FormLabel
              className="font-bold text-[#1a202c]"
              style={{ fontSize: getResponsiveValue(15, 16) }}
            >
              タイトル <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-white px-[14px] py-[16px] text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
                placeholder="忘年会の日程はいつがいい？"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
