'use client';

import { Snackbar, Alert } from '@mui/material';
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
      <Alert onClose={closeError} severity="error" sx={{ width: '100%' }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
}

