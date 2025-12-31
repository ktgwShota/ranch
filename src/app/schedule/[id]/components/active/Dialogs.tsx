'use client';
import { useState } from 'react';
import { Button } from '@/components/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/dialog';
import { useScheduleData } from '../../hooks/useScheduleData';
import { calculateScore, calculateSummary, formatScore, type ScheduleData } from '../../types';
import StatusIcon from '../shared/StatusIcon';

interface ActionsHook {
  deleteDialogOpen: boolean;
  closeDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  setCloseDialogOpen: (open: boolean) => void;
  handleDeleteConfirm: () => void;
  handleCloseConfirm: (confirmedDateTime: string) => void;
}

interface DialogsProps {
  scheduleData: ScheduleData;
  actionsHook: ActionsHook;
}

export function Dialogs({ scheduleData, actionsHook }: DialogsProps) {
  const { allDateTimes, bestKeys } = useScheduleData({
    dates: scheduleData.dates,
    responses: scheduleData.responses,
  });

  const [selectedDateTime, setSelectedDateTime] = useState<string>('');

  const handleCloseConfirm = () => {
    if (selectedDateTime) {
      actionsHook.handleCloseConfirm(selectedDateTime);
      setSelectedDateTime('');
    }
  };

  const handleCloseCancel = () => {
    setSelectedDateTime('');
    actionsHook.setCloseDialogOpen(false);
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={actionsHook.deleteDialogOpen}
        onOpenChange={(open) => actionsHook.setDeleteDialogOpen(open)}
      >
        <DialogContent className="max-w-[400px] rounded-[2px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-slate-900 text-xl">日程調整を削除</DialogTitle>
            <DialogDescription className="pt-2 text-slate-500">
              この日程調整を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => actionsHook.setDeleteDialogOpen(false)}
              className="rounded-[2px]"
            >
              キャンセル
            </Button>
            <Button
              variant="default"
              onClick={actionsHook.handleDeleteConfirm}
              className="rounded-[2px] bg-red-500 hover:bg-red-600"
            >
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select Date Confirmation Dialog */}
      <Dialog
        open={actionsHook.closeDialogOpen}
        onOpenChange={(open) => !open && handleCloseCancel()}
      >
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-[800px] gap-0 overflow-y-auto rounded-[2px] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="font-bold text-slate-900 text-xl">開催日を決定</DialogTitle>
            <DialogDescription className="text-slate-500">
              候補の中から開催する日時を選択してください。
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            {allDateTimes.map(({ date, time, key }) => {
              const summary = calculateSummary(key, scheduleData.responses);
              const score = calculateScore(summary.available, summary.maybe);
              const isBest = bestKeys.has(key);
              const isSelected = selectedDateTime === key;

              return (
                <div
                  key={key}
                  onClick={() => setSelectedDateTime(key)}
                  className={`relative flex w-full cursor-pointer select-none items-center justify-between overflow-hidden rounded-[2px] border-2 p-6 transition-all duration-200 sm:p-8 ${
                    isSelected
                      ? 'translate-y-[-2px] border-green-500 bg-green-50/50 shadow-[0_4px_12px_rgba(34,197,94,0.15)] ring-1 ring-green-500/20'
                      : isBest
                        ? 'border-green-100 bg-white hover:translate-y-[-2px] hover:border-green-400 hover:bg-slate-50 hover:shadow-md'
                        : 'border-slate-200 bg-white hover:translate-y-[-2px] hover:border-green-400 hover:bg-slate-50 hover:shadow-md'
                  }
                  `}
                >
                  {/* Left: Date & Time */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Visual Indicator/Radio Circle */}
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 ${isSelected ? 'border-green-500 bg-green-500' : 'border-slate-300 bg-transparent'}
                      `}
                    >
                      {isSelected && (
                        <div className="zoom-in-50 h-[10px] w-[10px] animate-in rounded-full bg-white duration-200" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 whitespace-nowrap font-bold text-base text-slate-900 sm:text-lg">
                        {date.format('MM/DD (ddd)')}
                        <span className="ml-1 font-medium text-slate-500 text-sm sm:text-base">
                          {time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score & Details */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="hidden gap-4 md:flex">
                      <div className="flex items-center gap-1.5 opacity-70 grayscale">
                        <StatusIcon status="available" size={14} />
                        <span className="font-semibold text-[12px] text-slate-700">
                          {summary.available}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-70 grayscale">
                        <StatusIcon status="maybe" size={14} />
                        <span className="font-medium text-[12px] text-slate-500">
                          {summary.maybe}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-slate-900 text-xl leading-none sm:text-2xl">
                        {formatScore(score)}
                        <span className="ml-0.5 font-bold text-slate-400 text-xs sm:text-sm">
                          /{scheduleData.responses.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter className="flex-row justify-center gap-4 border-slate-100 border-t p-6">
            <Button
              onClick={handleCloseCancel}
              variant="outline"
              className="rounded-[2px] border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleCloseConfirm}
              variant="default"
              disabled={!selectedDateTime}
              className={`min-w-[140px] rounded-[2px] shadow-lg transition-all duration-300 ${
                selectedDateTime
                  ? 'bg-green-600 shadow-green-500/20 hover:bg-green-700'
                  : 'bg-slate-100 text-slate-300 shadow-none'
              }
              `}
            >
              日程を決定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
