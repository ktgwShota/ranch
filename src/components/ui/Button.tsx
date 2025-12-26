'use client';

import { Button as MuiButton, CircularProgress, type ButtonProps as MuiButtonProps } from '@mui/material';
import type { ReactNode } from 'react';

interface ButtonProps extends MuiButtonProps {
  children: ReactNode;
  loading?: boolean;
}

export function Button({
  children,
  loading,
  disabled,
  sx,
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      disabled={disabled || loading}
      sx={{
        position: 'relative',
        ...sx,
      }}
      {...props}
    >
      {children}
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: 'primary.main',
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </MuiButton>
  );
}
