'use client';

import { Box } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import type { Dayjs } from '@/lib/dayjs';
import { useDateSelectionContext } from './DateSelectionContext';

interface CustomDayProps extends PickersDayProps {
}

export const CustomDay = (props: CustomDayProps) => {
  const { day, outsideCurrentMonth, ...other } = props;
  const {
    isDateSelected,
    lastSelectedDates,
    isPastDate,
    handleDateClick,
    defaultTime,
    addTimeToDate
  } = useDateSelectionContext();

  const isSelected = isDateSelected(day);
  // lastSelectedDates (TimePanelで表示中の日付) に含まれているかどうか
  const isCurrentEditing = lastSelectedDates.some(d => d.format('YYYY-MM-DD') === day.format('YYYY-MM-DD'));
  const isPast = isPastDate(day);

  return (
    <Box
      onClick={(e) => {
        e.preventDefault();
        if (!outsideCurrentMonth && !isPast) {
          handleDateClick(day);

          // 自動入力時間が設定されていて、かつ「まだ選択されていない（これから選択される）」場合、時間も追加
          if (!isSelected && defaultTime) {
            addTimeToDate(day, defaultTime);
          }
        }
      }}
      sx={{
        position: 'relative',
        padding: '2px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '14.28%', // 7等分
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        cursor: isPast ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        opacity: isPast ? 0.4 : 1,
      }}
    >
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        disabled={isPast}
        disableMargin
        sx={{
          width: '100%',
          height: '100%',
          minWidth: 0,
          minHeight: 0,
          fontSize: '13px',
          zIndex: 1,
          pointerEvents: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor:
            ((isCurrentEditing && !isPast))
              ? 'primary.main'
              : 'transparent',
          color:
            (isCurrentEditing && !isPast)
              ? 'primary.contrastText'
              : undefined,
          border: (isCurrentEditing && !isPast) ? '2px solid' : (isSelected && !isCurrentEditing && !isPast) ? '1px solid' : 'none',
          borderColor: (isCurrentEditing && !isPast) ? '#FF9500' : 'primary.main',
          '&:hover': {
            backgroundColor: isSelected
              ? (isCurrentEditing ? 'primary.dark' : 'rgba(25, 118, 210, 0.15)')
              : 'rgba(25, 118, 210, 0.1)',
          },
          '&.MuiPickersDay-today': {
            border: 'none',
          },
        }}
      />
    </Box>
  );
};
