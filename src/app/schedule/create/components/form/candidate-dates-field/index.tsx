'use client';

import { Calendar as CalendarIcon, Clock, Info } from 'lucide-react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/primitives/alert';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/primitives/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/primitives/tooltip';
import type { ScheduleFormData } from '@/db/validation/types';

// Imports
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import { cn, getResponsiveValue } from '@/utils/styles';

interface CandidateDatesFieldProps {
  control: Control<ScheduleFormData>;
}

export default function CandidateDatesField({ control }: CandidateDatesFieldProps) {
  const dates = useWatch({ control, name: 'dates' });
  const hasDates = dates && dates.length > 0;
  const [activeTab, setActiveTab] = useState('calendar');
  const [showTooltip, setShowTooltip] = useState(false);

  const handleTabChange = (value: string) => {
    if (value === 'time' && !hasDates) {
      setShowTooltip(true);
      // 数秒後に自動で閉じる
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }
    setActiveTab(value);
  };

  return (
    <div className="mb-5 sm:mb-6">
      <FormField
        control={control}
        name="dates"
        render={() => (
          <FormItem className="gap-0">
            <FormLabel className="mb-3 block font-bold  text-slate-900 sm:mb-4" style={{ fontSize: getResponsiveValue(15, 16) }}>
              日程候補 <span className="text-red-500">*</span>
            </FormLabel>

            <Alert className="mb-5 rounded-[2px] border-blue-200 bg-blue-50 px-4 py-4 text-blue-900 sm:mb-6">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription style={{ fontSize: getResponsiveValue(13, 14) }}>
                カレンダーの日付をクリックすると選択 / ダブルクリックで解除できます。
              </AlertDescription>
            </Alert>

            <FormControl>
              <div>
                {/* PC */}
                <div className="hidden items-stretch gap-5 sm:grid sm:grid-cols-[1fr_40%] sm:gap-6">
                  <DateSelector />
                  <TimeSelector />
                </div>

                {/* Mobile */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full sm:hidden">
                  <TabsList className="flex h-auto w-full gap-0 bg-transparent p-0">
                    <TabsTrigger
                      value="calendar"
                      className="relative z-10 flex h-12 flex-1 items-center justify-center gap-2 rounded-none bg-slate-200 pr-6 text-slate-600 transition-colors duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white [clip-path:polygon(0_0,calc(100%-20px)_0,100%_50%,calc(100%-20px)_100%,0_100%)] shadow-none data-[state=active]:shadow-none"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      <span className="font-bold text-[13px]">日付</span>
                    </TabsTrigger>

                    {hasDates ? (
                      <div className="flex-1 relative -ml-[20px]">
                        <TabsTrigger
                          value="time"
                          className="flex h-12 w-full items-center justify-center gap-2 rounded-none bg-slate-200 pl-6 text-slate-600 transition-colors duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,20px_50%)] shadow-none data-[state=active]:shadow-none"
                        >
                          <Clock className="h-4 w-4" />
                          <span className="font-bold text-[13px]">時間</span>
                        </TabsTrigger>
                      </div>
                    ) : (
                      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
                        <TooltipTrigger asChild>
                          <div className="flex-1 relative -ml-[20px]">
                            {/* divでラップしてTooltipTriggerイベントを確実に捕捉させる */}
                            <TabsTrigger
                              value="time"
                              // 日付未選択時は見た目を無効化風にするが、クリックイベントを受け取るためにpointer-events-noneにはしない
                              className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-none bg-slate-100 pl-6 text-slate-400 transition-colors duration-200 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,20px_50%)] shadow-none data-[state=active]:shadow-none"
                            >
                              <Clock className="h-4 w-4" />
                              <span className="font-bold text-[13px]">時間</span>
                            </TabsTrigger>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          className="z-50 rounded-[2px] border-0 bg-gray-800 p-3 text-white"
                          side="top"
                          sideOffset={-10} // 少し近づける
                        >
                          <p className="text-xs">日付を選択すると利用可能になります</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TabsList>
                  <TabsContent value="calendar" className="mt-0 focus-visible:outline-none">
                    <DateSelector />
                  </TabsContent>
                  <TabsContent value="time" className="mt-0 focus-visible:outline-none">
                    <TimeSelector />
                  </TabsContent>
                </Tabs>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
