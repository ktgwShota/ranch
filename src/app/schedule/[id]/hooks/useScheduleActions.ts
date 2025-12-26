import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    try {
      const CREATED_SCHEDULES_KEY = 'my_created_schedules';
      const stored = localStorage.getItem(CREATED_SCHEDULES_KEY);
      const createdSchedules: string[] = stored ? JSON.parse(stored) : [];
      setIsOrganizer(createdSchedules.includes(scheduleId));
    } catch (e) {
      console.error('Failed to check organizer permission', e);
      setIsOrganizer(false);
    }
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
      const response = await fetch(`/api/schedules/${scheduleId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || '削除に失敗しました');
      }
      window.location.href = '/';
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert(err instanceof Error ? err.message : '削除に失敗しました');
    } finally {
      setDeleteDialogOpen(false);
    }
  }, [scheduleId]);

  const handleCloseConfirm = useCallback(async (confirmedDateTime: string) => {
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'close', confirmedDateTime }),
      });
      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || '確定に失敗しました');
      }
      router.refresh();
    } catch (err) {
      console.error('Error closing schedule:', err);
      alert(err instanceof Error ? err.message : '確定に失敗しました');
    } finally {
      setCloseDialogOpen(false);
    }
  }, [scheduleId, router]);

  const handleReopenConfirm = useCallback(async () => {
    setMenuAnchorEl(null); // Close menu
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reopen' }),
      });
      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || '再開に失敗しました');
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

