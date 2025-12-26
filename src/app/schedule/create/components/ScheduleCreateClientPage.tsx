'use client';

import { useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  Tooltip,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from '@/lib/dayjs';
import { useSearchParams } from 'next/navigation';

import { useDateSelection } from '../hooks/useDateSelection';
import { useScheduleForm } from '../hooks/useScheduleForm';
import CalendarSection from './calendar/CalendarSection';
import AdvancedSettingsAccordion from '@/components/ui/AdvancedSettingsAccordion';
import DeadlineInput from '@/components/forms/DeadlineInput';
import TermsAgreementCheckbox from '@/components/forms/TermsAgreementCheckbox';

export default function ScheduleCreateClientPage() {
  const searchParams = useSearchParams();
  const initialTitle = searchParams.get('title');
  const pollId = searchParams.get('pollId');

  // カスタムフック
  const dateSelection = useDateSelection();
  const form = useScheduleForm({
    selectedDates: dateSelection.selectedDates,
    initialTitle,
    pollId,
  });

  // 日付削除
  const handleRemoveDate = useCallback(
    (dateKey: string) => {
      // 選択中の日付リストから削除
      dateSelection.setSelectedDates((prev) =>
        prev.filter((d) => d.date.format('YYYY-MM-DD') !== dateKey)
      );

      // 削除した日付が現在編集中の場合、編集状態をリセット
      const isCurrentlyEditing = dateSelection.lastSelectedDates.some(
        (d) => d.format('YYYY-MM-DD') === dateKey
      );

      if (isCurrentlyEditing) {
        dateSelection.setLastSelectedDates([]);
        dateSelection.setCurrentEditingDate(null);
      }
    },
    [dateSelection]
  );

  // 日付選択（時間選択パネル用）
  const handleSelectDate = useCallback(
    (dateKey: string) => {
      const selectedDate = dateSelection.selectedDates.find(
        (d) => d.date.format('YYYY-MM-DD') === dateKey
      );
      if (selectedDate) {
        dateSelection.setLastSelectedDates([selectedDate.date]);
        dateSelection.setCurrentEditingDate(selectedDate.date);
      }
    },
    [dateSelection]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      {/* タイトル入力 */}
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5, fontSize: '1rem' }}
        >
          タイトル <span style={{ color: '#f44336' }}>*</span>
        </Typography>
        <TextField
          fullWidth
          placeholder="忘年会の日程はいつがいい？"
          value={form.title}
          onChange={(e) => form.setTitle(e.target.value)}
          variant="outlined"
          error={!!form.errors.title}
          helperText={form.errors.title?.message}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '2px',
              fontSize: '1rem',
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
                borderWidth: 2,
              },
            },
            '& .MuiInputBase-input::placeholder': { fontSize: '0.875rem' },
          }}
        />
      </Box>

      {/* カレンダーセクション */}
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5, fontSize: '1rem' }}
        >
          日程候補 <span style={{ color: '#f44336' }}>*</span>
        </Typography>

        <CalendarSection
          dateSelection={dateSelection}
          onRemoveDate={handleRemoveDate}
        />

        {/* 日程エラー表示 */}
        {form.errors.dates && (
          <Typography color="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
            {form.errors.dates.message}
          </Typography>
        )}
      </Box>

      {/* 詳細設定 */}
      <AdvancedSettingsAccordion>
        <DeadlineInput
          endDate={form.endDate || ''}
          endTime={form.endTime || ''}
          todayDate={form.todayDate}
          maxEndDate={form.maxEndDate}
          currentTimeString={form.currentTimeString}
          onEndDateChange={form.setEndDate}
          onEndTimeChange={form.setEndTime}
          dateError={form.errors.endDate?.message}
          timeError={form.errors.endTime?.message}
        />
      </AdvancedSettingsAccordion>

      <Box
        sx={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
          my: { xs: 2.5, sm: 3 },
          mx: 2,
        }}
      />

      <TermsAgreementCheckbox
        checked={form.hasAgreedToTerms}
        onChange={form.setHasAgreedToTerms}
      />

      <Box
        sx={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
          mb: { xs: 2.5, sm: 3 },
          mx: 2,
        }}
      />

      {/* 作成ボタン */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip
          title={
            !form.canSubmit && form.validationMessages.length > 0 ? (
              <Box sx={{ p: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  以下の項目を入力してください
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 1 }}>
                  {form.validationMessages.map((msg, index) => (
                    <Typography key={index} variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 4 }}>•</span>
                      {msg}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ) : (
              ''
            )
          }
          arrow
          placement="top"
        >
          <Box sx={{ width: '100%' }}>
            <Button
              variant="contained"
              fullWidth
              disabled={!form.canSubmit}
              onClick={form.handleSubmit}
              sx={{
                px: 6,
                py: 2,
                fontWeight: 600,
                borderRadius: '2px',
                pointerEvents: !form.canSubmit ? 'none' : 'auto',
              }}
            >
              {form.isSubmitting ? '作成中...' : 'ページを作成'}
            </Button>
          </Box>
        </Tooltip>
      </Box>

      {/* エラー表示 */}
      {form.errors.root && (
        <Alert
          severity="error"
          sx={{
            mt: 4,
            mb: 0,
            border: '1px solid #ffebee',
            backgroundColor: '#ffebee',
            '& .MuiAlert-message': {
              fontSize: '0.875rem',
              fontWeight: 500,
            },
          }}
        >
          {form.errors.root.message}
        </Alert>
      )}
    </LocalizationProvider>
  );
}
