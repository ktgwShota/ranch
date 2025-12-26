'use client';

import { TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { useErrorStore } from '@/stores/useErrorStore';

interface PollVoterNameDialogProps {
  open: boolean;
  onClose: () => void;
  pollId?: string; // Accepted to match parent usage, though not strictly used here
  initialVoterName?: string;
  onSubmit: (name: string, userId: string) => Promise<void>;
}

export function PollVoterNameDialog({
  open,
  onClose,
  initialVoterName = '',
  onSubmit,
}: PollVoterNameDialogProps) {
  const [localName, setLocalName] = useState(initialVoterName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setLocalName(initialVoterName || '');
    }
  }, [initialVoterName, open]);

  const handleSave = async () => {
    const trimmedName = localName.trim();
    if (!trimmedName) {
      // setError('名前を入力してください');
      return;
    }
    if (trimmedName.length > 20) {
      // setError('名前は20文字以内で入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate a simple unique ID for the user
      // Matches the pattern used in other parts of the app (e.g. useScheduleResponse)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await onSubmit(trimmedName, userId);
      onClose();
    } catch (e) {
      console.error(e);
      // setError('エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setLocalName(initialVoterName || '');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="投票者として表示する名前を入力してください"
      description="この名前は他の参加者にも表示されます"
      confirmLabel="設定する"
      onConfirm={handleSave}
      cancelLabel="キャンセル"
      confirmButtonColor="primary"
      confirmButtonProps={{
        loading: isSubmitting,
      }}
    >
      <TextField
        autoFocus
        margin="dense"
        id="voter-name"
        label="名前"
        type="text"
        fullWidth
        variant="outlined"
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        placeholder="例：山田 太郎"
        sx={{ mt: 1 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
          }
        }}
      />
    </Dialog>
  );
}
