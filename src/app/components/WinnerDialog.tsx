'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Link,
  Chip,
} from '@mui/material';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';

interface Poll {
  id: string;
  title: string;
  isClosed?: boolean;
  options: Array<{
    id: number;
    title?: string;
    url: string;
    votes: number;
  }>;
}

const WinnerDialog: React.FC = () => {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls/${params.id}`);
        if (response.ok) {
          const pollData = await response.json() as Poll;
          setPoll(pollData);

          // 投票が終了している場合のみダイアログを表示
          if (pollData.isClosed) {
            setOpen(true);
          }
        }
      } catch (error) {
        console.error('投票データの取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPoll();
    }
  }, [params.id]);

  const getWinningOption = (poll: Poll) => {
    if (!poll.options || poll.options.length === 0) return null;
    return poll.options.reduce((max, option) =>
      option.votes > max.votes ? option : max
    );
  };

  const getTotalVotes = (poll: Poll) => {
    if (!poll.options || poll.options.length === 0) return 0;
    return poll.options.reduce((total, option) => total + option.votes, 0);
  };

  const winningOption = poll ? getWinningOption(poll) : null;
  const totalVotes = poll ? getTotalVotes(poll) : 0;
  const winningPercentage = winningOption && totalVotes > 0
    ? Math.round((winningOption.votes / totalVotes) * 100)
    : 0;

  if (loading || !poll || !winningOption) {
    return null;
  }
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{
        textAlign: 'center',
        pb: 3,
        pt: 4,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography
          variant="h4"
          sx={{
            color: '#2c3e50',
            fontWeight: 700,
            fontSize: '2rem',
            mb: 1,
            letterSpacing: '-0.02em'
          }}
        >
          こちらのお店に決定しました
        </Typography>
        <Box sx={{
          width: '100%',
          height: 4,
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          borderRadius: 2,
          mt: 2.5,
          mx: 'auto'
        }} />
      </DialogTitle>

      <DialogContent sx={{
        textAlign: 'center',
        '&.MuiDialogContent-root': {
          p: 0
        }
      }}>
        <Box sx={{
          m: 3,
          p: 4,
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          backgroundColor: '#fafafa',
          position: 'relative'
        }}>
          <Typography
            variant="h5"
            sx={{
              color: '#333',
              fontWeight: 600,
              fontSize: '1.5rem',
              mb: 3,
              lineHeight: 1.4
            }}
          >
            {winningOption.title}
          </Typography>

          {/* 投票結果表示 */}
          <Box sx={{
            mb: 3,
            textAlign: 'center'
          }}>
            <Typography
              variant="h4"
              sx={{
                color: '#1976d2',
                fontWeight: 700,
                fontSize: '2.2rem',
                mb: 1,
                letterSpacing: '-0.01em'
              }}
            >
              {winningPercentage}%
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                fontWeight: 500,
                fontSize: '1rem',
                mb: 1
              }}
            >
              ({winningOption.votes}<span className="mx-0.5">/</span>{totalVotes})
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#888',
                fontWeight: 400,
                fontSize: '0.9rem'
              }}
            >
              で決定しました
            </Typography>
          </Box>

          <Link
            href={winningOption.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.02em',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                textDecoration: 'none',
                color: '#fff'
              }
            }}
          >
            お店の詳細
            <OpenInNewIcon sx={{ fontSize: '1.1rem' }} />
          </Link>
        </Box>
      </DialogContent>

    </Dialog>
  );
};

export default WinnerDialog;
