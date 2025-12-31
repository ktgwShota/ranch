'use client';

import { Edit2, Info, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/primitives/alert';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import type { ScheduleTableProps } from '../../types';
import StatusIcon from '../shared/StatusIcon';
import TableHeader from '../shared/TableHeader';
import TableRow from '../shared/TableRow';

// --- 1. 入力行コンポーネント（スクロール内部に配置） ---
// 独自のスクロールを持たず、親のスクロールに従います。
// ただし、名前入力欄だけは sticky で固定します。
const DesktopInputRow = ({
  allDateTimes,
  voterName,
  setVoterName,
  myAvailability,
  toggleAvailability,
}: {
  allDateTimes: ScheduleTableProps['allDateTimes'];
  voterName: string;
  setVoterName: (name: string) => void;
  myAvailability: ScheduleTableProps['myAvailability'];
  toggleAvailability: (key: string) => void;
}) => {
  return (
    <div className="-mt-[1px] flex w-max min-w-full border-blue-500 border-t border-b">
      {/* 名前入力カラム (左端に固定) */}
      <div className="sticky left-0 z-10 flex w-[100px] shrink-0 items-center justify-center border-slate-200 border-r bg-blue-50 p-6">
        <Input
          type="text"
          placeholder="名前"
          value={voterName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVoterName(e.target.value)}
          className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-transparent px-0 py-0 text-center text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
          style={{ width: '80px', height: '32px' }}
        />
      </div>

      {/* 日付選択カラム (スクロールと一緒に動く) */}
      <div className="flex flex-1">
        {allDateTimes.map(({ key }, _index) => (
          <div
            key={key}
            onClick={() => toggleAvailability(key)}
            className="flex min-w-[100px] flex-1 cursor-pointer items-center justify-center border-slate-200 border-r bg-blue-50/20 p-6 transition-colors duration-150 last:border-r-0 hover:bg-blue-50/40"
          >
            <StatusIcon status={myAvailability[key]} size={24} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 2. アクションボタンエリア（スクロールの外に配置） ---
const DesktopEditActions = ({
  isEditing,
  voterName,
  handleCancelEdit,
  handleSubmit,
  isLastRow,
}: {
  isEditing: boolean;
  voterName: string;
  handleCancelEdit: () => void;
  handleSubmit: () => void;
  isLastRow: boolean;
}) => {
  return (
    <div
      className={`animate-[slideDown_0.3s_ease-out_forwards] bg-white p-8 ${isLastRow ? '' : 'border-gray-200 border-b'}`}
    >
      <div className="flex items-center justify-between gap-8">
        <Alert className="rounded-[2px] border-blue-100 bg-blue-50/50 py-3">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="ml-2 font-medium text-blue-700">
            セル（枠）をクリックすると出欠を入力できます。
          </AlertDescription>
        </Alert>
        <div className="flex shrink-0 gap-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelEdit}
            className="h-auto rounded-[2px] px-4 py-2"
          >
            キャンセル
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSubmit}
            disabled={!voterName.trim()}
            className="h-auto rounded-[2px] px-4 py-2"
          >
            {isEditing ? '更新' : '送信'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- 3. メインリスト（入力行を受け取れるように変更） ---
const DesktopResponseList = ({
  allDateTimes,
  allResponses,
  bestKeys,
  confirmedDateTime,
  respondentId,
  isEditing,
  showInputForm,
  handleEdit,
  renderInputRow,
  renderActionButtons,
}: {
  allDateTimes: ScheduleTableProps['allDateTimes'];
  allResponses: ScheduleTableProps['allResponses'];
  bestKeys: Set<string>;
  confirmedDateTime: string | null;
  respondentId: string | null;
  isEditing: boolean;
  showInputForm: boolean; // "新規追加" モードかどうか
  handleEdit: () => void;
  renderInputRow?: React.ReactNode;
  renderActionButtons?: (isLastRow: boolean) => React.ReactNode;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [stickyWidth, setStickyWidth] = useState<number | string>('100%');

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const updateWidth = () => {
      if (scrollContainerRef.current) {
        setStickyWidth(scrollContainerRef.current.clientWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(scrollContainerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scrollContainerRef} className="relative overflow-x-auto">
      <div className="w-max min-w-full">
        {/* Header */}
        <TableHeader
          allDateTimes={allDateTimes}
          responses={allResponses}
          confirmedDateTime={confirmedDateTime}
          bestKeys={bestKeys}
          confirmedLabel="確定"
        />

        {/* Responses Rows */}
        {allResponses.map((response, index) => {
          const isMyResponse = response.respondentId === respondentId;
          const isLastRow = index === allResponses.length - 1;

          // ★変更点: 自分が編集中なら、TableRowの代わりにInputRowを表示
          if (isMyResponse && isEditing) {
            return (
              <div key="editing-row">
                {renderInputRow}
                {renderActionButtons && (
                  <div
                    className="sticky left-0 z-[15] bg-white"
                    style={{
                      width: stickyWidth,
                    }}
                  >
                    {renderActionButtons(isLastRow)}
                  </div>
                )}
              </div>
            );
          }

          return (
            <TableRow
              key={`${response.name}-${index}`}
              response={response}
              allDateTimes={allDateTimes}
              bestKeys={bestKeys}
              isMyResponse={isMyResponse}
              showMyBadge={true}
              onEdit={isMyResponse ? handleEdit : undefined}
            />
          );
        })}

        {/* ★変更点: "新規追加(showInputForm)" の時だけ末尾に表示 */}
        {showInputForm && !isEditing && (
          <div>
            {renderInputRow}
            {renderActionButtons && (
              <div
                className="sticky left-0 z-[15] bg-white"
                style={{
                  width: stickyWidth,
                }}
              >
                {renderActionButtons(true)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---

export default function DesktopTable({
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
  const showEditMode = showInputForm || isEditing;
  const rootRef = useRef<HTMLDivElement>(null);

  const handleStartEdit = (callback: () => void) => {
    // ...既存のスクロール処理...
    const element = rootRef.current;
    if (!element) {
      callback();
      return;
    }
    const rect = element.getBoundingClientRect();
    const targetTop = window.innerHeight / 2 - 100;
    const currentTop = rect.top;
    if (Math.abs(currentTop - targetTop) < 50) {
      callback();
      return;
    }
    const scrollY = window.scrollY + currentTop - targetTop;
    window.scrollTo({ top: scrollY, behavior: 'smooth' });
    setTimeout(callback, 500);
  };

  return (
    <div ref={rootRef}>
      {/* DesktopResponseList に入力行(InputRow)を渡して、
        リストと同じスクロール領域内でレンダリングさせる 
      */}
      <DesktopResponseList
        allDateTimes={allDateTimes}
        allResponses={allResponses}
        bestKeys={bestKeys}
        confirmedDateTime={confirmedDateTime}
        respondentId={respondentId}
        isEditing={isEditing}
        showInputForm={showInputForm}
        handleEdit={() => handleStartEdit(handleEdit)}
        // ★ 入力行をここへ渡す
        renderInputRow={
          <DesktopInputRow
            allDateTimes={allDateTimes}
            voterName={voterName}
            setVoterName={setVoterName}
            myAvailability={myAvailability}
            toggleAvailability={toggleAvailability}
          />
        }
        renderActionButtons={(isLastRow) =>
          showEditMode ? (
            <DesktopEditActions
              isEditing={isEditing}
              voterName={voterName}
              handleCancelEdit={handleCancelEdit}
              handleSubmit={handleSubmit}
              isLastRow={isLastRow}
            />
          ) : null
        }
      />

      {/* Footer Actions (編集モードでない時) */}
      {!isClosed && !showEditMode && (
        <div className={`p-8 ${allResponses.length === 0 ? '' : 'border-gray-200 border-t'}`}>
          <Button
            variant="default"
            size="lg"
            onClick={() => handleStartEdit(isSubmitted ? handleEdit : () => setShowInputForm(true))}
            className="h-auto w-full gap-2 rounded-[2px] p-3 font-semibold"
          >
            {isSubmitted ? <Edit2 size={20} /> : <Plus size={20} />}
            {isSubmitted ? '出欠を編集' : '出欠を入力'}
          </Button>
        </div>
      )}
    </div>
  );
}
