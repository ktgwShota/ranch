'use client';

import {
  Alert,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  Typography,
} from '@mui/material';
import { useState, useMemo } from 'react';
import { PollOption } from './types';
import { validateUrl } from '../../../utils/url';
import { TitleInput } from './components/TitleInput';
import { OptionCard } from './components/OptionCard';
import { AddOptionButton } from './components/AddOptionButton';
import { VotingDeadline } from './components/VotingDeadline';
import { CreatePollButton } from './components/CreatePollButton';
import { LAYOUT_CONSTANTS } from '@/config/constants';

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

export default function Index() {
  const [pollTitle, setPollTitle] = useState('');
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: 1, url: '', showCustomBudget: false },
    { id: 2, url: '', showCustomBudget: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(true);
  // 今日の日付を取得（YYYY-MM-DD形式）
  const todayDate = new Date().toISOString().split('T')[0];
  // 現在時刻を取得（HH:MM形式）
  const currentDateTime = new Date();
  const currentTimeString = `${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}`;

  // 1週間後の日付と時刻を計算（デフォルト値）
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  const defaultEndDate = oneWeekLater.toISOString().split('T')[0];
  const defaultEndTime = `${oneWeekLater.getHours().toString().padStart(2, '0')}:${oneWeekLater.getMinutes().toString().padStart(2, '0')}`;

  // 1ヶ月後の日付を計算（最大値）
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const maxEndDate = oneMonthLater.toISOString().split('T')[0];

  const [deadlineDate, setDeadlineDate] = useState<string>(defaultEndDate);
  const [deadlineTime, setDeadlineTime] = useState<string>(defaultEndTime);

  // URLエラーは計算可能な値なので derived state に
  const optionUrlErrors = useMemo(() => {
    const errors: { [key: number]: string } = {};
    pollOptions.forEach((option) => {
      if (option.url.trim()) {
        const error = validateUrl(option.url);
        if (error) {
          errors[option.id] = error;
        }
      }
    });
    return errors;
  }, [pollOptions]);

  const handleAddOption = () => {
    if (pollOptions.length < MAX_OPTIONS) {
      const newOptionId = Date.now();
      setPollOptions([
        ...pollOptions,
        {
          id: newOptionId,
          url: '',
          budget: '',
          budgetMin: '',
          budgetMax: '',
          description: '',
          showCustomBudget: false,
        },
      ]);
    }
  };

  const updateOption = (optionId: number, updates: Partial<PollOption>) => {
    setPollOptions(
      pollOptions.map((option) =>
        option.id === optionId ? { ...option, ...updates } : option
      )
    );
  };

  const handleRemoveOption = (optionId: number) => {
    if (pollOptions.length > MIN_OPTIONS) {
      setPollOptions(pollOptions.filter((option) => option.id !== optionId));
    }
  };

  const handleCreatePoll = async () => {
    const validOptions = pollOptions.filter((option) => option.url.trim() !== '');
    if (pollTitle.trim() === '' || validOptions.length < MIN_OPTIONS) {
      setErrorMessage('タイトルと最低2つの選択肢を入力してください。');
      return;
    }

    // URLバリデーションエラーをチェック
    const hasInvalidUrls = validOptions.some((option) => {
      const validationError = validateUrl(option.url);
      return validationError !== null;
    });

    if (hasInvalidUrls) {
      setErrorMessage('正しいURLを入力してください。');
      return;
    }

    // 投票受付時間の必須チェック
    if (!deadlineDate || !deadlineTime) {
      setErrorMessage('投票受付時間を入力してください。');
      return;
    }

    // 締切日時のバリデーション
    const selectedDateTime = new Date(`${deadlineDate}T${deadlineTime}`);
    const now = new Date();

    if (selectedDateTime <= now) {
      setErrorMessage('締切日時は現在時刻より後の日時を選択してください');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pollTitle.trim(),
          options: validOptions.map((option) => ({
            url: option.url.trim(),
            budgetMin: option.budgetMin || undefined,
            budgetMax: option.budgetMax || undefined,
            description: option.description || undefined,
          })),
          endDate: deadlineDate,
          endTime: deadlineTime,
        }),
      });

      if (!response.ok) {
        throw new Error('多数決の作成に失敗しました');
      }

      const result = (await response.json()) as { poll?: { id: string } };
      console.log('投票作成レスポンス:', result);

      if (result.poll && result.poll.id) {
        window.location.href = `/polls/${result.poll.id}`;
      } else {
        throw new Error('投票IDが取得できませんでした');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      setErrorMessage('多数決の作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        <Box component="form" onSubmit={(e) => e.preventDefault()} >
          <TitleInput title={pollTitle} onChange={setPollTitle} />

          <Box sx={{ position: 'relative' }}>
            <Box mb={2.5}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
              >
                店舗情報 <span style={{ color: '#f44336' } as React.CSSProperties}>*</span>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                候補となるお店の情報を入力してください。
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <a href="https://tabelog.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>食べログ</a> または <a href="https://www.gnavi.co.jp/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>ぐるなび</a> で取得した URL の使用をすると予算が自動入力されます。
              </Typography>
            </Box>

            {pollOptions.map((option, index) => (
              <OptionCard
                key={option.id}
                option={option}
                index={index}
                urlError={optionUrlErrors[option.id]}
                canRemove={pollOptions.length > MIN_OPTIONS}
                onOptionChange={(updates) => updateOption(option.id, updates)}
                onRemove={() => handleRemoveOption(option.id)}
              />
            ))}

            {pollOptions.length < MAX_OPTIONS && <AddOptionButton onClick={handleAddOption} />}
          </Box>

          <VotingDeadline
            endDate={deadlineDate}
            endTime={deadlineTime}
            todayDate={todayDate}
            maxDate={maxEndDate}
            currentTimeString={currentTimeString}
            onEndDateChange={(value) => {
              setDeadlineDate(value);
              if (value === todayDate && deadlineTime && deadlineTime < currentTimeString) {
                setDeadlineTime('');
              }
            }}
            onEndTimeChange={setDeadlineTime}
          />

          <Box
            sx={{
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
              mb: 3,
              mx: 2,
            }}
          />


          <Box display="flex" justifyContent="center" my={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasAgreedToTerms}
                  onChange={(e) => setHasAgreedToTerms(e.target.checked)}
                  color="primary"
                  size="small"
                  sx={{
                    p: 0,
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500, position: 'relative', top: '0.5px' }}
                >
                  <a
                    href="/terms"
                    style={
                      {
                        color: '#1976d2',
                        textDecoration: 'none',
                        paddingLeft: 4,
                      } as React.CSSProperties
                    }
                  >
                    利用規約
                  </a>
                  に同意する
                </Typography>
              }
            />
          </Box>

          <Box
            sx={{
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
              mb: 3,
              mx: 2,
            }}
          />

          <CreatePollButton
            loading={isLoading}
            disabled={isLoading || !hasAgreedToTerms}
            onClick={handleCreatePoll}
          />

          {errorMessage && (
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
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
