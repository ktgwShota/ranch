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
  Skeleton,
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
      const startTime = Date.now();
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
                    rating: string | null;
                    image: string | null;
                    error?: string;
                  };

                  console.log('OGP data received:', ogpData);

                  if (ogpData.error) {
                    return {
                      ...option,
                      title: '対応していないURLです',
                      rating: null,
                      image: null,
                    };
                  }

                  return {
                    ...option,
                    title: ogpData.title,
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
        // 最低1秒はスケルトンを表示
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);

        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
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

  // TODO: ページが存在しない場合はエラー画面を表示

  return (
    // TODO: ここの変化をアニメーションさせる
    <Container maxWidth="md" sx={{ py: { xs: 2.5, sm: 3, md: 4 } }}>
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
          {loading ? (
            <Skeleton variant="text" width="50%" height={33.27} sx={{ mx: 'auto' }} />
          ) : (
            <Typography
              variant="h6"
              component="h1"
              fontWeight="600"
              sx={{
                color: '#495057',
                fontSize: '1.3rem',
              }}
            >
              {poll?.title}
            </Typography>
          )}
        </Box>

        {/* 選択肢カード */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            // TODO: ここの変化をアニメーションさせる
            gap: { xs: 2.5, sm: 3, md: 4 },
            my: { xs: 2.5, sm: 3, md: 4 },
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {loading ? (
            // ロード中のスケルトンカード
            [1, 2].map((index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'none',
                  border: '1px solid #e0e0e0',
                  flex: '0 0 calc(100%)',
                  [`@media (min-width: 600px)`]: {
                    flex: '0 0 calc(50% - 12px)',
                  },
                  [`@media (min-width: 900px)`]: {
                    flex: '0 0 calc(50% - 16px)',
                  },
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
                    backgroundImage: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box textAlign="center">
                    <RestaurantIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      画像を読み込み中...
                    </Typography>
                  </Box>
                </CardMedia>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* タイトルスケルトン */}
                  <Skeleton variant="text" height={32} sx={{ mb: 2 }} />

                  {/* リンクボタン */}
                  <Box mb={1}>
                    <Button
                      disabled
                      startIcon={<OpenInNewIcon />}
                      variant="text"
                      fullWidth
                      size="medium"
                    >
                      詳しく見る
                    </Button>
                  </Box>

                  {/* 投票結果スケルトン */}
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Skeleton variant="text" width={60} height={40} />
                      <Skeleton variant="text" width={40} height={20} />
                    </Box>
                    <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }} />
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    disabled
                    variant="contained"
                    startIcon={<ThumbUpIcon />}
                    fullWidth
                    size="large"
                    sx={{ fontWeight: 600 }}
                  >
                    投票する
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            poll?.options.map((option, index) => {
              const isVoted = isVotedByUser(option);
              const isVoting = voting === option.id;
              const totalVotes = poll?.options.reduce((sum, option) => sum + option.votes, 0) || 0;
              const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

              return (
                <Card
                  key={option.id}
                  elevation={0}
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: '1px solid #e8e8e8',
                    flex: '0 0 calc(100%)',
                    [`@media (min-width: 600px)`]: {
                      flex: '0 0 calc(50% - 12px)',
                    },
                    [`@media (min-width: 900px)`]: {
                      flex: '0 0 calc(50% - 16px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      borderColor: '#1976d2'
                    }
                  }}
                >
                  {/* 画像エリア（タイトル重ね表示） */}
                  <CardMedia
                    component="a"
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      height: 220,
                      backgroundImage: option.image
                        ? `url(${option.image})`
                        : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'flex-end',
                      position: 'relative',
                      borderRadius: '12px 12px 0 0',
                      overflow: 'hidden',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(25, 118, 210, 0.1)',
                          zIndex: 3
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
                        zIndex: 1
                      }
                    }}
                  >
                    {/* タイトルを画像の上に重ね表示 */}
                    <Box sx={{
                      position: 'relative',
                      zIndex: 2,
                      p: 2.5,
                      width: '100%'
                    }}>
                      {option.title ? (
                        <Typography
                          variant="h6"
                          fontWeight="800"
                          sx={{
                            color: 'white',
                            fontSize: '1.2rem',
                            lineHeight: 1.3,
                            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minHeight: '2.6rem'
                          }}
                        >
                          {option.title}
                        </Typography>
                      ) : (
                        <Skeleton
                          variant="text"
                          height={32}
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            '& .MuiSkeleton-root': {
                              backgroundColor: 'rgba(255,255,255,0.2)'
                            }
                          }}
                        />
                      )}
                    </Box>

                    {!option.image && (
                      <Box textAlign="center" sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2
                      }}>
                        <RestaurantIcon sx={{
                          fontSize: 64,
                          color: '#adb5bd',
                          mb: 1.5,
                          opacity: 0.8
                        }} />
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontWeight: 500,
                          opacity: 0.7
                        }}>
                          画像を読み込み中...
                        </Typography>
                      </Box>
                    )}
                  </CardMedia>

                  <CardContent sx={{
                    flexGrow: 1,
                    p: 3.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}>


                    {/* 投票結果 */}
                    <Box sx={{
                      mt: 'auto',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 3,
                      p: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        zIndex: 1
                      }
                    }}>
                      {/* 投票数とパーセンテージ */}
                      <Box sx={{ position: 'relative', zIndex: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Box>
                            <Typography variant="h3" sx={{
                              color: 'white',
                              fontWeight: 900,
                              fontSize: '2.2rem',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                              mb: 0.5
                            }}>
                              {option.votes}
                            </Typography>
                            <Typography variant="body2" sx={{
                              color: 'rgba(255,255,255,0.8)',
                              fontWeight: 500,
                              fontSize: '0.85rem'
                            }}>
                              票
                            </Typography>
                          </Box>
                          <Box textAlign="center">
                            <Typography variant="h4" sx={{
                              color: 'white',
                              fontWeight: 800,
                              fontSize: '1.8rem',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}>
                              {votePercentage.toFixed(1)}%
                            </Typography>
                            <Typography variant="body2" sx={{
                              color: 'rgba(255,255,255,0.8)',
                              fontWeight: 500,
                              fontSize: '0.85rem'
                            }}>
                              支持率
                            </Typography>
                          </Box>
                        </Box>

                        {/* プログレスバー */}
                        <Box sx={{ mb: 2.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={votePercentage}
                            sx={{
                              height: 12,
                              borderRadius: 6,
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 6,
                                background: 'linear-gradient(90deg, #ffffff 0%, #f0f0f0 100%)',
                                boxShadow: '0 2px 8px rgba(255,255,255,0.3)'
                              }
                            }}
                          />
                        </Box>

                        {/* 投票者一覧 */}
                        {option.voters.length > 0 && (
                          <Box sx={{ mb: 2.5 }}>
                            <Typography variant="caption" sx={{
                              color: 'rgba(255,255,255,0.9)',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              display: 'block',
                              mb: 1
                            }}>
                              投票者 ({option.voters.length}人)
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={0.8}>
                              {option.voters.map((voter, idx) => (
                                <Chip
                                  key={idx}
                                  label={voter.name}
                                  size="small"
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    backgroundColor: voter.id === userId ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                                    color: voter.id === userId ? '#667eea' : 'white',
                                    border: voter.id === userId ? '2px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.3)',
                                    '&:hover': {
                                      backgroundColor: voter.id === userId ? 'white' : 'rgba(255,255,255,0.3)'
                                    }
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        {/* 投票ボタン */}
                        <Button
                          onClick={() => vote(option.id)}
                          disabled={isVoting}
                          variant={isVoted ? "outlined" : "contained"}
                          startIcon={<ThumbUpIcon />}
                          fullWidth
                          size="large"
                          sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            py: 2,
                            position: 'relative',
                            zIndex: 2,
                            ...(isVoted && {
                              color: 'white',
                              borderColor: 'rgba(255,255,255,0.8)',
                              borderWidth: 2,
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              backdropFilter: 'blur(10px)',
                              '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                              }
                            }),
                            ...(!isVoted && {
                              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                              color: '#667eea',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                              }
                            })
                          }}
                        >
                          {isVoting ? (
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <CircularProgress size={20} sx={{ color: 'white' }} />
                              <Typography sx={{ fontWeight: 800 }}>
                                投票中...
                              </Typography>
                            </Box>
                          ) : isVoted ? (
                            '✓ 投票済み'
                          ) : (
                            '投票する'
                          )}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

              );
            })
          )}
        </Box>

        <div className="border border-gray-200 bg-gray-100 p-3 rounded-md h-32">
          バナー広告
        </div>
      </Box>

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