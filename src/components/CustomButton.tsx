'use client';

import { Box, Button, CircularProgress, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';

interface CustomButtonProps extends ButtonProps {
  children: ReactNode;
  className?: string;
  loading?: boolean;
  loadingText?: string;
}

export function CustomButton({
  children,
  className,
  loading = false,
  loadingText,
  disabled,
  startIcon,
  endIcon,
  ...props
}: CustomButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Button
      {...props}
      disabled={isDisabled}
      className={className}
      startIcon={loading ? undefined : startIcon}
      endIcon={loading ? undefined : endIcon}
    >
      {loading ? (
        <Box display="flex" alignItems="center" gap={1.5}>
          <CircularProgress size={16} color="inherit" />
          {loadingText && <Box component="span">{loadingText}</Box>}
        </Box>
      ) : (
        children
      )}
    </Button>
  );
}

