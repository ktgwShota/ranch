import { useState, useCallback, ReactNode } from 'react';
import { Box } from '@mui/material';

interface UseOverlayOptions {
  onClose?: () => void;
  overlayOpacity?: number;
}

export function useOverlay(options: UseOverlayOptions = {}) {
  const { onClose, overlayOpacity = 0.75 } = options;
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const OverlayComponent = useCallback(
    ({ children }: { children: ReactNode }) => {
      if (!isOpen) return null;

      return (
        <>
          <Box
            onClick={close}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
              zIndex: 9999,
            }}
          />

          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'relative',
              zIndex: 10000,
            }}
          >
            {children}
          </Box>
        </>
      );
    },
    [isOpen, close, overlayOpacity]
  );

  return {
    isOpen,
    open,
    close,
    Overlay: OverlayComponent,
  };
}
