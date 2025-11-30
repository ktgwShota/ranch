import { useState, useEffect } from 'react';

export interface Voter {
  voterId: string;
  voterName: string;
}

export function useVoter(pollId: string) {
  const [voter, setVoter] = useState<Voter | null>(null);
  const [voterNameDialogOpen, setVoterNameDialogOpen] = useState(false);
  const [tempName, setTempName] = useState<string>('');

  useEffect(() => {
    const storageKey = `voterInfo_${pollId}`;
    const storedInfo = localStorage.getItem(storageKey);
    if (storedInfo) {
      try {
        const voterInfo: Voter = JSON.parse(storedInfo);
        setVoter(voterInfo);
      } catch (e) {
        localStorage.removeItem(storageKey);
      }
    }
  }, [pollId]);

  const handleNameSubmit = async () => {
    if (tempName.trim()) {
      const newName = tempName.trim();
      // userIdがない場合は新しく生成
      const newUserId = voter?.voterId || `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newVoter: Voter = {
        voterId: newUserId,
        voterName: newName,
      };

      setVoter(newVoter);

      // ローカルストレージに保存
      const storageKey = `voterInfo_${pollId}`;
      localStorage.setItem(storageKey, JSON.stringify(newVoter));

      // データベースの投票者名も更新（投票済みの場合のみ、userIdが既に存在する場合）
      if (voter?.voterId) {
        try {
          await fetch(`/api/polls/${pollId}/voter-name`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              voterId: voter.voterId,
              voterName: newName,
            }),
          });
        } catch (error) {
          console.error('Error updating voter name:', error);
        }
      }

      setVoterNameDialogOpen(false);
    }
  };

  const checkAndOpenDialog = () => {
    if (!voter) {
      setVoterNameDialogOpen(true);
      return false;
    }
    return true;
  };

  return {
    voter,
    setVoter,
    nameDialogOpen: voterNameDialogOpen,
    tempName,
    setTempName,
    setNameDialogOpen: setVoterNameDialogOpen,
    handleNameSubmit,
    checkAndOpenDialog,
  };
}

