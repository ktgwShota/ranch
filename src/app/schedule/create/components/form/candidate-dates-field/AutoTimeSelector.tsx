'use client';

import { Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/primitives/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/primitives/dialog';
import type { Dayjs } from '@/lib/dayjs';
import dayjs from '@/lib/dayjs';
import { getResponsiveValue } from '@/utils/styles';

interface AutoTimeSelectorProps {
  isAutoTimeEnabled: boolean;
  setIsAutoTimeEnabled: (val: boolean) => void;
  autoTimeValue: Dayjs | null;
  setAutoTimeValue: (val: Dayjs | null) => void;
  revision: number;
  setRevision: (fn: (prev: number) => number) => void;
}

export const AutoTimeSelector = ({
  isAutoTimeEnabled,
  setIsAutoTimeEnabled,
  autoTimeValue,
  setAutoTimeValue,
  revision,
  setRevision,
}: AutoTimeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempTime, setTempTime] = useState(autoTimeValue?.format('HH:mm') || '19:00');

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    if (isAutoTimeEnabled) {
      setIsAutoTimeEnabled(false);
      setAutoTimeValue(null);
    } else {
      setIsOpen(true);
    }
  };

  const handleAccept = () => {
    if (tempTime) {
      const [hours, minutes] = tempTime.split(':');
      const newValue = dayjs().hour(parseInt(hours, 10)).minute(parseInt(minutes, 10));
      setAutoTimeValue(newValue);
      setIsAutoTimeEnabled(true);
      setRevision((prev) => prev + 1);
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant={isAutoTimeEnabled ? 'default' : 'outline'}
        onClick={handleClick}
        className={`font-semibold rounded-[2px] ${isAutoTimeEnabled
          ? ''
          : 'border-gray-200 text-gray-500 hover:border-gray-900 hover:bg-black/5'
          }`}
        style={{
          fontSize: getResponsiveValue(12, 13),
        }}
      >
        {isAutoTimeEnabled && autoTimeValue ? autoTimeValue.format('HH:mm') : '時間自動追加'}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>自動追加する時間を選択</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <input
                  type="time"
                  value={tempTime}
                  onChange={(e) => setTempTime(e.target.value)}
                  step="300"
                  className="flex-1 rounded-[2px] border border-gray-300 px-3 py-2 text-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  キャンセル
                </Button>
                <Button type="button" variant="default" onClick={handleAccept}>
                  OK
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
