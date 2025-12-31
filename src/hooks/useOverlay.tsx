import { type ReactNode, useCallback, useState } from 'react';

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
          <div
            onClick={close}
            className="fixed inset-0 z-[9999]"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
            }}
          />

          <div onClick={(e) => e.stopPropagation()} className="relative z-[10000]">
            {children}
          </div>
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
