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
import { PasswordDialog } from './PasswordDialog';

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
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
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

  // 主催者フラグをチェック
  useEffect(() => {
    if (poll) {
      const organizerKey = `organizer_${poll.id}`;
      const organizerFlag = localStorage.getItem(organizerKey) === 'true';
      setIsOrganizer(organizerFlag);
    }
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
    handleClose();

    if (!poll) return;

    // localStorageから主催者フラグを直接チェック
    const organizerKey = `organizer_${poll.id}`;
    const hasOrganizerFlag = localStorage.getItem(organizerKey) === 'true';

    // 主催者フラグがある場合はそのまま確認ダイアログを表示
    if (hasOrganizerFlag) {
      setConfirmDialogOpen(true);
      return;
    }

    // 主催者フラグがない場合
    // パスワードが設定されていない場合は誰でも投票終了できるので確認ダイアログを表示
    if (!poll.password) {
      setConfirmDialogOpen(true);
      return;
    }

    // 主催者フラグがなく、パスワードが設定されている場合はパスワード入力ダイアログを表示
    setPasswordDialogOpen(true);
  };

  const handlePasswordConfirm = async (password: string) => {
    if (!poll) return;

    // パスワードを検証
    const response = await fetch(`/api/polls/${poll.id}/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'パスワードが正しくありません');
    }

    // パスワードが正しい場合、localStorageに主催者フラグを保存
    const organizerKey = `organizer_${poll.id}`;
    localStorage.setItem(organizerKey, 'true');
    setIsOrganizer(true);

    // パスワードダイアログを閉じて確認ダイアログを表示
    setPasswordDialogOpen(false);
    setConfirmDialogOpen(true);
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

  // 投票終了ボタンは常に有効（主催者フラグがない場合はパスワード入力ダイアログを表示）
  const canEndPoll = poll ? true : false;

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
            color: 'text.primary',
            fontSize: '20px',
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
                variant="body1"
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
                  color: 'text.secondary',
                  border: '1px solid #e5e7eb',
                  borderRadius: 1.5,
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    borderColor: '#d1d5db',
                    color: 'text.primary',
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
                      color: 'text.primary',
                    }}
                  />
                </MenuItem>
                <MenuItem
                  onClick={handleEndPollClick}
                  disabled={!canEndPoll}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      backgroundColor: canEndPoll ? '#fef2f2' : 'transparent',
                    },
                    '&:active': {
                      backgroundColor: canEndPoll ? '#fee2e2' : 'transparent',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <StopIcon fontSize="small" sx={{ color: canEndPoll ? '#ef4444' : 'text.disabled' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="投票を終了"
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: canEndPoll ? '#dc2626' : 'text.disabled',
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

      {poll && (
        <PasswordDialog
          open={passwordDialogOpen}
          onClose={() => setPasswordDialogOpen(false)}
          onConfirm={handlePasswordConfirm}
          pollId={poll.id}
        />
      )}
    </Box>
  );
}

