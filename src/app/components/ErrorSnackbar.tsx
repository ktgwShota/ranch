'use client';

import { Snackbar, Alert, Box } from '@mui/material';
import { useErrorStore } from '@/app/stores/errorStore';

export function ErrorSnackbar() {
  const { errorMessage, isOpen, closeError } = useErrorStore();

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={closeError}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity="error"
        sx={{
          width: '100%',
          minWidth: 300,
          maxWidth: 320,
          py: 2,
          px: 1.5,
          borderRadius: 1,
          border: '1px solid #fecaca',
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          '& .MuiAlert-icon': {
            color: '#dc2626',
            fontSize: '20px',
            padding: 0,
            marginRight: 1,
          },
          '& .MuiAlert-message': {
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 1.5,
            padding: 0,
          },
        }}
      >
        <Box component="span">{errorMessage}</Box>
      </Alert>
    </Snackbar>
  );
}

