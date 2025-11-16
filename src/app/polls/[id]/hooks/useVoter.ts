import { useState, useEffect } from 'react';

export function useVoter(pollId: string) {
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [tempName, setTempName] = useState<string>('');

  useEffect(() => {
    const cookieName = `voterInfo_${pollId}`;
    const cookies = document.cookie.split(';');
    const voterCookie = cookies.find((cookie) => cookie.trim().startsWith(`${cookieName}=`));

    if (voterCookie) {
      try {
        const cookieValue = decodeURIComponent(voterCookie.split('=')[1]);
        const userInfo = JSON.parse(cookieValue);
        setUserName(userInfo.name);
        setUserId(userInfo.id);
      } catch (error) {
        console.error('Error parsing stored user info:', error);
        setNameDialogOpen(true);
      }
    } else {
      setNameDialogOpen(true);
    }
  }, [pollId]);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      const newUserId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userInfo = {
        id: newUserId,
        name: tempName.trim(),
      };

      setUserName(userInfo.name);
      setUserId(userInfo.id);

      // クッキーに保存（7日間有効）
      const cookieName = `voterInfo_${pollId}`;
      const cookieValue = encodeURIComponent(JSON.stringify(userInfo));
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      document.cookie = `${cookieName}=${cookieValue}; expires=${expires.toUTCString()}; path=/`;

      setNameDialogOpen(false);
    }
  };

  return {
    userName,
    userId,
    nameDialogOpen,
    tempName,
    setTempName,
    setNameDialogOpen,
    handleNameSubmit,
  };
}

