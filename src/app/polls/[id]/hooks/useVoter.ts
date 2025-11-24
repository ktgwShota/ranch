import { useState, useEffect } from 'react';

export interface Voter {
  id: string;
  name: string;
}

export function useVoter(pollId: string) {
  const [voter, setVoter] = useState<Voter | null>(null);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [tempName, setTempName] = useState<string>('');

  useEffect(() => {
    // ローカルストレージから投票者情報を取得
    const storageKey = `voterInfo_${pollId}`;
    const storedInfo = localStorage.getItem(storageKey);

    if (storedInfo) {
      try {
        const userInfo: Voter = JSON.parse(storedInfo);
        setVoter(userInfo);
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
      const newUserId = voter?.id || `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newVoter: Voter = {
        id: newUserId,
        name: newName,
      };

      setVoter(newVoter);

      // ローカルストレージに保存
      const storageKey = `voterInfo_${pollId}`;
      localStorage.setItem(storageKey, JSON.stringify(newVoter));

      // データベースの投票者名も更新（投票済みの場合のみ、userIdが既に存在する場合）
      if (voter?.id) {
        try {
          await fetch(`/api/polls/${pollId}/voter-name`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              voterId: voter.id,
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
    if (!voter) {
      setNameDialogOpen(true);
      return false;
    }
    return true;
  };

  return {
    voter,
    setVoter,
    nameDialogOpen,
    tempName,
    setTempName,
    setNameDialogOpen,
    handleNameSubmit,
    checkAndOpenDialog,
  };
}

