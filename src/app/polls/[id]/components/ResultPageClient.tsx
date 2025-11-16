'use client';

import { Button } from '@mui/material';
import { Share as ShareIcon } from '@mui/icons-material';
import type { DBPoll as Poll } from '@/services/db/poll/types';

interface ResultPageClientProps {
  poll: Poll;
}

export function ResultPageClient({ poll }: ResultPageClientProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: poll.title,
        text: `投票結果: ${poll.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('URLをクリップボードにコピーしました');
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<ShareIcon />}
      onClick={handleShare}
      sx={{
        backgroundColor: '#3b82f6',
        textTransform: 'none',
        borderRadius: 0.5,
        px: 2,
        '&:hover': {
          backgroundColor: '#2563eb',
        },
      }}
    >
      結果を共有する
    </Button>
  );
}

