'use client';

import { useRef, useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { type ScheduleTableProps } from '../shared/types';
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
    <Box sx={{
      display: 'flex', minWidth: '100%', width: 'max-content', borderBottom: '1px solid #3b82f6', borderTop: '1px solid #3b82f6', marginTop: '-1px'
    }}>
      {/* 名前入力カラム (左端に固定) */}
      <Box
        sx={{
          width: 100,
          flexShrink: 0,
          position: 'sticky', // ここが重要: 親がスクロールしても固定される
          left: 0,
          zIndex: 10, // 日付セルより上に表示
          backgroundColor: '#EFF6FF', // 背景色がないと透けてしまうため指定
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1.5,
        }}
      >
        <TextField
          size="small"
          placeholder="名前"
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
          variant="standard"
          sx={{
            width: 80,
            '& .MuiInput-root': {
              fontSize: '0.85rem',
              background: 'transparent',
              '&:before': { borderBottomColor: 'rgba(0, 0, 0, 0.42)' },
              '&:after': { borderBottomColor: 'primary.main' },
            },
            '& .MuiInput-input': { textAlign: 'center', padding: 0, margin: 0 },
          }}
        />
      </Box>

      {/* 日付選択カラム (スクロールと一緒に動く) */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {allDateTimes.map(({ key }) => (
          <Box
            key={key}
            onClick={() => toggleAvailability(key)}
            sx={{
              minWidth: 100, // 他のカラム幅と合わせる
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              p: 1.5,
              alignItems: 'center',
              borderRight: '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              '&:last-child': { borderRight: 'none' },
              '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.12)' },
            }}
          >
            <StatusIcon status={myAvailability[key]} size={24} />
          </Box>
        ))}
      </Box>
    </Box>
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
    <Box
      sx={{
        p: 2,
        borderBottom: isLastRow ? 0 : '1px solid #ddd',
        backgroundColor: 'white',
        animation: 'slideDown 0.3s ease-out forwards',
        '@keyframes slideDown': {
          '0%': { maxHeight: 0, opacity: 0, py: 0 },
          '100%': { maxHeight: '100px', opacity: 1, py: '16px' },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Alert severity="info" sx={{ borderRadius: '2px' }}>
          セル（枠）をクリックすると出欠を入力できます。
        </Alert>
        <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
          <Button variant="outlined" size="small" onClick={handleCancelEdit} sx={{ borderRadius: 0.25, py: 1, px: 2 }}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            disabled={!voterName.trim()}
            sx={{ borderRadius: 0.25, py: 1, px: 2 }}
          >
            {isEditing ? '更新' : '送信'}
          </Button>
        </Box>
      </Box>
    </Box>
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
    <Box ref={scrollContainerRef} sx={{ overflowX: 'auto', position: 'relative' }}>
      <Box sx={{ minWidth: '100%', width: 'max-content' }}>
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
              <Box key="editing-row">
                {renderInputRow}
                {renderActionButtons && (
                  <Box sx={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 15,
                    width: stickyWidth,
                    backgroundColor: 'white'
                  }}>
                    {renderActionButtons(isLastRow)}
                  </Box>
                )}
              </Box>
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
          <Box>
            {renderInputRow}
            {renderActionButtons && (
              <Box sx={{
                position: 'sticky',
                left: 0,
                zIndex: 15,
                width: stickyWidth,
                backgroundColor: 'white'
              }}>
                {renderActionButtons(true)}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

// --- Main Component ---

export default function ActiveTableDesktop({
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
    <Box ref={rootRef}>
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
        renderActionButtons={(isLastRow) => (
          showEditMode ? (
            <DesktopEditActions
              isEditing={isEditing}
              voterName={voterName}
              handleCancelEdit={handleCancelEdit}
              handleSubmit={handleSubmit}
              isLastRow={isLastRow}
            />
          ) : null
        )}
      />

      {/* Footer Actions (編集モードでない時) */}
      {!isClosed && !showEditMode && (
        <Box sx={{ p: 2, borderTop: allResponses.length === 0 ? 'none' : '1px solid #ddd' }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={isSubmitted ? <EditIcon /> : <AddIcon />}
            onClick={() => handleStartEdit(isSubmitted ? handleEdit : () => setShowInputForm(true))}
            sx={{ p: 1.5, borderRadius: '2px', fontWeight: 600 }}
          >
            {isSubmitted ? '出欠を編集' : '出欠を入力'}
          </Button>
        </Box>
      )}
    </Box>
  );
}