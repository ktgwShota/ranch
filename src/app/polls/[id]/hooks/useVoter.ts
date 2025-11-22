import { useState, useEffect } from 'react';

export function useVoter(pollId: string) {
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [tempName, setTempName] = useState<string>('');

  useEffect(() => {
    // ローカルストレージから投票者情報を取得
    const storageKey = `voterInfo_${pollId}`;
    const storedInfo = localStorage.getItem(storageKey);

    if (storedInfo) {
      try {
        const userInfo = JSON.parse(storedInfo);
        setUserName(userInfo.name);
        setUserId(userInfo.id);
      } catch (error) {
        console.error('Error parsing stored user info:', error);
        localStorage.removeItem(storageKey);
      }
    }
    // 初期表示時にはダイアログを開かない
  }, [pollId]);

  const handleNameSubmit = async () => {
    if (tempName.trim()) {
      const newName = tempName.trim();
      // userIdがない場合は新しく生成
      const newUserId = userId || `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userInfo = {
        id: newUserId,
        name: newName,
      };

      setUserName(userInfo.name);
      setUserId(userInfo.id);

      // ローカルストレージに保存
      const storageKey = `voterInfo_${pollId}`;
      localStorage.setItem(storageKey, JSON.stringify(userInfo));

      // データベースの投票者名も更新（投票済みの場合のみ、userIdが既に存在する場合）
      if (userId) {
        try {
          await fetch(`/api/polls/${pollId}/voter-name`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              voterId: userId,
              voterName: newName,
            }),
          });
        } catch (error) {
          console.error('Error updating voter name:', error);
        }
      }

      setNameDialogOpen(false);
    }
  };

  const checkAndOpenDialog = () => {
    if (!userId || !userName) {
      setNameDialogOpen(true);
      return false;
    }
    return true;
  };

  return {
    userName,
    userId,
    setUserName,
    setUserId,
    nameDialogOpen,
    tempName,
    setTempName,
    setNameDialogOpen,
    handleNameSubmit,
    checkAndOpenDialog,
  };
}

