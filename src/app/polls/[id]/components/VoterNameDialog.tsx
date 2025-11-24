'use client';

import { TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { CustomDialog } from '@/app/components/CustomDialog';
import { useErrorStore } from '@/app/stores/errorStore';

interface VoterNameDialogProps {
  open: boolean;
  pollId: string;
  type: 'vote' | 'name-change';
  initialName?: string;
  onClose: () => void;
  onSubmit?: (name: string, userId: string) => void | Promise<void>;
}

export function VoterNameDialog({
  open,
  onClose,
  pollId,
  type,
  initialName = '',
  onSubmit,
}: VoterNameDialogProps) {
  const [tempName, setTempName] = useState(initialName);
  const [submitting, setSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const { showError } = useErrorStore();

  useEffect(() => {
    if (open) {
      setTempName(initialName);
      setNameError(null);
    }
  }, [open, initialName]);

  const handleSubmit = async () => {
    if (!tempName.trim()) {
      setNameError('入力は必須です');
      return;
    }

    setNameError(null);
    setSubmitting(true);

    try {
      const storageKey = `voterInfo_${pollId}`;
      const storedInfo = localStorage.getItem(storageKey);

      let userId: string;
      if (storedInfo) {
        try {
          const userInfo = JSON.parse(storedInfo);
          userId = userInfo.id;
        } catch {
          userId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
      } else {
        userId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      const newName = tempName.trim();
      const userInfo = {
        id: userId,
        name: newName,
      };

      localStorage.setItem(storageKey, JSON.stringify(userInfo));

      if (storedInfo) {
        try {
          const response = await fetch(`/api/polls/${pollId}/voter-name`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              voterId: userId,
              voterName: newName,
            }),
          });

          if (!response.ok) {
            let errorData: { error?: string };
            try {
              errorData = await response.json();
            } catch {
              errorData = {};
            }
            throw new Error(errorData.error || '名前の更新に失敗しました');
          }
        } catch (e) {
          showError('api');
        }
      }

      if (onSubmit) {
        try {
          await onSubmit(newName, userId);
        } catch (error) {
          showError('api');
          setSubmitting(false);
          return;
        }
      }

      onClose();
    } catch (error) {
      showError('unknown');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      title="投票者として表示する名前を入力してください"
      confirmLabel="決定"
      onConfirm={handleSubmit}
      confirmButtonProps={{
        disabled: tempName.trim() === '' || submitting,
      }}
    >
      <TextField
        autoFocus
        margin="dense"
        fullWidth
        variant="outlined"
        value={tempName}
        onChange={(e) => {
          setTempName(e.target.value);
          if (nameError) {
            setNameError(null);
          }
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !nameError && tempName.trim() && !submitting) {
            handleSubmit();
          }
        }}
        error={!!nameError}
        helperText={nameError}
        disabled={submitting}
        sx={{
          my: 0,
          '& .MuiOutlinedInput-root': {
            borderRadius: 0.5,
          },
        }}
      />
    </CustomDialog>
  );
}

