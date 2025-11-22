'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ButtonProps,
} from '@mui/material';
import { ReactNode } from 'react';

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  confirmButtonColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
}

export function CustomDialog({
  open,
  onClose,
  title,
  description,
  children,
  cancelLabel = 'キャンセル',
  confirmLabel,
  onConfirm,
  confirmButtonProps,
  cancelButtonProps,
  confirmButtonColor = 'primary',
  maxWidth = 'sm',
  fullWidth = true,
}: CustomDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 1,
          minWidth: 320,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#111827',
          pt: 3,
          px: 3,
          pb: 2,
        }}
      >
        {title}
      </DialogTitle>
      {(description || children) && (
        <DialogContent sx={{ px: 3, py: 0 }}>
          {description && (
            <DialogContentText
              sx={{
                color: '#6b7280',
                fontSize: '0.875rem',
              }}
            >
              {description}
            </DialogContentText>
          )}
          {children}
        </DialogContent>
      )}
      {(onConfirm || cancelLabel) && (
        <DialogActions
          sx={{
            p: 3,
            gap: 1,
          }}
        >
          {cancelLabel && (
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: 1.5,
                px: 2,
                py: 1,
                borderColor: '#d1d5db',
                color: '#374151',
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                },
              }}
              {...cancelButtonProps}
            >
              {cancelLabel}
            </Button>
          )}
          {onConfirm && confirmLabel && (
            <Button
              onClick={onConfirm}
              variant="contained"
              color={confirmButtonColor}
              sx={{
                textTransform: 'none',
                borderRadius: 1.5,
                px: 2,
                py: 1,
                ...(confirmButtonColor === 'error' && {
                  backgroundColor: '#ef4444',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                  },
                }),
              }}
              {...confirmButtonProps}
            >
              {confirmLabel}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}

