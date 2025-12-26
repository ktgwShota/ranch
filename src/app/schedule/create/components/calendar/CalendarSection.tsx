'use client';

import { useMemo, useState } from 'react';
import { Box, Button, Tabs, Tab, useTheme, useMediaQuery, Alert, Tooltip } from '@mui/material';
import { CalendarToday, AccessTime } from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { type Dayjs } from '@/lib/dayjs';
import type { useDateSelection } from '../../hooks/useDateSelection';

import SelectedDatesPreview from '../SelectedDatesPreview';
import { DateSelectionProvider } from './DateSelectionContext';
import { AutoTimeSelector } from './AutoTimeSelector';
import { CustomCalendarHeader } from './CustomCalendarHeader';
import { DesktopTimePanel } from './DesktopTimePanel';
import { CustomDay } from './CustomDay';

interface CalendarSectionProps {
  dateSelection: ReturnType<typeof useDateSelection>;
  onRemoveDate: (date: string) => void;
}


export default function CalendarSection({ dateSelection, onRemoveDate }: CalendarSectionProps) {
  const theme = useTheme();
  // sm (600px) 以下をモバイルレイアウトとする
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);

  // 時間自動入力の設定
  const [isAutoTimeEnabled, setIsAutoTimeEnabled] = useState(false);
  const [autoTimeValue, setAutoTimeValue] = useState<Dayjs | null>(dayjs().hour(19).minute(0));
  const [autoTimeRevision, setAutoTimeRevision] = useState(0);

  // 実際に使用する自動入力時間 (文字列)
  const defaultTime = isAutoTimeEnabled && autoTimeValue ? autoTimeValue.format('HH:mm') : null;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const {
    handleDateClick,
    lastSelectedDates,
    selectedDates,
    setSelectedDates,
    isDateSelected,
    isPastDate,
  } = dateSelection;



  // 特定の日付に時間を追加するヘルパー
  const addTimeToDate = (targetDate: Dayjs, timeToAdd: string) => {
    setSelectedDates(prev => {
      const updatedDates = [...prev];
      const dateKey = targetDate.format('YYYY-MM-DD');
      const existingDateIndex = updatedDates.findIndex(
        d => d.date.format('YYYY-MM-DD') === dateKey
      );

      if (existingDateIndex >= 0) {
        if (!updatedDates[existingDateIndex].times.includes(timeToAdd)) {
          updatedDates[existingDateIndex].times.push(timeToAdd);
          updatedDates[existingDateIndex].times.sort();
        }
      } else {
        updatedDates.push({ date: targetDate, times: [timeToAdd] });
      }
      return updatedDates;
    });
  };

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

  const handleRemoveTime = (dateStr: string, timeToRemove: string) => {
    setSelectedDates(prev => {
      const updatedDates = [...prev];
      const targetIndex = updatedDates.findIndex(d => d.date.format('YYYY-MM-DD') === dateStr);
      if (targetIndex >= 0) {
        updatedDates[targetIndex].times = updatedDates[targetIndex].times.filter(t => t !== timeToRemove);
      }
      return updatedDates;
    });
  };

  // Create the selector node with current state
  const headerSelectorNode = (
    <AutoTimeSelector
      isAutoTimeEnabled={isAutoTimeEnabled}
      setIsAutoTimeEnabled={setIsAutoTimeEnabled}
      autoTimeValue={autoTimeValue}
      setAutoTimeValue={setAutoTimeValue}
      revision={autoTimeRevision}
      setRevision={setAutoTimeRevision}
    />
  );

  const calendarContent = (
    <DateSelectionProvider value={{
      isDateSelected,
      lastSelectedDates,
      isPastDate,
      handleDateClick,
      defaultTime,
      addTimeToDate
    }}>
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '2px',
          flex: 1,
          width: '100%',
          px: { xs: '10px', sm: 2 },
          py: { xs: '10px', sm: 2 },
        }}
      >
        <DateCalendar
          key={`calendar-${isAutoTimeEnabled ? 'enabled' : 'disabled'}-${autoTimeRevision}`}
          slots={{
            day: CustomDay as any,
            calendarHeader: CustomCalendarHeader,
          }}
          slotProps={{
            calendarHeader: {
              rightNode: headerSelectorNode,
            } as any
          }}
          minDate={dayjs()}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: 'none',
            margin: 0,
            '& .MuiDayCalendar-header': {
              justifyContent: 'space-between',
              width: '100%',
              margin: 0,
              marginBottom: 0,
              marginTop: 1,
            },
            '& .MuiDayCalendar-weekContainer': {
              justifyContent: 'space-between',
              width: '100%',
              margin: '0 !important',
              marginTop: { xs: '4px !important', sm: '6px !important' },
            },
            '& .MuiDayCalendar-weekDayLabel': {
              width: '14.28%',
              height: 'auto',
              aspectRatio: '1/1',
              fontSize: '0.75rem',
            },
            '& .MuiPickersDay-root': {
              minWidth: 0,
              lineHeight: 1.2,
              letterSpacing: '1px',
              minHeight: 0,
            },
            '& .MuiDayCalendar-slideTransition': {
              minHeight: 'auto',
              height: 'auto',
              overflow: 'hidden',
              display: 'grid',
              gridArea: '1/1',
            },
            '& .MuiDayCalendar-monthContainer': {
              position: 'relative',
              minHeight: 'auto',
              height: 'auto',
            },
            '& .MuiDateCalendar-root': {
              height: 'auto',
              width: '100%',
              maxHeight: 'none',
              overflow: 'hidden',
            },
            '& .MuiDateCalendar-viewTransitionContainer': {
              height: 'auto',
              overflow: 'hidden',
            },
            '& .MuiDayCalendar-weekContainer:last-child': {
              marginBottom: 0,
            },
          }}
        />
      </Box>
    </DateSelectionProvider>
  );

  const timePanelContent = (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '2px',
        width: { xs: '100%', sm: '28%', md: '200px' },
        height: isMobile ? '360px' : 'auto',
        flexShrink: 0,
        aspectRatio: isMobile ? 'auto' : { xs: '1/1', md: 'auto' },
        position: 'relative',
        opacity: lastSelectedDates.length === 0 ? 0.4 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <DesktopTimePanel
          lastSelectedDates={lastSelectedDates}
          addedTimes={addedTimes}
          handleTimeClick={handleTimeClick}
          selectedDates={selectedDates}
          onDateChange={(date) => dateSelection.setLastSelectedDates([date])}
        />
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '2px',
        p: { xs: 2.5, sm: 3 },
        mb: { xs: 2.5, sm: 3 },
      }}
    >

      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Alert severity="info" sx={{ borderRadius: '2px', py: 1.5, px: 2 }}>
            カレンダーの日付をクリックすると選択 / ダブルクリックで解除できます。
          </Alert>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="date time tabs"
            sx={{ borderBottom: 1, borderColor: 'divider', borderTop: '1px solid #ddd' }}
          >
            <Tab icon={<CalendarToday sx={{ fontSize: '15px' }} />} iconPosition="start" label="日付" />
            <Tooltip title={lastSelectedDates.length > 0 ? "" : "日付を選択してください"}>
              <Tab
                icon={<AccessTime sx={{ fontSize: '18px' }} />}
                iconPosition="start"
                label="時刻"
                disabled={false}
                className={tabValue === 1 ? "Mui-selected" : ""}
                onClick={(e) => {
                  if (lastSelectedDates.length === 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  handleTabChange(e, 1);
                }}
                sx={{
                  width: '50%',
                  maxWidth: 'none',
                  opacity: lastSelectedDates.length > 0 ? 1 : 0.5,
                  pointerEvents: lastSelectedDates.length > 0 ? 'auto' : 'none',
                  cursor: lastSelectedDates.length > 0 ? 'pointer' : 'not-allowed',
                }}
              />
            </Tooltip>
          </Tabs>

          <Box role="tabpanel" hidden={tabValue !== 0}>
            {tabValue === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {calendarContent}
              </Box>
            )}
          </Box>

          <Box role="tabpanel" hidden={tabValue !== 1}>
            {tabValue === 1 && timePanelContent}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Alert severity="info" sx={{ borderRadius: '2px', py: 1.5, px: 2 }}>
            カレンダーの日付をクリックすると選択 / ダブルクリックで解除できます。
          </Alert>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'column', md: 'row' },
              gap: { xs: 2.5, sm: 3 },
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                position: 'relative',
                alignItems: 'stretch',
                gap: { xs: 2.5, sm: 3 },
              }}
            >
              {calendarContent}
              {timePanelContent}
            </Box>
          </Box>
        </Box>
      )
      }

      <SelectedDatesPreview
        selectedDates={selectedDates}
        lastSelectedDates={lastSelectedDates}
        onRemoveDate={onRemoveDate}
        onRemoveTime={handleRemoveTime}
      />
    </Box >
  );
}
