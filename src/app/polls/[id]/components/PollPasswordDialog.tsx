import { Dialog, DialogTitle, DialogContent, Typography, Alert, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";

interface PollPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
}

export function PollPasswordDialog({ open, onClose, onConfirm }: PollPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('パスワードを入力してください');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onConfirm(password);
      setPassword('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'パスワードが正しくありません');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>管理者権限パスワードを入力</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          投票を終了するには管理者権限パスワードが必要です。
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          fullWidth
          type="password"
          label="パスワード"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSubmit();
            }
          }}
          disabled={loading}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          キャンセル
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? '確認中...' : '確認'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
