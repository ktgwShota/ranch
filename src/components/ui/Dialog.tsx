'use client';

import type { ComponentProps } from 'react';
import { Button } from '@/components/primitives/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  Dialog as DialogPrimitiveRoot,
  DialogTitle,
} from '@/components/primitives/dialog';

type ButtonProps = ComponentProps<typeof Button>;

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  confirmButtonColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  // Compatibility props (ignored or mapped)
  PaperProps?: any;
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
  maxWidth = 'sm', // Used for sizing logic
  fullWidth = true, // Used for sizing logic
  PaperProps, // Mapped to content className partially if needed, but mostly ignored for shadcn style
  ...props
}: DialogProps) {
  // Max width mapping
  const getMaxWidthClass = (mw: string | boolean | undefined) => {
    switch (mw) {
      case 'xs':
        return 'max-w-xs';
      case 'sm':
        return 'max-w-sm'; // Default shadcn dialog width roughly
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      default:
        return 'max-w-sm';
    }
  };

  return (
    <DialogPrimitiveRoot open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className={`${getMaxWidthClass(maxWidth)} ${fullWidth ? 'w-full' : ''}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children && <div className="py-4">{children}</div>}

        {(onConfirm || cancelLabel) && (
          <DialogFooter>
            {cancelLabel && (
              <Button variant="outline" onClick={onClose} {...cancelButtonProps}>
                {cancelLabel}
              </Button>
            )}
            {onConfirm && confirmLabel && (
              <Button
                onClick={onConfirm}
                variant={confirmButtonColor === 'error' ? 'destructive' : 'default'} // Mapping color to shadcn variant
                {...confirmButtonProps}
              >
                {confirmLabel}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </DialogPrimitiveRoot>
  );
}
