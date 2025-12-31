'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/primitives/form';
import { getResponsiveValue } from '@/utils/styles';

dayjs.locale('ja');

interface AdvancedSettingsProps {
  description?: string;
}

export default function AdvancedSettings({
  description = '指定日時以降の入力を制限します。未設定の場合は無期限で入力を受け付けます。',
}: AdvancedSettingsProps) {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<any>();

  const [dateLimits, setDateLimits] = useState<{
    todayDate: string;
    maxEndDate: string;
    currentTimeString: string;
  } | null>(null);

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    const max = oneMonthLater.toISOString().split('T')[0];

    setDateLimits({
      todayDate: today,
      currentTimeString: time,
      maxEndDate: max,
    });
  }, []);

  const endDate = watch('endDate');
  const endTime = watch('endTime');

  if (!dateLimits) return null;

  const currentDateTime = endDate && endTime ? `${endDate}T${endTime}` : '';
  const minDateTime = `${dateLimits.todayDate}T${dateLimits.currentTimeString}`;

  return (
    <Accordion type="single" collapsible className="rounded-[2px] border border-slate-200 bg-white">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="flex w-full items-center justify-between px-6 py-5 font-bold text-slate-900 transition-colors hover:bg-slate-50 sm:text-[15px] [&[data-state=open]>svg]:rotate-180" style={{ fontSize: getResponsiveValue(15, 16) }}>
          詳細設定
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </AccordionTrigger>
        <AccordionContent className="p-6 border-t border-border">
          <div className="space-y-4">
            <div>
              <FormLabel className="mb-2 block font-semibold text-slate-900" style={{ fontSize: getResponsiveValue(14, 15) }}>
                受付制限
              </FormLabel>

              <p className="mb-4 text-[13px] text-slate-500">{description}</p>

              <div className="flex min-h-[56px] w-full max-w-[320px] items-center">
                <FormField
                  control={control}
                  name="endDate"
                  render={() => (
                    <FormField
                      control={control}
                      name="endTime"
                      render={() => {
                        return (
                          <FormItem className="w-full space-y-1">
                            <FormControl>
                              <input
                                type="datetime-local"
                                value={currentDateTime}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value) {
                                    const [date, time] = value.split('T');
                                    setValue('endDate', date, { shouldValidate: true });
                                    setValue('endTime', time, { shouldValidate: true });
                                  } else {
                                    setValue('endDate', '', { shouldValidate: true });
                                    setValue('endTime', '', { shouldValidate: true });
                                  }
                                }}
                                min={minDateTime}
                                max={`${dateLimits.maxEndDate}T23:59`}
                                className="w-full rounded-[2px] border border-slate-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </FormControl>
                            {(errors.endDate?.message || errors.endTime?.message) && (
                              <p className="text-red-500 text-sm">
                                {String(errors.endDate?.message || errors.endTime?.message || '')}
                              </p>
                            )}
                          </FormItem>
                        );
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
