'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { checkIsOrganizer } from '@/utils/storage';
import { closeScheduleAction, deleteScheduleAction, reopenScheduleAction } from '../actions';

interface UseScheduleActionsProps {
  scheduleId: string;
}

export function useScheduleActions({ scheduleId }: UseScheduleActionsProps) {
  const router = useRouter();

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    setIsOrganizer(checkIsOrganizer(scheduleId));
  }, [scheduleId]);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setMenuAnchorEl(null);
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseClick = useCallback(() => {
    setMenuAnchorEl(null);
    setCloseDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      const result = await deleteScheduleAction(scheduleId);
      if (!result.success) {
        throw new Error(result.error || '削除に失敗しました');
      }
      window.location.href = '/';
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert(err instanceof Error ? err.message : '削除に失敗しました');
    } finally {
      setDeleteDialogOpen(false);
    }
  }, [scheduleId]);

  const handleCloseConfirm = useCallback(
    async (confirmedDateTime: string) => {
      try {
        const result = await closeScheduleAction(scheduleId, confirmedDateTime);
        if (!result.success) {
          throw new Error(result.error || '確定に失敗しました');
        }
        router.refresh();
      } catch (err) {
        console.error('Error closing schedule:', err);
        alert(err instanceof Error ? err.message : '確定に失敗しました');
      } finally {
        setCloseDialogOpen(false);
      }
    },
    [scheduleId, router]
  );

  const handleReopenConfirm = useCallback(async () => {
    setMenuAnchorEl(null); // Close menu
    try {
      const result = await reopenScheduleAction(scheduleId);
      if (!result.success) {
        throw new Error(result.error || '再開に失敗しました');
      }
      router.refresh();
    } catch (err) {
      console.error('Error reopening schedule:', err);
      alert(err instanceof Error ? err.message : '再開に失敗しました');
    }
  }, [scheduleId, router]);

  return {
    menuAnchorEl,
    isMenuOpen: Boolean(menuAnchorEl),
    deleteDialogOpen,
    closeDialogOpen,
    handleMenuOpen,
    handleMenuClose,
    handleDeleteClick,
    handleCloseClick,
    handleDeleteConfirm,
    handleCloseConfirm,
    handleReopenConfirm,
    setDeleteDialogOpen,
    setCloseDialogOpen,
    isOrganizer,
  };
}
