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
          options: validOptions.map(option => option.url.trim())
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
      <div className="border border-gray-200 bg-gray-100 p-3 rounded-md h-32 my-6">
        バナー広告
      </div>

      {/* メインフォーム */}
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 1.5,
          border: '1px solid #ddd',
          backgroundColor: 'white',
        }}
      >
        {/* エラー表示 */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: 2,
              border: '1px solid #ffebee',
              backgroundColor: '#ffebee'
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" sx={{ '& > *': { mb: 4 } }}>
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
              タイトル
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
                お店のリスト
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
              height: "1px",
              backgroundColor: '#ddd',
              mb: 0,
            }}
          />

          <Box display="flex" justifyContent="center" m={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  <a href="/terms" style={{ color: '#1976d2', textDecoration: 'none' }}>利用規約</a>に同意する
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
        </Box>
      </Paper>

      <div className="border border-gray-200 bg-gray-100 p-3 rounded-md h-32 my-6">
        バナー広告
      </div>
    </Container>
  );
}
