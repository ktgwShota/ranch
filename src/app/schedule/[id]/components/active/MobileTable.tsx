'use client';

import { ChevronLeft, ChevronRight, Edit2, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/primitives/button';
import { Dialog, DialogContent } from '@/components/primitives/dialog';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { FormattedDate } from '@/components/ui/FormattedDate';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { calculateScore, calculateSummary, type ScheduleTableProps } from '../../types';
import { DateStatusCard } from '../shared/DateStatusCard';
import { ScoreProgressBar } from '../shared/ScoreProgressBar';
import StatusIcon, { setStatusDirectly } from '../shared/StatusIcon';

const DateScrollList = ({
  allDateTimes,
  allResponses,
  selectedIndex,
  setSelectedIndex,
  bestKeys,
  confirmedDateTime,
}: {
  allDateTimes: ScheduleTableProps['allDateTimes'];
  allResponses: ScheduleTableProps['allResponses'];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  bestKeys: Set<string>;
  confirmedDateTime: string | null;
}) => (
  <div
    className="scrollbar-none flex gap-6 overflow-x-auto border-[#e5e7eb] border-b bg-[#fafafa] p-6"
    style={{
      scrollbarWidth: 'none',
    }}
  >
    {allDateTimes.map(({ date, time, key }, index) => {
      const tabSummary = calculateSummary(key, allResponses);
      const tabScore = calculateScore(tabSummary.available, tabSummary.maybe);
      const isTabBest = bestKeys.has(key);
      const isTabConfirmed = confirmedDateTime === key;
      const isSelected = index === selectedIndex;

      return (
        <DateStatusCard
          key={key}
          date={date}
          time={time}
          score={tabScore}
          total={allResponses.length}
          isConfirmed={isTabConfirmed}
          isBest={isTabBest}
          isSelected={isSelected}
          onClick={() => setSelectedIndex(index)}
          className={isSelected ? 'border-2 border-blue-500' : 'border border-gray-200'}
        />
      );
    })}
  </div>
);

const ResponseList = ({
  allResponses,
  respondentId,
  selectedKey,
  onEdit,
}: {
  allResponses: ScheduleTableProps['allResponses'];
  respondentId: string | null;
  selectedKey: string;
  onEdit: () => void;
}) => {
  const sortedResponses = allResponses;

  return (
    <div>
      {sortedResponses.map((response, index) => {
        const isMyResponse = response.respondentId === respondentId;

        return (
          <div
            key={`${response.name}-${index}`}
            className="flex items-center justify-between border-[#f0f0f0] border-b px-8 py-6 last:border-b-0"
          >
            <div
              onClick={isMyResponse ? onEdit : undefined}
              className={`text-[14px] ${isMyResponse ? 'cursor-pointer font-semibold text-blue-600 hover:opacity-70' : 'font-medium text-slate-900'} flex items-center gap-1`}
            >
              {response.name}
              {isMyResponse && <span className="ml-0.5 text-[10px] text-blue-600">(Me)</span>}
            </div>
            <StatusIcon status={response.availability[selectedKey]} size={24} />
          </div>
        );
      })}
    </div>
  );
};

export default function MobileTable({
  allDateTimes,
  allResponses,
  bestKeys,
  isClosed,
  confirmedDateTime,
  voterName,
  setVoterName,
  myAvailability,
  toggleAvailability,
  isSubmitted,
  isEditing,
  showInputForm,
  setShowInputForm,
  respondentId,
  handleEdit,
  handleCancelEdit,
  handleSubmit,
}: ScheduleTableProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMobile = useMediaQuery('(max-width: 639px)');
  const selectedDateTime = allDateTimes[selectedIndex];
  const selectedKey = selectedDateTime?.key;

  const showOverlay = (showInputForm || isEditing) && isMobile;
  const rootRef = useRef<HTMLDivElement>(null);

  const handleStartEdit = (callback: () => void) => {
    // No scrolling needed for Dialog
    callback();
  };

  return (
    <div ref={rootRef} className="relative">
      <Dialog open={showOverlay} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="gap-0 overflow-hidden rounded-[2px] p-0 sm:max-w-xs">
          <div className="p-10 pb-0">
            {selectedDateTime && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
                    disabled={selectedIndex === 0}
                    className="p-1 text-slate-400 disabled:text-slate-200"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex flex-col items-center gap-1">
                    <div className="font-semibold text-[18px]">
                      <FormattedDate date={selectedDateTime.date} />
                    </div>
                    <div className="text-[14px] text-slate-500">{selectedDateTime.time || '-'}</div>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedIndex((prev) => Math.min(allDateTimes.length - 1, prev + 1))
                    }
                    disabled={selectedIndex === allDateTimes.length - 1}
                    className="p-1 text-slate-400 disabled:text-slate-200"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <ScoreProgressBar
                  score={calculateScore(
                    calculateSummary(selectedKey, allResponses).available,
                    calculateSummary(selectedKey, allResponses).maybe
                  )}
                  total={allResponses.length}
                  fontSize="13px"
                  className="mt-1"
                />
              </>
            )}
          </div>

          <div className="overflow-y-auto p-10">
            <div className="mb-4">
              <Label htmlFor="voterName" className="mb-3 block font-bold text-[#1a1a1c] text-base">
                名前
              </Label>
              <Input
                id="voterName"
                type="text"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-white px-[14px] py-[16.5px] text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
              />
            </div>

            <div className="mb-8 flex justify-center gap-10 border-[#e5e7eb] border-t border-b py-10">
              {(['available', 'maybe', 'unavailable'] as const).map((statusOption) => {
                const currentStatus = myAvailability[selectedKey];
                const isCurrentStatus = currentStatus === statusOption;
                return (
                  <div
                    key={statusOption}
                    onClick={() => {
                      if (!isCurrentStatus) {
                        setStatusDirectly(currentStatus, statusOption, () =>
                          toggleAvailability(selectedKey)
                        );
                      }
                    }}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-[2px] border-2 p-6 transition-all duration-200 ${
                      isCurrentStatus
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-transparent bg-transparent hover:bg-blue-50/50'
                    }`}
                  >
                    <StatusIcon status={statusOption} size={24} />
                  </div>
                );
              })}
            </div>

            <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(75px,1fr))] gap-[10px]">
              {allDateTimes.map(({ date, key }, idx) => {
                const myStatus = myAvailability[key] ?? 'unavailable';
                const colorClasses = {
                  available: 'bg-green-500',
                  maybe: 'bg-orange-500',
                  unavailable: 'bg-red-500',
                };
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedIndex(idx)}
                    className={`h-8 w-full rounded-[2px] font-medium text-[11px] text-white transition-opacity hover:opacity-90 ${colorClasses[myStatus]}
                      ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                    `}
                  >
                    <FormattedDate date={date} />
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleCancelEdit}
                className="w-full rounded-[2px] text-[13px]"
              >
                キャンセル
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handleSubmit}
                disabled={!voterName.trim()}
                className="w-full rounded-[2px] text-[13px]"
              >
                {isEditing ? '更新' : '送信'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Normal Mode Mode Date Tabs */}
      <DateScrollList
        allDateTimes={allDateTimes}
        allResponses={allResponses}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        bestKeys={bestKeys}
        confirmedDateTime={confirmedDateTime}
      />

      {/* Selected Date Details */}
      {selectedDateTime && (
        <div>
          <ResponseList
            allResponses={allResponses}
            respondentId={respondentId}
            selectedKey={selectedKey}
            onEdit={() => handleStartEdit(handleEdit)}
          />

          {/* Action Button */}
          {!isClosed && (
            <div className={`p-8 ${allResponses.length === 0 ? '' : 'border-gray-200 border-t'}`}>
              <Button
                variant="default"
                size="lg"
                onClick={() =>
                  handleStartEdit(isSubmitted ? handleEdit : () => setShowInputForm(true))
                }
                className="w-full gap-2 rounded-[2px] p-3 font-semibold"
              >
                {isSubmitted ? <Edit2 size={20} /> : <Plus size={20} />}
                {isSubmitted ? '出欠を編集' : '出欠を入力'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
