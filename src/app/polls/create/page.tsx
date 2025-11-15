'use client';

import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function CreatePage() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([
    { id: 1, url: '' },
    { id: 2, url: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlErrors, setUrlErrors] = useState<{ [key: number]: string }>({});
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [duration, setDuration] = useState(5); // デフォルト5分
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  // 今日の日付を取得（YYYY-MM-DD形式）
  const today = new Date().toISOString().split('T')[0];
  // 現在時刻を取得（HH:MM形式）
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // URLからサービス名（食べログ/ぐるなび/その他）を判定
  const getServiceLabel = (url: string): string | null => {
    if (!url.trim()) return null;

    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();

      // 食べログのドメイン
      const tabelogDomains = ['tabelog.com', 'www.tabelog.com'];
      if (tabelogDomains.some((domain) => hostname === domain || hostname.endsWith('.' + domain))) {
        return '食べログ';
      }

      // ぐるなびのドメイン
      const gurunaviDomains = [
        'gurunavi.com',
        'www.gurunavi.com',
        'r.gnavi.co.jp',
        'www.r.gnavi.co.jp',
      ];
      if (gurunaviDomains.some((domain) => hostname === domain || hostname.endsWith('.' + domain))) {
        return 'ぐるなび';
      }

      // その他の有効なURL
      return 'その他';
    } catch {
      return null;
    }
  };

  const validateUrl = (url: string): string | null => {
    if (!url.trim()) return null;

    try {
      // 有効なURL形式かチェック（ドメイン制限なし）
      new URL(url);
      return null;
    } catch {
      return '正しいURLを入力してください';
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: Date.now(), url: '' }]);
    }
  };

  const updateOption = (id: number, url: string) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, url } : option)));

    // URLバリデーション
    const error = validateUrl(url);
    setUrlErrors((prev) => ({
      ...prev,
      [id]: error || '',
    }));
  };

  const removeOption = (id: number) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== id));
    }
  };

  const createPoll = async () => {
    const validOptions = options.filter((option) => option.url.trim() !== '');
    if (title.trim() === '' || validOptions.length < 2) {
      setError('タイトルと最低2つの選択肢を入力してください。');
      return;
    }

    // URLバリデーションエラーをチェック
    const hasUrlErrors = validOptions.some((option) => {
      const error = validateUrl(option.url);
      return error !== null;
    });

    if (hasUrlErrors) {
      setError('正しいURLを入力してください。');
      return;
    }

    // 締切日時のバリデーション（任意）
    if (endDate && endTime) {
      const selectedDateTime = new Date(`${endDate}T${endTime}`);
      const now = new Date();

      if (selectedDateTime <= now) {
        setError('締切日時は現在時刻より後の日時を選択してください');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          options: validOptions.map((option) => option.url.trim()),
          duration: duration, // 締め切り時間（分）を追加
          endDate: endDate || null, // 締切日
          endTime: endTime || null, // 締切時刻
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
      setError('多数決の作成に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      {/* メインフォーム */}
      <Paper
        elevation={0}
        sx={{
          p: 5,
          // TODO: ここの変化をアニメーションさせる
          my: { xs: 2.5, sm: 3, md: 4 },
          borderRadius: 0.5,
          border: '1px solid #ddd',
          backgroundColor: 'white',
        }}
      >
        <Box component="form" sx={{ '& > *': { mb: 4 } }}>
          <Box>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
            >
              タイトル <span style={{ color: '#f44336' } as React.CSSProperties}>*</span>
            </Typography>

            <TextField
              fullWidth
              placeholder="歓迎会のお店はどこがいい？"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0.5,
                  backgroundColor: '#fafafa',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    borderWidth: 2,
                  },
                },
              }}
            />
          </Box>

          <Box mb={3}>
            <Box mb={3}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
              >
                リスト <span style={{ color: '#f44336' } as React.CSSProperties}>*</span>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                候補となるお店の URL を入力してください。
              </Typography>
            </Box>

            {options.map((option, index) => (
              <Box
                key={option.id}
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: 0.5,
                  border: '1px solid',
                  borderColor: urlErrors[option.id] ? '#f44336' : '#ddd',
                  backgroundColor: 'white',
                }}
              >
                <Box display="flex" gap={2.5} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      type="url"
                      value={option.url}
                      onChange={(e) => updateOption(option.id, e.target.value)}
                      placeholder="https://tabelog.com/tokyo/..."
                      variant="outlined"
                      size="small"
                      error={!!urlErrors[option.id]}
                      helperText={urlErrors[option.id] || ''}
                      FormHelperTextProps={{
                        sx: { fontSize: '0.875rem', fontWeight: 500 },
                      }}
                      slotProps={{
                        input: {
                          endAdornment: getServiceLabel(option.url) ? (
                            <InputAdornment
                              position="end"
                              sx={{
                                m: '0 !important',
                                ml: '0 !important',
                                maxHeight: 'none !important',
                                height: 'auto !important',
                                px: '10px !important',
                                py: '4px !important',
                                borderRadius: '12px !important',
                                backgroundColor:
                                  getServiceLabel(option.url) === '食べログ'
                                    ? '#ff6b6b !important'
                                    : getServiceLabel(option.url) === 'ぐるなび'
                                      ? '#4ecdc4 !important'
                                      : '#9e9e9e !important',
                                color: 'white !important',
                                fontSize: '0.7rem !important',
                                fontWeight: '600 !important',
                                letterSpacing: '0.5px !important',
                                lineHeight: '1 !important',
                              }}
                            >
                              {getServiceLabel(option.url)}
                            </InputAdornment>
                          ) : null,
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          paddingRight: 0,
                          borderRadius: 0.5,
                        },
                        backgroundColor: '#fafafa'
                      }}
                    />
                  </Box>
                  {options.length > 2 && (
                    <IconButton
                      onClick={() => removeOption(option.id)}
                      size="small"
                      sx={{
                        color: '#f44336',
                        backgroundColor: '#ffebee',
                        borderRadius: 0.5,
                        width: 36,
                        height: 36,
                        '&:hover': {
                          backgroundColor: '#ffcdd2',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}

            {options.length < 6 && (
              <Box
                onClick={addOption}
                sx={{
                  mb: 3,
                  borderRadius: 0.5,
                  border: '1px solid',
                  borderColor: '#ddd',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '90px',
                  '&:hover': {
                    borderColor: '#1976d2',
                    backgroundColor: '#fafafa',
                  },
                }}
              >
                <AddIcon sx={{ color: '#1976d2', fontSize: '1.5rem' }} />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              height: '2px',
              background:
                'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
              mb: 3,
              mx: 2,
            }}
          />

          {/* 締め切り日時設定 */}
          <Box
            sx={{
              mb: 3,
              p: 4,
              background:
                'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderRadius: 3,
              border: '1px solid rgba(102, 126, 234, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                color: 'text.primary',
                fontWeight: 600,
              }}
            >
              投票期限
            </Typography>
            <Box display="flex" flexDirection="column" gap={3}>
              <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                <TextField
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    // 今日の日付が選択された場合、現在時刻より前の時刻はリセット
                    if (e.target.value === today && endTime && endTime < currentTime) {
                      setEndTime('');
                    }
                  }}
                  sx={{
                    minWidth: 180,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                  }}
                  label="締切日"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: today }}
                />
                <TextField
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  sx={{
                    minWidth: 150,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                  }}
                  label="締切時刻"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: endDate === today ? currentTime : '00:00',
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#6c757d',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}
              >
                投票期限を設定すると指定時刻に投票結果が表示されます。
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" my={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
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

          <Button
            onClick={createPoll}
            disabled={loading || !agreedToTerms}
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 2,
              px: 4,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 1,
              backgroundColor: '#1976d2',
              textTransform: 'none',
              '&:disabled': {
                backgroundColor: '#ddd',
                color: '#9e9e9e',
                boxShadow: 'none',
              },
            }}
          >
            {loading ? (
              <Box display="flex" alignItems="center" gap={1.5} m={0}>
                <CircularProgress size={20} color="inherit" />
                作成中...
              </Box>
            ) : (
              'ページを作成'
            )}
          </Button>

          {/* エラー表示 */}
          {error && (
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
              {error}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
