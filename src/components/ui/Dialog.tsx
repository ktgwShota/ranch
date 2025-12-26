'use client';

import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  type ButtonProps,
  type DialogProps as MuiDialogProps,
} from '@mui/material';
import type { ReactNode } from 'react';

interface DialogProps extends Omit<MuiDialogProps, 'open' | 'onClose' | 'title'> {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  confirmButtonColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export function Dialog({
  children,
  open,
  onClose,
  title,
  description,
  cancelLabel = 'キャンセル',
  confirmLabel,
  onConfirm,
  confirmButtonProps,
  cancelButtonProps,
  confirmButtonColor = 'primary',
  maxWidth = 'sm',
  fullWidth = true,
  PaperProps,
  ...props
}: DialogProps) {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          mx: 2,
          width: 'calc(100% - 32px)',
          borderRadius: 2,
          ...PaperProps?.sx,
        },
        ...PaperProps,
      }}
      {...props}
    >
      <DialogTitle
        sx={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'text.primary',
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
                color: 'text.secondary',
                fontSize: '0.875rem',
                mb: children ? 2 : 0,
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
                color: 'text.primary',
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
    </MuiDialog>
  );
}
