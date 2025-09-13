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
  Grid,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ContentCopy as CopyIcon,
  Restaurant as RestaurantIcon,
  OpenInNew as OpenInNewIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

interface Option {
  id: number;
  url: string;
  title?: string;
  description?: string;
  image?: string | null;
  votes: number;
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

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls?id=${params.id}`);
        if (response.ok) {
          const pollData = await response.json() as Poll;
          setPoll(pollData);

          // OGPデータを取得
          const updatedOptions = await Promise.all(
            pollData.options.map(async (option: Option) => {
              try {
                const ogpResponse = await fetch('/api/fetch-ogp', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ url: option.url }),
                });

                if (ogpResponse.ok) {
                  const ogpData = await ogpResponse.json() as {
                    title: string;
                    description: string;
                    image: string | null;
                    error?: string;
                  };

                  if (ogpData.error) {
                    return {
                      ...option,
                      title: '対応していないURLです',
                      description: '食べログまたはぐるなびのURLを入力してください',
                      image: null,
                    };
                  }

                  return {
                    ...option,
                    title: ogpData.title,
                    description: ogpData.description,
                    image: ogpData.image,
                  };
                }
              } catch (error) {
                console.error('Error fetching OGP data:', error);
              }
              return option;
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
    if (!poll || votedOptions.has(optionId) || voting) return;

    setVoting(optionId);
    const updatedOptions = poll.options.map(option =>
      option.id === optionId
        ? { ...option, votes: option.votes + 1 }
        : option
    );

    const updatedPoll = {
      ...poll,
      options: updatedOptions
    };

    setPoll(updatedPoll);
    setVotedOptions(new Set([...votedOptions, optionId]));

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

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbarMessage('URLをコピーしました！');
    setSnackbarOpen(true);
  };

  const getTotalVotes = () => {
    return poll?.options.reduce((sum, option) => sum + option.votes, 0) || 0;
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* ヘッダー */}
          <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {poll.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              総投票数: {getTotalVotes()}票
            </Typography>

            <Button
              onClick={copyUrl}
              variant="contained"
              startIcon={<CopyIcon />}
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                }
              }}
            >
              URLをコピー
            </Button>
          </Paper>

          {/* 選択肢カード */}
          <Grid container spacing={3}>
            {poll.options.map((option, index) => {
              const isVoted = votedOptions.has(option.id);
              const isVoting = voting === option.id;
              const votePercentage = getTotalVotes() > 0 ? (option.votes / getTotalVotes()) * 100 : 0;

              return (
                <Grid item xs={12} sm={6} lg={4} key={option.id}>
                  <Fade in timeout={600 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
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
                        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                          {option.title || "店舗情報を取得中..."}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {option.description || "説明を取得中..."}
                        </Typography>

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
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          onClick={() => vote(option.id)}
                          disabled={isVoted || isVoting}
                          variant={isVoted ? "outlined" : "contained"}
                          startIcon={isVoted ? <ThumbUpIcon /> : <ThumbUpIcon />}
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
                            '👍 いいね'
                          )}
                        </Button>
                      </CardActions>

                      {/* 元のページへのリンク */}
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          href={option.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<OpenInNewIcon />}
                          variant="text"
                          fullWidth
                          size="small"
                        >
                          詳細を見る
                        </Button>
                      </Box>
                    </Card>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>

        </Box>
      </Fade>

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