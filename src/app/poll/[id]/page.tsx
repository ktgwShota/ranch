"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Fade,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Restaurant as RestaurantIcon,
  OpenInNew as OpenInNewIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

interface Voter {
  id: string;
  name: string;
}

interface Option {
  id: number;
  url: string;
  title?: string;
  description?: string;
  image?: string | null;
  votes: number;
  voters: Voter[];
}

interface Poll {
  id: string;
  title: string;
  options: Option[];
}

export default function PollPage() {
  const params = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [votedOptions, setVotedOptions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [tempName, setTempName] = useState<string>("");

  useEffect(() => {
    // クッキーからユーザー情報を取得（URLごと）
    const pollId = params.id;
    const cookieName = `voterInfo_${pollId}`;
    const cookies = document.cookie.split(';');
    const voterCookie = cookies.find(cookie => cookie.trim().startsWith(`${cookieName}=`));

    if (voterCookie) {
      try {
        const cookieValue = decodeURIComponent(voterCookie.split('=')[1]);
        const userInfo = JSON.parse(cookieValue);
        setUserName(userInfo.name);
        setUserId(userInfo.id);
      } catch (error) {
        console.error('Error parsing stored user info:', error);
        setNameDialogOpen(true);
      }
    } else {
      setNameDialogOpen(true);
    }

    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls?id=${params.id}`);
        if (response.ok) {
          const pollData = await response.json() as Poll;
          setPoll(pollData);

          // OGPデータを取得
          console.log('Starting OGP data fetch for options:', pollData.options);
          const updatedOptions = await Promise.all(
            pollData.options.map(async (option: Option) => {
              console.log('Fetching OGP for URL:', option.url);
              try {
                const ogpResponse = await fetch('/api/fetch-ogp', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ url: option.url }),
                });

                console.log('OGP response status:', ogpResponse.status);
                if (ogpResponse.ok) {
                  const ogpData = await ogpResponse.json() as {
                    title: string;
                    description: string;
                    rating: string | null;
                    image: string | null;
                    error?: string;
                  };

                  console.log('OGP data received:', ogpData);

                  if (ogpData.error) {
                    return {
                      ...option,
                      title: '対応していないURLです',
                      description: '食べログまたはぐるなびのURLを入力してください',
                      rating: null,
                      image: null,
                    };
                  }

                  return {
                    ...option,
                    title: ogpData.title,
                    description: ogpData.description,
                    image: ogpData.image,
                    voters: option.voters || [],
                  };
                }
              } catch (error) {
                console.error('Error fetching OGP data:', error);
              }
              return {
                ...option,
                rating: null,
                voters: option.voters || [],
              };
            })
          );

          const updatedPoll: Poll = {
            ...pollData,
            options: updatedOptions
          };

          setPoll(updatedPoll);

          await fetch('/api/polls', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: pollData.id,
              options: updatedOptions
            }),
          });
        }
      } catch (error) {
        console.error('Error fetching poll:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [params.id]);

  const vote = async (optionId: number) => {
    if (!poll || voting || !userId) return;

    setVoting(optionId);

    // まず、他の選択肢から投票を削除（一人一票制）
    let updatedOptions = poll.options.map(option => {
      if (option.id !== optionId && option.voters.some(voter => voter.id === userId)) {
        return {
          ...option,
          votes: option.votes - 1,
          voters: option.voters.filter(voter => voter.id !== userId)
        };
      }
      return option;
    });

    // 次に、対象の選択肢を処理
    updatedOptions = updatedOptions.map(option => {
      if (option.id === optionId) {
        // 既にこの選択肢に投票済みの場合は投票を取り消し
        if (option.voters.some(voter => voter.id === userId)) {
          return {
            ...option,
            votes: option.votes - 1,
            voters: option.voters.filter(voter => voter.id !== userId)
          };
        } else {
          // 新しい選択肢に投票を追加
          return {
            ...option,
            votes: option.votes + 1,
            voters: [...option.voters, { id: userId, name: userName }]
          };
        }
      }
      return option;
    });

    const updatedPoll = {
      ...poll,
      options: updatedOptions
    };

    setPoll(updatedPoll);

    // 投票状態を更新
    const newVotedOptions = new Set<number>();
    updatedOptions.forEach(option => {
      if (option.voters.some(voter => voter.id === userId)) {
        newVotedOptions.add(option.id);
      }
    });
    setVotedOptions(newVotedOptions);

    try {
      await fetch('/api/polls', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: poll.id,
          options: updatedOptions
        }),
      });
    } catch (error) {
      console.error('Error updating vote:', error);
    } finally {
      setVoting(null);
    }
  };


  const handleNameSubmit = () => {
    if (tempName.trim()) {
      const pollId = params.id;
      const userId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userInfo = {
        id: userId,
        name: tempName.trim()
      };

      setUserName(userInfo.name);
      setUserId(userInfo.id);

      // クッキーに保存（7日間有効）
      const cookieName = `voterInfo_${pollId}`;
      const cookieValue = encodeURIComponent(JSON.stringify(userInfo));
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      document.cookie = `${cookieName}=${cookieValue}; expires=${expires.toUTCString()}; path=/`;

      setNameDialogOpen(false);
    }
  };

  const isVotedByUser = (option: Option) => {
    return option.voters.some(voter => voter.id === userId);
  };

  const hasUserVoted = () => {
    return poll?.options.some(option => option.voters.some(voter => voter.id === userId)) || false;
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            投票を読み込み中...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!poll) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <RestaurantIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            投票が見つかりません
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            この投票は存在しないか、削除された可能性があります。
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            href="/"
            size="large"
          >
            トップページに戻る
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* 投票ページヘッダー */}
          <Box
            sx={{
              background: '#f8f9fa',
              borderRadius: 1,
              p: 4,
              textAlign: 'center',
              border: '1px solid #ddd',
            }}
          >
            <Typography
              variant="h6"
              component="h1"
              fontWeight="600"
              sx={{
                color: '#495057',
                fontSize: '1.3rem',
              }}
            >
              {poll.title}
            </Typography>
          </Box>

          {/* 選択肢カード */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              p: 4,
              justifyContent: 'center',
            }}
          >
            {poll.options.map((option, index) => {
              const isVoted = isVotedByUser(option);
              const isVoting = voting === option.id;
              const totalVotes = poll?.options.reduce((sum, option) => sum + option.votes, 0) || 0;
              const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

              return (
                <Box
                  key={option.id}
                  sx={{
                    flex: '0 0 calc(33.333% - 16px)',
                    '@media (max-width: 900px)': {
                      flex: '0 0 calc(50% - 12px)',
                    },
                    '@media (max-width: 600px)': {
                      flex: '0 0 100%',
                    }
                  }}
                >
                  <Fade in timeout={600 + index * 100}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 'none',
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                          boxShadow: 'none'
                        }
                      }}
                    >
                      {/* 画像エリア */}
                      <CardMedia
                        component="div"
                        sx={{
                          height: 200,
                          backgroundImage: option.image
                            ? `url(${option.image})`
                            : 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {!option.image && (
                          <Box textAlign="center">
                            <RestaurantIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              画像を読み込み中...
                            </Typography>
                          </Box>
                        )}
                      </CardMedia>

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          fontWeight="bold"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {option.title || "店舗情報を取得中..."}
                        </Typography>
                        {/* 店舗情報セクション */}
                        <Box sx={{ mb: 1 }}>
                          {/* 説明 */}
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: '0.875rem',
                                lineHeight: 1.4,
                              }}
                            >
                              {(option.description || "説明を取得中...").replace(/★+[☆]*[0-9.]+/g, '').trim()}
                            </Typography>
                          </Box>
                        </Box>

                        {/* 元のページへのリンク */}
                        <Box mb={1}>
                          <Button
                            href={option.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<OpenInNewIcon />}
                            variant="text"
                            fullWidth
                            size="medium"
                          >
                            詳しく見る
                          </Button>
                        </Box>

                        {/* 投票結果 */}
                        <Box sx={{ mb: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h4" color="primary" fontWeight="bold">
                              {option.votes}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {votePercentage.toFixed(1)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={votePercentage}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          {/* 投票者一覧 */}
                          {option.voters.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                投票者:
                              </Typography>
                              <Box display="flex" flexWrap="wrap" gap={0.5}>
                                {option.voters.map((voter, idx) => (
                                  <Chip
                                    key={idx}
                                    label={voter.name}
                                    size="small"
                                    variant={voter.id === userId ? "filled" : "outlined"}
                                    color={voter.id === userId ? "primary" : "default"}
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          onClick={() => vote(option.id)}
                          disabled={isVoting}
                          variant={isVoted ? "outlined" : "contained"}
                          startIcon={<ThumbUpIcon />}
                          fullWidth
                          size="large"
                          sx={{
                            fontWeight: 600,
                            ...(isVoted && {
                              color: 'success.main',
                              borderColor: 'success.main',
                            })
                          }}
                        >
                          {isVoting ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <CircularProgress size={16} />
                              投票中...
                            </Box>
                          ) : isVoted ? (
                            '投票済み'
                          ) : (
                            '投票する'
                          )}
                        </Button>
                      </CardActions>
                    </Card>
                  </Fade>
                </Box>
              );
            })}
          </Box>

          <div className="border border-gray-200 bg-gray-100 p-3 rounded-md h-32">
            バナー広告
          </div>
        </Box>
      </Fade>

      {/* 名前入力ダイアログ */}
      <Dialog open={nameDialogOpen} onClose={() => { }} maxWidth="sm" fullWidth>
        <DialogTitle>投票者名を入力してください</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="お名前"
            fullWidth
            variant="outlined"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleNameSubmit();
              }
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNameSubmit} variant="contained" disabled={!tempName.trim()}>
            決定
          </Button>
        </DialogActions>
      </Dialog>

      {/* スナックバー */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
}