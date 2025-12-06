'use client';

import { useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { Restaurant as RestaurantIcon, Place as PlaceIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

import { LAYOUT_CONSTANTS } from '@/config/constants';
import { useDateSelection } from './hooks/useDateSelection';
import { useScheduleForm } from './hooks/useScheduleForm';
import CalendarSection from './components/CalendarSection';
import SelectedDatesPreview from './components/SelectedDatesPreview';
import AdvancedSettingsAccordion from '@/components/AdvancedSettingsAccordion';
import DeadlineInput from '@/components/DeadlineInput';
import TermsAgreementCheckbox from '@/components/TermsAgreementCheckbox';

dayjs.locale('ja');

export default function ScheduleCreatePage() {
  const router = useRouter();

  // カスタムフック
  const dateSelection = useDateSelection();
  const form = useScheduleForm({ selectedDates: dateSelection.selectedDates });

  // カテゴリ切り替え
  const handleCategoryChange = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      if (newValue === 'RESTAURANT') {
        router.push('/polls/create');
      }
    },
    [router]
  );

  // 日付削除
  const handleRemoveDate = useCallback(
    (dateKey: string) => {
      dateSelection.setSelectedDates((prev) =>
        prev.filter((d) => d.date.format('YYYY-MM-DD') !== dateKey)
      );
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
      }
    },
    [dateSelection]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <Container maxWidth={false} sx={{ maxWidth: LAYOUT_CONSTANTS.MAX_CONTENT_WIDTH }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            my: { xs: 2, sm: 3 },
            borderRadius: 0.5,
            border: '1px solid #ddd',
            backgroundColor: 'white',
          }}
        >
          {/* カテゴリ切り替えタブ */}
          <Tabs
            value="SCHEDULE"
            onChange={handleCategoryChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<RestaurantIcon />} label="店決め" value="RESTAURANT" />
            <Tab icon={<PlaceIcon />} label="日程調整" value="SCHEDULE" />
          </Tabs>

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
                  borderRadius: 0.5,
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
            <Alert severity="info" sx={{ borderRadius: '2px', mb: 2 }}>
              カレンダーを左クリックすると選択 / ダブルクリックで解除 / 長押しで範囲選択できます。
            </Alert>

            <CalendarSection dateSelection={dateSelection} />

            <SelectedDatesPreview
              selectedDates={dateSelection.selectedDates}
              onRemoveDate={handleRemoveDate}
              onSelectDate={handleSelectDate}
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
              mb: 3,
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
              mb: 3,
              mx: 2,
            }}
          />

          {/* 作成ボタン */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              fullWidth
              disabled={!form.canSubmit}
              onClick={form.handleSubmit}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '2px',
              }}
            >
              {form.isSubmitting ? '作成中...' : 'ページを作成'}
            </Button>
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
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
