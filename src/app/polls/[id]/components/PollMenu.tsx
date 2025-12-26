import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import type { DBPoll as Poll } from '@/services/db/poll/types';
import { Dialog as ConfirmationDialog } from '@/components/ui/Dialog';

import { useOrganizer } from '../hooks/useOrganizer';
import { useRouter } from 'next/navigation';
import { closePoll, deletePoll } from '@/lib/api/pollApi';
import { PollPasswordDialog } from './PollPasswordDialog';

interface PollMenuProps {
  poll: Poll;
  onChangeVoterName: () => void;
  anchorEl: null | HTMLElement;
  onClose: () => void;
}

export function PollMenu({
  poll,
  onChangeVoterName,
  anchorEl,
  onClose,
}: PollMenuProps) {
  const router = useRouter();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [onPasswordSuccess, setOnPasswordSuccess] = useState<(() => void) | null>(null);
  const open = Boolean(anchorEl);
  const {
    passwordDialogOpen,
    errorDialogOpen,
    setPasswordDialogOpen,
    setErrorDialogOpen,
    checkOrganizerAccess,
    verifyPassword,
  } = useOrganizer(poll.id, poll.password);

  const requireOrganizerAccess = (action: () => void) => {
    checkOrganizerAccess(
      action,
      () => {
        setOnPasswordSuccess(() => action);
        setPasswordDialogOpen(true);
      }
    );
  };

  const handleClose = () => {
    onClose();
  };

  const handleEndPollClick = () => {
    handleClose();
    requireOrganizerAccess(() => setConfirmDialogOpen(true));
  };

  const handlePasswordConfirm = async (password: string) => {
    try {
      await verifyPassword(password);
      setPasswordDialogOpen(false);
      if (onPasswordSuccess) {
        onPasswordSuccess();
        setOnPasswordSuccess(null);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleConfirmEndPoll = async () => {
    setConfirmDialogOpen(false);

    try {
      await closePoll(poll.id);
      router.refresh();
    } catch (e) {
      alert('投票の公開に失敗しました。もう一度お試しください。');
    }
  };

  const handleChangeVoterName = () => {
    onChangeVoterName();
    handleClose();
  };

  const handleDeleteClick = () => {
    handleClose();
    requireOrganizerAccess(() => setDeleteDialogOpen(true));
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePoll(poll.id);
      window.location.href = '/';
    } catch (error) {
      alert(error instanceof Error ? error.message : '投票の削除に失敗しました');
    }
  };

  const canEndPoll = poll.isClosed === 0;

  const menuItems = [
    {
      id: 'change-voter-name',
      label: '投票者名を設定',
      icon: <EditIcon fontSize="small" sx={{ color: '#3b82f6' }} />,
      onClick: handleChangeVoterName,
      hoverColor: '#f3f4f6',
      textColor: 'text.primary',
      disabled: false,
    },
    {
      id: 'end-poll',
      label: '投票結果を公開',
      icon: <VisibilityIcon fontSize="small" sx={{ color: canEndPoll ? '#3b82f6' : 'text.disabled' }} />,
      onClick: handleEndPollClick,
      disabled: !canEndPoll,
      hoverColor: canEndPoll ? '#eff6ff' : 'transparent',
      textColor: canEndPoll ? '#1e40af' : 'text.disabled',
    },
    {
      id: 'delete-poll',
      label: 'ページを削除',
      icon: <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />,
      onClick: handleDeleteClick,
      disabled: false,
      hoverColor: '#fef2f2',
      textColor: '#dc2626',
    },
  ];

  return (
    <>
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
          elevation: 0,
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 0.5,
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          },
        }}
        MenuListProps={{
          sx: {
            py: 0.5,
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            onClick={item.onClick}
            disabled={item.disabled}
            sx={{
              py: 1.25,
              px: 2,
              borderRadius: 0.5,
              '&:hover': {
                backgroundColor: item.hoverColor,
              },
              '&.Mui-disabled': {
                opacity: 0.5,
                color: 'text.disabled',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 500,
                color: item.textColor,
              }}
            />
          </MenuItem>
        ))}
      </Menu>

      <PollPasswordDialog
        open={passwordDialogOpen}
        onClose={() => {
          setPasswordDialogOpen(false);
          setOnPasswordSuccess(null);
        }}
        onConfirm={handlePasswordConfirm}
      />

      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        title="投票を終了しますか？"
        description="投票を終了すると結果が全員に表示され、以降は新しい投票を受け付けなくなります。この操作は取り消せません。"
        confirmLabel="投票を終了"
        onConfirm={handleConfirmEndPoll}
        confirmButtonColor="error"
        confirmButtonProps={{
          startIcon: <VisibilityIcon />,
          disabled: false
        }}
        cancelLabel="キャンセル"
      />

      <ConfirmationDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="操作を実行できません"
        description="この投票はパスワードが設定されていないため、主催者のみが操作を実行できます。主催者のブラウザからアクセスしてください。"
        confirmLabel="閉じる"
        onConfirm={() => setErrorDialogOpen(false)}
        confirmButtonColor="primary"
        cancelLabel={undefined} // No cancel button
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="投票を削除しますか？"
        description="この操作は取り消せません。本当に削除してもよろしいですか？"
        confirmLabel="削除する"
        cancelLabel="キャンセル"
        onConfirm={handleConfirmDelete}
        confirmButtonColor="error"
        confirmButtonProps={{ disabled: false }}
      />
    </>
  );
}
