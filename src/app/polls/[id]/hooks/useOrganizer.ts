import { useEffect, useState } from 'react';
import { verifyPollPasswordAction } from '@/app/polls/actions';

export function useOrganizer(pollId: string | null, pollPassword: string | null) {
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  useEffect(() => {
    if (pollId) {
      const organizerKey = `organizer_${pollId}`;
      const organizerFlag = localStorage.getItem(organizerKey) === 'true';
      setIsOrganizer(organizerFlag);
    }
  }, [pollId]);

  const checkOrganizerAccess = (onAuthorized: () => void, onPasswordRequired?: () => void) => {
    if (!pollId) return;

    const organizerKey = `organizer_${pollId}`;
    const hasOrganizerFlag = localStorage.getItem(organizerKey) === 'true';

    if (hasOrganizerFlag) {
      onAuthorized();
      return;
    }

    if (!pollPassword) {
      setErrorDialogOpen(true);
      return;
    }

    if (onPasswordRequired) {
      onPasswordRequired();
    } else {
      setPasswordDialogOpen(true);
    }
  };

  /* import verifyPollPasswordAction from '@/app/polls/actions'; // これはトップレベルで行う */

  const verifyPassword = async (password: string): Promise<void> => {
    if (!pollId) return;

    const result = await verifyPollPasswordAction(pollId, password);

    if (!result.success) {
      throw new Error(result.error || 'パスワードが正しくありません');
    }

    const organizerKey = `organizer_${pollId}`;
    localStorage.setItem(organizerKey, 'true');
    setIsOrganizer(true);
  };

  return {
    isOrganizer,
    passwordDialogOpen,
    errorDialogOpen,
    setPasswordDialogOpen,
    setErrorDialogOpen,
    checkOrganizerAccess,
    verifyPassword,
  };
}
