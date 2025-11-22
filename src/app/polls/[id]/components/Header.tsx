import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Stop as StopIcon, Settings as SettingsIcon, Edit as EditIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import type { DBPoll as Poll } from '@/services/db/poll/types';
import { CustomDialog } from '@/app/components/CustomDialog';

interface HeaderProps {
  poll: Poll | null;
  onEndPoll: () => void;
  onChangeVoterName: () => void;
  hasVoterName: boolean;
}

function formatTime(seconds: number): string {
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
}

export function Header({
  poll,
  onEndPoll,
  onChangeVoterName,
  hasVoterName,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [, setTick] = useState(0);
  const open = Boolean(anchorEl);

  // リアルタイム更新のため、1秒ごとに再レンダリング
  useEffect(() => {
    if (!poll?.endDateTime || poll.isClosed === 1) {
      return;
    }

    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [poll]);

  const getTimeRemaining = (): number => {
    if (!poll?.endDateTime) return 0;
    const endTime = new Date(poll.endDateTime).getTime();
    const now = Date.now();
    return Math.max(0, Math.ceil((endTime - now) / 1000));
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEndPollClick = () => {
    setConfirmDialogOpen(true);
    handleClose();
  };

  const handleConfirmEndPoll = () => {
    setConfirmDialogOpen(false);
    onEndPoll();
  };

  const handleCancelEndPoll = () => {
    setConfirmDialogOpen(false);
  };

  const handleChangeVoterName = () => {
    onChangeVoterName();
    handleClose();
  };

  return (
    <Box
      sx={{
        background: '#ffffff',
        borderRadius: 0.5,
        p: { xs: 2.5, sm: 3 },
        mb: 3,
        border: '1px solid #e5e7eb',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          fontWeight="700"
          sx={{
            color: '#111827',
            fontSize: { xs: '20px', sm: '24px' },
            lineHeight: 1.3,
            flex: 1,
            minWidth: 0,
          }}
        >
          {poll?.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          {poll && poll.endDateTime && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 1,
                backgroundColor: '#eff6ff',
                borderRadius: 2,
                border: '1px solid #bfdbfe',
                minWidth: 'fit-content',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#1e40af',
                  fontWeight: 500,
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.01em',
                }}
              >
                投票受付:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#1e40af',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {formatTime(getTimeRemaining())}
              </Typography>
            </Box>
          )}

          {poll && (
            <>
              <IconButton
                id="poll-settings-button"
                onClick={handleClick}
                sx={{
                  p: 1,
                  color: '#6b7280',
                  border: '1px solid #e5e7eb',
                  borderRadius: 1.5,
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    borderColor: '#d1d5db',
                    color: '#374151',
                  },
                }}
              >
                <SettingsIcon sx={{ fontSize: '20px' }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                  },
                }}
                MenuListProps={{
                  sx: {
                    py: 0.5,
                  },
                }}
              >
                <MenuItem
                  onClick={handleChangeVoterName}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#f3f4f6',
                    },
                    '&:active': {
                      backgroundColor: '#e5e7eb',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <EditIcon fontSize="small" sx={{ color: '#3b82f6' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={hasVoterName ? '投票者名を変更' : '投票者名を設定'}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#374151',
                    }}
                  />
                </MenuItem>
                <MenuItem
                  onClick={handleEndPollClick}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#fef2f2',
                    },
                    '&:active': {
                      backgroundColor: '#fee2e2',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <StopIcon fontSize="small" sx={{ color: '#ef4444' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="投票を終了"
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#dc2626',
                    }}
                  />
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>

      <CustomDialog
        open={confirmDialogOpen}
        onClose={handleCancelEndPoll}
        title="投票を終了しますか？"
        description="投票を終了すると結果が全員に表示され、以降は新しい投票を受け付けなくなります。この操作は取り消せません。"
        confirmLabel="投票を終了"
        onConfirm={handleConfirmEndPoll}
        confirmButtonColor="error"
        confirmButtonProps={{
          startIcon: <StopIcon />,
        }}
      />
    </Box>
  );
}

