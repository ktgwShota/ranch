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
  Card,
  CardContent,
  Fade,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

export default function Home() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([{ id: 1, url: "" }, { id: 2, url: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [urlErrors, setUrlErrors] = useState<{ [key: number]: string }>({});

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
        throw new Error('投票の作成に失敗しました');
      }

      const poll = await response.json() as { id: string };
      window.location.href = `/poll/${poll.id}`;
    } catch (error) {
      console.error('Error creating poll:', error);
      setError('投票の作成に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: '#fafafa',
        position: 'relative',
      }}
    >
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Fade in timeout={800}>
          <Box>

            {/* メインフォーム */}
            <Paper
              elevation={0}
              sx={{
                p: 6,
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
                        borderRadius: 0.25,
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

                <Box>
                  <Box mb={3}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                      お店のリスト
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      食べログまたはグルナビのURLを入力
                    </Typography>
                  </Box>


                  {options.map((option, index) => (
                    <Box
                      key={option.id}
                      sx={{
                        mb: 3,
                        p: 3,
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: urlErrors[option.id] ? '#f44336' : 'transparent',
                        backgroundColor: 'white',
                        boxShadow: urlErrors[option.id]
                          ? '0 0 0 1px #f44336, 0 2px 8px rgba(244, 67, 54, 0.1)'
                          : '0 1px 3px rgba(0, 0, 0, 0.1)'
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
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
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
                                borderRadius: 0.25,
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
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          px: 4,
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

                {/* 作成ボタン */}
                <Box sx={{ mt: 6 }}>
                  <Button
                    onClick={createPoll}
                    disabled={loading}
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 3,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      textTransform: 'none',
                      boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                        boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
                      },
                      '&:disabled': {
                        background: '#bdbdbd',
                        boxShadow: 'none',
                      }
                    }}
                  >
                    {loading ? (
                      <Box display="flex" alignItems="center" gap={2}>
                        <CircularProgress size={24} color="inherit" />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          作成中...
                        </Typography>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          投票ページを作成する
                        </Typography>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem'
                          }}
                        >
                          →
                        </Box>
                      </Box>
                    )}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
