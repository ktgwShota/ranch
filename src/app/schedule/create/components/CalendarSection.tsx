'use client';

import { useRef, useMemo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import { useDateSelection } from '../hooks/useDateSelection';

// 15分刻みの時刻リストを生成
const TIME_SLOTS = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4).toString().padStart(2, '0');
  const minute = ((i % 4) * 15).toString().padStart(2, '0');
  return `${hour}:${minute}`;
});

interface CalendarSectionProps {
  dateSelection: ReturnType<typeof useDateSelection>;
}

const quickSelectButtonStyle = {
  borderRadius: 3,
  px: 2,
  py: 1,
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  justifyContent: 'flex-start',
  backgroundColor: '#f5f5f5',
  color: 'text.primary',
  border: 'none',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
};

export default function CalendarSection({ dateSelection }: CalendarSectionProps) {
  const {
    currentEditingDate,
    lastSelectedDates,
    selectedDates,
    setSelectedDates,
    handleDateMouseDown,
    handleDateMouseUp,
    handleDateMouseLeave,
    handleDateHover,
    isDateSelected,
    getConsecutiveRangePosition,
    isInPreviewRange,
    isRangeStartDate,
    isRangeEndDate,
    isPastDate,
    selectThisWeekWeekdays,
    selectNextWeekWeekdays,
    selectThisWeekend,
    selectNextWeekend,
    resetSelection,
  } = dateSelection;

  const timeListRef = useRef<HTMLDivElement>(null);

  // 選択中の日付に追加済みの時刻を取得
  const addedTimes = useMemo(() => {
    if (lastSelectedDates.length === 0) return new Set<string>();

    // 選択中のすべての日付で共通して追加されている時刻を取得
    const timeSets = lastSelectedDates.map(date => {
      const dateKey = date.format('YYYY-MM-DD');
      const found = selectedDates.find(d => d.date.format('YYYY-MM-DD') === dateKey);
      return new Set(found?.times || []);
    });

    if (timeSets.length === 0) return new Set<string>();

    // 最初の日付の時刻のうち、全ての日付に存在するものだけを返す
    const commonTimes = new Set<string>();
    for (const time of timeSets[0]) {
      if (timeSets.every(set => set.has(time))) {
        commonTimes.add(time);
      }
    }
    return commonTimes;
  }, [lastSelectedDates, selectedDates]);

  // 時刻をクリックしたときの処理
  const handleTimeClick = (time: string) => {
    if (lastSelectedDates.length === 0) return;

    const isAdded = addedTimes.has(time);

    setSelectedDates(prev => {
      const updatedDates = [...prev];
      for (const targetDate of lastSelectedDates) {
        const dateKey = targetDate.format('YYYY-MM-DD');
        const existingDateIndex = updatedDates.findIndex(
          d => d.date.format('YYYY-MM-DD') === dateKey
        );

        if (existingDateIndex >= 0) {
          if (isAdded) {
            // 既に追加済みなら削除
            updatedDates[existingDateIndex].times = updatedDates[existingDateIndex].times.filter(t => t !== time);
          } else {
            // 未追加なら追加
            if (!updatedDates[existingDateIndex].times.includes(time)) {
              updatedDates[existingDateIndex].times.push(time);
              updatedDates[existingDateIndex].times.sort();
            }
          }
        } else if (!isAdded) {
          // 日付がまだ存在しなければ追加
          updatedDates.push({ date: targetDate, times: [time] });
        }
      }
      return updatedDates;
    });
  };

  // カスタム日付レンダラー
  const CustomDay = (props: any) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const isSelected = isDateSelected(day);
    const isCurrentEditing = day.format('YYYY-MM-DD') === currentEditingDate.format('YYYY-MM-DD');
    const inPreviewRange = isInPreviewRange(day);
    const isStartOfPreview = isRangeStartDate(day);
    const isEndOfPreview = isRangeEndDate(day);
    const isPast = isPastDate(day);
    const rangePosition = getConsecutiveRangePosition(day);

    const showRangeBackground = rangePosition && rangePosition !== 'single' && !outsideCurrentMonth && !isPast;
    const isRangeEdge = rangePosition === 'start' || rangePosition === 'end';
    const isRangeMiddle = rangePosition === 'middle';

    const getRangeBackgroundStyle = () => {
      if (!showRangeBackground && !(inPreviewRange && !outsideCurrentMonth && !isPast)) return {};

      let left: string | number = 0;
      let right: string | number = 0;

      if (inPreviewRange && !isSelected) {
        left = isStartOfPreview ? '50%' : 0;
        right = isEndOfPreview ? '50%' : 0;
      } else if (showRangeBackground) {
        if (rangePosition === 'start') {
          left = '50%';
          right = 0;
        } else if (rangePosition === 'end') {
          left = 0;
          right = '50%';
        } else if (rangePosition === 'middle') {
          left = 0;
          right = 0;
        }
      }

      return {
        content: '""',
        position: 'absolute',
        top: '50%',
        left,
        right,
        height: 40,
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(25, 118, 210, 0.15)',
        zIndex: 0,
      };
    };

    return (
      <Box
        onMouseDown={(e) => {
          e.preventDefault();
          if (!outsideCurrentMonth && !isPast) {
            handleDateMouseDown(day);
          }
        }}
        onMouseUp={() => {
          if (!outsideCurrentMonth && !isPast) {
            handleDateMouseUp(day);
          }
        }}
        onMouseEnter={() => {
          if (!outsideCurrentMonth && !isPast) {
            handleDateHover(day);
          }
        }}
        onMouseLeave={handleDateMouseLeave}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          cursor: isPast ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          opacity: isPast ? 0.4 : 1,
          '&::before': (showRangeBackground || (inPreviewRange && !outsideCurrentMonth && !isPast))
            ? getRangeBackgroundStyle()
            : {},
        }}
      >
        <PickersDay
          {...other}
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
          disabled={isPast}
          disableMargin
          sx={{
            width: 40,
            height: 40,
            zIndex: 1,
            pointerEvents: 'none',
            backgroundColor:
              ((isStartOfPreview || isEndOfPreview) && !outsideCurrentMonth && !isPast)
                ? 'primary.main'
                : (isRangeEdge || rangePosition === 'single') && !isPast
                  ? 'primary.main'
                  : isRangeMiddle && !isPast
                    ? 'transparent'
                    : (inPreviewRange && !outsideCurrentMonth && !isPast)
                      ? 'transparent'
                      : undefined,
            color:
              ((isStartOfPreview || isEndOfPreview) && !outsideCurrentMonth && !isPast)
                ? 'primary.contrastText'
                : (isRangeEdge || rangePosition === 'single') && !isPast
                  ? 'primary.contrastText'
                  : undefined,
            border: isCurrentEditing && !isSelected && !isPast ? '2px solid' : 'none',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: isSelected
                ? 'primary.dark'
                : 'rgba(25, 118, 210, 0.1)',
            },
          }}
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        mb: 3,
      }}
    >
      {/* クイック選択ボタン */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 100 }}>
        <Button variant="text" size="small" onClick={selectThisWeekWeekdays} sx={quickSelectButtonStyle}>
          今週（平日）
        </Button>
        <Button variant="text" size="small" onClick={selectThisWeekend} sx={quickSelectButtonStyle}>
          今週（週末）
        </Button>
        <Button variant="text" size="small" onClick={selectNextWeekWeekdays} sx={quickSelectButtonStyle}>
          来週（平日）
        </Button>
        <Button variant="text" size="small" onClick={selectNextWeekend} sx={quickSelectButtonStyle}>
          来週（週末）
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={resetSelection}
          disabled={selectedDates.length === 0}
          sx={{
            ...quickSelectButtonStyle,
            backgroundColor: 'transparent',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          リセット
        </Button>
      </Box>

      {/* カレンダー */}
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 0.5,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <DateCalendar
          slots={{ day: CustomDay }}
          minDate={dayjs()}
          slotProps={{
            calendarHeader: { format: 'YYYY年 M月' },
          }}
          sx={{
            '& .MuiPickersCalendarHeader-root': { paddingLeft: 2, paddingRight: 2 },
            '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
              display: 'flex',
              justifyContent: 'center',
              gap: 0,
            },
            '& .MuiDayCalendar-weekDayLabel': { width: 40, height: 40, margin: 0 },
            '& .MuiDayCalendar-slideTransition': { minHeight: 240 },
          }}
        />
      </Box>

      {/* 時間選択パネル */}
      <Box
        sx={{
          flex: 1,
          border: '1px solid #e0e0e0',
          borderRadius: 0.5,
          overflow: 'hidden',
          minWidth: 140,
          maxWidth: 180,
          display: 'flex',
          flexDirection: 'column',
          opacity: lastSelectedDates.length === 0 ? 0.4 : 1,
          transition: 'opacity 0.2s ease',
        }}
      >
        <Box sx={{ p: 1.5, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
          {lastSelectedDates.length > 1 ? (
            <Typography variant="subtitle2" sx={{ fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
              {lastSelectedDates[0].format('M月D日')} ~ {lastSelectedDates[lastSelectedDates.length - 1].format('M月D日')}
            </Typography>
          ) : lastSelectedDates.length === 1 ? (
            <Typography variant="subtitle2" sx={{ fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
              {lastSelectedDates[0].format('M月D日 (ddd)')}
            </Typography>
          ) : (
            <Typography variant="subtitle2" sx={{ fontSize: '13px', fontWeight: 600, textAlign: 'center', color: 'text.secondary' }}>
              時間を選択
            </Typography>
          )}
        </Box>

        <Box
          ref={timeListRef}
          sx={{
            flex: 1,
            overflowY: lastSelectedDates.length === 0 ? 'hidden' : 'auto',
            maxHeight: 280,
            pointerEvents: lastSelectedDates.length === 0 ? 'none' : 'auto',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#ccc',
              borderRadius: 3,
            },
          }}
        >
          {TIME_SLOTS.map((time) => {
            const isAdded = addedTimes.has(time);
            const isDisabled = lastSelectedDates.length === 0;

            return (
              <Box
                key={time}
                onClick={() => !isDisabled && handleTimeClick(time)}
                sx={{
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: isAdded ? 600 : 400,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  color: isAdded ? 'white' : 'text.primary',
                  backgroundColor: isAdded ? 'primary.main' : 'transparent',
                  transition: 'all 0.15s ease',
                  borderBottom: '1px solid #f0f0f0',
                  '&:hover': {
                    backgroundColor: isDisabled
                      ? 'transparent'
                      : isAdded
                        ? 'primary.dark'
                        : 'action.hover',
                  },
                }}
              >
                {time}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

