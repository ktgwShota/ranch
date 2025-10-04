"use client";

import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([{ id: 1, url: "" }, { id: 2, url: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const validateUrl = (url: string): string | null => {
    if (!url.trim()) return null;

    try {
      const parsedUrl = new URL(url);
      const allowedDomains = [
        'tabelog.com',
        'www.tabelog.com',
        'gurunavi.com',
        'www.gurunabi.com',
        'r.gnavi.co.jp',
        'www.r.gnavi.co.jp'
      ];

      const hostname = parsedUrl.hostname.toLowerCase();
      const isAllowedDomain = allowedDomains.some(domain =>
        hostname === domain || hostname.endsWith('.' + domain)
      );

      if (!isAllowedDomain) {
        return '食べログまたはぐるなびのURLを入力してください';
      }

      return null;
    } catch {
      return '正しいURLを入力してください';
    }
  };


  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: Date.now(), url: "" }]);
    }
  };

  const updateOption = (id: number, url: string) => {
    setOptions(options.map(option =>
      option.id === id ? { ...option, url } : option
    ));

    // URLバリデーション
    const error = validateUrl(url);
    setUrlErrors(prev => ({
      ...prev,
      [id]: error || ''
    }));
  };

  const removeOption = (id: number) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
    }
  };

  const createPoll = async () => {
    const validOptions = options.filter(option => option.url.trim() !== "");
    if (title.trim() === "" || validOptions.length < 2) {
      setError("タイトルと最低2つの選択肢を入力してください。");
      return;
    }

    // URLバリデーションエラーをチェック
    const hasUrlErrors = validOptions.some(option => {
      const error = validateUrl(option.url);
      return error !== null;
    });

    if (hasUrlErrors) {
      setError("正しい食べログまたはぐるなびのURLを入力してください。");
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
    setError("");

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          options: validOptions.map(option => option.url.trim()),
          duration: duration, // 締め切り時間（分）を追加
          endDate: endDate || null, // 締切日
          endTime: endTime || null // 締切時刻
        }),
      });

      if (!response.ok) {
        throw new Error('多数決の作成に失敗しました');
      }

      const poll = await response.json() as { id: string };
      window.location.href = `/poll/${poll.id}`;
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
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
              タイトル <span style={{ color: '#f44336' }}>*</span>
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
                  }
                }
              }}
            />
          </Box>

          <Box mb={3}>
            <Box mb={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                お店のリスト <span style={{ color: '#f44336' }}>*</span>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                食べログ または ぐるなび の URL を入力してください
              </Typography>
            </Box>

            {options.map((option, index) => (
              <Box
                key={option.id}
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: urlErrors[option.id] ? '#f44336' : '#ddd',
                  backgroundColor: 'white'
                }}
              >
                <Box display="flex" gap={3} alignItems="flex-start">
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
                        sx: { fontSize: '0.875rem', fontWeight: 500 }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0.5,
                          backgroundColor: '#fafafa',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: urlErrors[option.id] ? '#f44336' : '#1976d2',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: urlErrors[option.id] ? '#f44336' : '#1976d2',
                            borderWidth: 2,
                          }
                        }
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
                        borderRadius: 1
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}

            {options.length < 6 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Button
                  onClick={addOption}
                  startIcon={<AddIcon />}
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                    pl: 2,
                    pr: 2.5,
                    py: 1.5,
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                      borderColor: '#1565c0',
                      backgroundColor: '#e3f2fd',
                    }
                  }}
                >
                  選択肢を追加
                </Button>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              height: "2px",
              background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
              mb: 3,
              mx: 2
            }}
          />

          {/* 締め切り日時設定 */}
          <Box sx={{
            mb: 3,
            p: 4,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: 3,
            border: '1px solid rgba(102, 126, 234, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="subtitle1" sx={{
              mb: 2,
              color: 'text.primary',
              fontWeight: 600
            }}>
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
                      }
                    }
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
                      }
                    }
                  }}
                  label="締切時刻"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: endDate === today ? currentTime : '00:00'
                  }}
                />
              </Box>
              {endDate && endTime && (
                <Box sx={{
                  p: 2,
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: 2,
                  border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                  <Typography variant="body1" sx={{
                    color: '#667eea',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    締切日時: {new Date(`${endDate}T${endTime}`).toLocaleString('ja-JP')}
                  </Typography>
                </Box>
              )}
              <Typography variant="body2" sx={{
                color: '#6c757d',
                fontSize: '0.95rem',
                textAlign: 'center',
                lineHeight: 1.6
              }}>
                投票期限を設定すると指定時刻に投票が自動で終了します。設定しない場合は無期限で投票可能です。
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
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, position: 'relative', top: '0.5px' }}>
                  <a href="/terms" style={{ color: '#1976d2', textDecoration: 'none', paddingLeft: 4 }}>利用規約</a>に同意する
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
              }
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
                  fontWeight: 500
                }
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
