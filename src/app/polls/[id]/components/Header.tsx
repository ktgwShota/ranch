import {
  Box,
  Typography,
  Skeleton,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Stop as StopIcon, Settings as SettingsIcon, Edit as EditIcon } from '@mui/icons-material';
import { useState } from 'react';
import type { DBPoll as Poll } from '@/services/db/poll/types';
import { CustomDialog } from '@/app/components/CustomDialog';

interface HeaderProps {
  poll: Poll | null;
  loading: boolean;
  timeRemaining: number | null;
  formatTime: (seconds: number) => string;
  onEndPoll: () => void;
  onChangeVoterName: () => void;
  hasVoterName: boolean;
}

export function Header({
  poll,
  loading,
  timeRemaining,
  formatTime,
  onEndPoll,
  onChangeVoterName,
  hasVoterName,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

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
        background: '#f8f9fa',
        borderRadius: 0.5,
        p: 2.5,
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
              mx: 1,
              color: '#495057',
            }}
          >
            {poll?.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {poll && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: '18px',
                  py: '9px',
                  backgroundColor: poll?.endDateTime ? '#e3f2fd' : '#e8f5e8',
                  borderRadius: 3,
                  border: `1px solid ${poll?.endDateTime ? '#2196f3' : '#4caf50'}`,
                  minWidth: 'fit-content',
                  boxShadow: poll?.endDateTime
                    ? '0 2px 8px rgba(33, 150, 243, 0.2)'
                    : '0 2px 8px rgba(76, 175, 80, 0.2)',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: poll?.endDateTime ? '#1976d2' : '#4caf50',
                    fontWeight: 600,
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  投票受付:
                </Typography>
                {poll?.endDateTime ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#1976d2',
                      fontWeight: 700,
                      fontSize: '14px',
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
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    無期限
                  </Typography>
                )}
              </Box>
            )}

            {poll && (
              <>
                <IconButton
                  id="poll-settings-button"
                  onClick={handleClick}
                  sx={{
                    p: '6px',
                    color: '#495057',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <SettingsIcon sx={{ fontSize: '26px' }} />
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
      )}

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

