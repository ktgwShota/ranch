'use client';

import {
  Check as CheckIcon,
  Home as HomeIcon,
  OpenInNew as OpenInNewIcon,
  Restaurant as RestaurantIcon,
  Star as StarIcon,
  Stop as StopIcon,
  ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  LinearProgress,
  Paper,
  Skeleton,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PollResultDialog from '@/app/components/PollResultDialog';

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
  duration?: number; // 締め切り時間（分）
  endDateTime?: string | null; // 締切日時
  createdAt?: string; // 作成日時
  createdBy?: string; // 作成者ID
  isClosed?: boolean; // 投票終了フラグ
  options: Option[];
}

export default function PollPage() {
  const params = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [votedOptions, setVotedOptions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [tempName, setTempName] = useState<string>('');
  const [isPollClosed, setIsPollClosed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isEndingPoll, setIsEndingPoll] = useState(false);

  useEffect(() => {
    // サーバーから取得したisClosedフラグに基づいて状態を設定
    if (poll) {
      if (poll.isClosed) {
        setIsPollClosed(true);
        setTimeRemaining(0);
      } else if (poll.endDateTime) {
        // 締切日時が設定されている場合は残り時間を計算
        const endTime = new Date(poll.endDateTime).getTime();
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);

        if (remaining <= 0) {
          setIsPollClosed(true);
          setTimeRemaining(0);
        } else {
          setIsPollClosed(false);
          setTimeRemaining(Math.ceil(remaining / 1000));
        }
      } else {
        setIsPollClosed(false);
        setTimeRemaining(null);
      }
    }
  }, [poll]);

  // 残り時間のカウントダウン（締切日時が設定されている場合のみ）
  useEffect(() => {
    if (!poll || !poll.endDateTime || isPollClosed) {
      return;
    }

    const endTime = new Date(poll.endDateTime).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);

      if (remaining <= 0) {
        setIsPollClosed(true);
        setTimeRemaining(0);
        clearInterval(timer);
      } else {
        setTimeRemaining(Math.ceil(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [poll, isPollClosed]);

  useEffect(() => {
    // クッキーからユーザー情報を取得（URLごと）
    const pollId = params.id;
    const cookieName = `voterInfo_${pollId}`;
    const cookies = document.cookie.split(';');
    const voterCookie = cookies.find((cookie) => cookie.trim().startsWith(`${cookieName}=`));

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
        const response = await fetch(`/api/polls/${params.id}`);
        if (response.ok) {
          const pollData = (await response.json()) as Poll;
          console.log('pollData:', pollData);
          setPoll(pollData);

          // 投票終了状態をチェック（初期状態を正しく設定）
          if (pollData.isClosed) {
            console.log('サーバーからisClosed=trueを受信、状態を設定');
            setIsPollClosed(true);
            setTimeRemaining(0);
          } else {
            console.log('サーバーからisClosed=falseを受信、状態をリセット');
            setIsPollClosed(false);
          }

          // OGPデータを取得
          console.log('Starting OGP data fetch for options:', pollData.options);
          const updatedOptions = await Promise.all(
            pollData.options.map(async (option: Option) => {
              console.log('Fetching OGP for URL:', option.url);
              try {
                const ogpResponse = await fetch('/api/ogp', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ url: option.url }),
                });

                console.log('OGP response status:', ogpResponse.status);
                if (ogpResponse.ok) {
                  const ogpData = (await ogpResponse.json()) as {
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
            options: updatedOptions,
            isClosed: pollData.isClosed, // 明示的にisClosedフラグを保持
          };

          console.log('OGPデータ取得後のupdatedPoll:', { isClosed: updatedPoll.isClosed });
          setPoll(updatedPoll);

          // isClosedフラグが設定されている場合は、状態を再設定
          if (pollData.isClosed) {
            console.log('OGPデータ取得後、isClosed=trueを再設定');
            setIsPollClosed(true);
            setTimeRemaining(0);
          } else {
            console.log('OGPデータ取得後、isClosed=falseを再設定');
            setIsPollClosed(false);
          }

          await fetch('/api/polls', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: pollData.id,
              options: updatedOptions,
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
    let updatedOptions = poll.options.map((option) => {
      if (option.id !== optionId && option.voters.some((voter) => voter.id === userId)) {
        return {
          ...option,
          votes: option.votes - 1,
          voters: option.voters.filter((voter) => voter.id !== userId),
        };
      }
      return option;
    });

    // 次に、対象の選択肢を処理
    updatedOptions = updatedOptions.map((option) => {
      if (option.id === optionId) {
        // 既にこの選択肢に投票済みの場合は投票を取り消し
        if (option.voters.some((voter) => voter.id === userId)) {
          return {
            ...option,
            votes: option.votes - 1,
            voters: option.voters.filter((voter) => voter.id !== userId),
          };
        } else {
          // 新しい選択肢に投票を追加
          return {
            ...option,
            votes: option.votes + 1,
            voters: [...option.voters, { id: userId, name: userName }],
          };
        }
      }
      return option;
    });

    const updatedPoll = {
      ...poll,
      options: updatedOptions,
    };

    setPoll(updatedPoll);

    // 投票状態を更新
    const newVotedOptions = new Set<number>();
    updatedOptions.forEach((option) => {
      if (option.voters.some((voter) => voter.id === userId)) {
        newVotedOptions.add(option.id);
      }
    });
    setVotedOptions(newVotedOptions);

    try {
      console.log('投票データ送信:', { id: poll.id, options: updatedOptions });
      await fetch(`/api/polls/${poll.id}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optionId,
          voterId: userId,
          voterName: userName,
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
        name: tempName.trim(),
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
    return option.voters.some((voter) => voter.id === userId);
  };

  const getWinningOption = () => {
    if (!poll || poll.options.length === 0) return null;
    const winning = poll.options.reduce((max, option) => (option.votes > max.votes ? option : max));
    console.log('getWinningOption結果:', {
      winning: winning ? { id: winning.id, votes: winning.votes } : null,
      allOptions: poll.options.map((o) => ({ id: o.id, votes: o.votes })),
    });
    return winning;
  };

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}日${hours}時間${mins}分`;
    } else if (hours > 0) {
      return `${hours}時間${mins}分`;
    } else if (mins > 0) {
      return `${mins}分${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  };

  // 作成者かどうかを判定（簡易版 - 実際は認証が必要）
  // デモ用に、最初にアクセスしたユーザーを作成者として扱う
  const isCreator = poll?.createdBy === userId || (poll && !userId);

  // 投票を強制終了する関数
  const endPoll = async () => {
    if (!poll) return;

    setIsEndingPoll(true);
    try {
      const response = await fetch(`/api/polls/${poll.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pollId: poll.id }),
      });

      if (response.ok) {
        // サーバー側でisClosedフラグが設定されるので、pollを再取得
        const updatedPoll = (await fetch(`/api/polls/${poll.id}`).then((res) =>
          res.json()
        )) as Poll;
        setPoll(updatedPoll);
        setSnackbarMessage('投票を終了しました');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('投票の終了に失敗しました');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('投票終了エラー:', error);
      setSnackbarMessage('投票の終了に失敗しました');
      setSnackbarOpen(true);
    } finally {
      setIsEndingPoll(false);
    }
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                component="h1"
                fontWeight="600"
                sx={{
                  color: '#495057',
                  fontSize: '1.3rem',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {poll?.title}
              </Typography>

              {/* 投票終了ボタン */}
              {poll && !isPollClosed && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={endPoll}
                  disabled={isEndingPoll}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    borderColor: '#f44336',
                    color: '#f44336',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      backgroundColor: '#ffebee',
                    },
                  }}
                >
                  {isEndingPoll ? '終了中...' : '投票を終了'}
                </Button>
              )}

              {/* タイマー表示 */}
              {poll && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2.5,
                    py: 1.5,
                    backgroundColor:
                      isPollClosed || poll?.isClosed
                        ? '#ffebee'
                        : poll?.endDateTime
                          ? '#e3f2fd'
                          : '#e8f5e8',
                    borderRadius: 3,
                    border: `1px solid ${isPollClosed || poll?.isClosed ? '#f44336' : poll?.endDateTime ? '#2196f3' : '#4caf50'}`,
                    minWidth: 'fit-content',
                    boxShadow:
                      isPollClosed || poll?.isClosed
                        ? '0 2px 8px rgba(244, 67, 54, 0.2)'
                        : poll?.endDateTime
                          ? '0 2px 8px rgba(33, 150, 243, 0.2)'
                          : '0 2px 8px rgba(76, 175, 80, 0.2)',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        isPollClosed || poll?.isClosed
                          ? '#d32f2f'
                          : poll?.endDateTime
                            ? '#1976d2'
                            : '#4caf50',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    投票受付:
                  </Typography>
                  {isPollClosed || poll?.isClosed ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#d32f2f',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      終了
                    </Typography>
                  ) : poll?.endDateTime ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#1976d2',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatTime(timeRemaining || 0)}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#4caf50',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      無期限
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
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
          {loading
            ? // ロード中のスケルトンカード
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
                      boxShadow: 'none',
                    },
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
            : poll?.options.map((option, index) => {
                const isVoted = isVotedByUser(option);
                const isVoting = voting === option.id;
                const totalVotes =
                  poll?.options.reduce((sum, option) => sum + option.votes, 0) || 0;
                const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                const winningOption = getWinningOption();
                const isDecided = isPollClosed && winningOption && option.id === winningOption.id;
                const isDisabled = isPollClosed && !isDecided;

                // デバッグ用ログ
                if (index === 0) {
                  console.log('勝者判定デバッグ:', {
                    isPollClosed,
                    winningOption: winningOption
                      ? { id: winningOption.id, votes: winningOption.votes }
                      : null,
                    optionId: option.id,
                    optionVotes: option.votes,
                    isDecided,
                    isDisabled,
                    totalVotes,
                    allOptions: poll?.options.map((o) => ({ id: o.id, votes: o.votes })),
                  });
                }

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
                      border: isDecided ? '3px solid transparent' : '2px solid #e2e8f0',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      flex: '0 0 calc(100%)',
                      [`@media (min-width: 600px)`]: {
                        flex: '0 0 calc(50% - 12px)',
                      },
                      [`@media (min-width: 900px)`]: {
                        flex: '0 0 calc(50% - 16px)',
                      },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: 'none',
                      position: 'relative',
                      '&:hover': {
                        transform: isDisabled ? 'none' : 'translateY(-6px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        borderColor: isDisabled ? '#e2e8f0' : '#cbd5e1',
                      },
                      ...(isDisabled && {
                        opacity: 0.5,
                        filter: 'grayscale(0.4)',
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      }),
                    }}
                  >
                    {/* 画像エリア（タイトル重ね表示） */}
                    <CardMedia
                      component="a"
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        height: 160,
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
                        '&:hover': {
                          '& .title-text': {
                            color: '#64b5f6 !important',
                          },
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
                          zIndex: 1,
                        },
                      }}
                    >
                      {/* 決定ラベル - 画像の中央に配置 */}
                      {isDecided && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                            background: 'rgba(255, 255, 255, 0.6)',
                            color: '#1976d2',
                            padding: '6px 12px',
                            borderRadius: 2,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            letterSpacing: '0.025em',
                            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(25, 118, 210, 0.15)',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          決定
                        </Box>
                      )}
                      {/* タイトルを画像の上に重ね表示 */}
                      <Box
                        sx={{
                          position: 'relative',
                          zIndex: 2,
                          p: 2.5,
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {option.title ? (
                          <Typography
                            variant="h6"
                            fontWeight="800"
                            className="title-text"
                            sx={{
                              color: 'white',
                              fontSize: '1.2rem',
                              lineHeight: 1.3,
                              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1,
                              transition: 'color 0.3s ease',
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
                                backgroundColor: 'rgba(255,255,255,0.2)',
                              },
                            }}
                          />
                        )}
                      </Box>

                      {!option.image && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2,
                            textAlign: 'center',
                          }}
                        >
                          <RestaurantIcon
                            sx={{
                              fontSize: 64,
                              color: '#adb5bd',
                              mb: 1.5,
                              opacity: 0.8,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontWeight: 500,
                              opacity: 0.7,
                            }}
                          >
                            画像を読み込み中...
                          </Typography>
                        </Box>
                      )}
                    </CardMedia>

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'transparent',
                        backdropFilter: 'none',
                        borderRadius: '0 0 12px 12px',
                      }}
                    >
                      {/* 投票結果 */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography
                          variant="h3"
                          sx={{
                            color: '#1d4ed8',
                            fontWeight: 900,
                            fontSize: '2.4rem',
                            textShadow: 'none',
                            background: 'none',
                            backgroundClip: 'initial',
                            WebkitBackgroundClip: 'initial',
                            WebkitTextFillColor: 'initial',
                            '& .vote-unit': {
                              fontSize: '0.85rem',
                              fontWeight: 500,
                            },
                          }}
                        >
                          {option.votes} <span className="vote-unit">票</span>
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            color: '#1d4ed8',
                            fontWeight: 800,
                            fontSize: '2rem',
                            textShadow: 'none',
                            background: 'none',
                            backgroundClip: 'initial',
                            WebkitBackgroundClip: 'initial',
                            WebkitTextFillColor: 'initial',
                          }}
                        >
                          {votePercentage.toFixed(1)}%
                        </Typography>
                      </Box>

                      {/* プログレスバー */}
                      <LinearProgress
                        variant="determinate"
                        value={votePercentage}
                        sx={{
                          height: 16,
                          borderRadius: 8,
                          backgroundColor: 'rgba(239, 246, 255, 0.8)',
                          border: '1px solid #bfdbfe',
                          mb: 3,
                          boxShadow: 'none',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 6,
                            background: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)',
                            boxShadow: 'none',
                          },
                        }}
                      />

                      {/* 投票ボタンまたは投票者リスト */}
                      {isPollClosed ? (
                        // 投票終了時：投票者リストを表示
                        <Box
                          sx={{
                            p: 3,
                            textAlign: 'center',
                            background: 'rgba(107, 114, 128, 0.05)',
                            borderRadius: 2,
                            border: '1px solid rgba(107, 114, 128, 0.2)',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          {option.voters && option.voters.length > 0 ? (
                            <Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 1,
                                  justifyContent: 'center',
                                  maxHeight: '120px',
                                  overflow: 'hidden',
                                }}
                              >
                                {option.voters.slice(0, 8).map((voter, index) => (
                                  <Box
                                    key={voter.id}
                                    sx={{
                                      background: 'rgba(107, 114, 128, 0.08)',
                                      color: '#6b7280',
                                      px: 0.8,
                                      py: 0.3,
                                      borderRadius: 1,
                                      fontSize: '0.75rem',
                                      fontWeight: 500,
                                      border: '1px solid rgba(107, 114, 128, 0.15)',
                                    }}
                                  >
                                    {voter.name}
                                  </Box>
                                ))}
                                {option.voters.length > 8 && (
                                  <Box
                                    sx={{
                                      background: 'rgba(107, 114, 128, 0.08)',
                                      color: '#6b7280',
                                      px: 0.8,
                                      py: 0.3,
                                      borderRadius: 1,
                                      fontSize: '0.65rem',
                                      fontWeight: 500,
                                      border: '1px solid rgba(107, 114, 128, 0.15)',
                                    }}
                                  >
                                    +{option.voters.length - 8}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#6b7280',
                                fontStyle: 'italic',
                              }}
                            >
                              投票者が存在しません
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        // 投票中：投票ボタンを表示
                        <Button
                          onClick={() => vote(option.id)}
                          disabled={isVoting}
                          variant={isVoted ? 'outlined' : 'contained'}
                          startIcon={
                            isVoted ? (
                              <CheckIcon sx={{ fontSize: '1.2rem' }} />
                            ) : (
                              <ThumbUpIcon sx={{ fontSize: '1.2rem' }} />
                            )
                          }
                          fullWidth
                          size="large"
                          sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 800,
                            fontSize: '1rem',
                            py: 2,
                            position: 'relative',
                            minHeight: '64px',
                            ...(isVoted && {
                              color: '#0369a1',
                              borderColor: '#bfdbfe',
                              borderWidth: 2,
                              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                              backdropFilter: 'blur(10px)',
                              boxShadow: 'none',
                              fontWeight: 700,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                color: '#1e40af',
                                borderColor: '#60a5fa',
                                boxShadow: 'none',
                                transform: 'none',
                              },
                            }),
                            ...(!isVoted && {
                              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                              color: '#1d4ed8',
                              boxShadow: 'none',
                              border: '2px solid #bfdbfe',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                color: '#1e40af',
                                boxShadow: 'none',
                                transform: 'none',
                              },
                            }),
                          }}
                        >
                          {isVoting ? (
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <CircularProgress size={20} sx={{ color: 'white' }} />
                              <Typography sx={{ fontWeight: 800 }}>投票中...</Typography>
                            </Box>
                          ) : isVoted ? (
                            '投票済み'
                          ) : (
                            '投票する'
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
        </Box>

        <Box
          sx={{
            border: '1px solid #e5e7eb',
            backgroundColor: '#f3f4f6',
            p: 3,
            borderRadius: 1,
            height: 128,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: '0.875rem',
          }}
        >
          バナー広告
        </Box>
      </Box>

      {/* 勝者決定ダイアログ */}
      <PollResultDialog />

      {/* 名前入力ダイアログ */}
      <Dialog open={nameDialogOpen} onClose={() => {}} maxWidth="sm" fullWidth>
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
