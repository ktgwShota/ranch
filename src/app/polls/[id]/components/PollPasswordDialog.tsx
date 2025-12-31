import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/primitives/alert';
import { Button } from '@/components/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/dialog';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';

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
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-w-md rounded-[2px] p-6">
        <DialogHeader>
          <DialogTitle className="font-bold text-slate-900 text-xl">
            管理者権限パスワードを入力
          </DialogTitle>
          <DialogDescription className="pt-2 text-slate-500">
            投票を終了するには管理者権限パスワードが必要です。
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert
            variant="destructive"
            className="mb-4 rounded-[2px] border-red-100 bg-red-50 px-4 py-3 text-red-600"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2 font-medium text-[13px]">{error}</AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <Label htmlFor="password" className="mb-3 block font-bold text-[#1a1a1c] text-base">
            パスワード
          </Label>
          <Input
            id="password"
            autoFocus
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setError(null);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' && !loading) {
                handleSubmit();
              }
            }}
            disabled={loading}
            className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-white px-[14px] py-[16.5px] text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
          />
          {error && <p className="mx-[14px] mt-1 text-red-600 text-xs">{error}</p>}
        </div>

        <DialogFooter className="flex flex-row justify-end gap-3 pt-4">
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outline"
            className="rounded-[2px] border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="relative rounded-[2px] bg-[#1976d2] text-white hover:bg-[#1565c0]"
          >
            <span className={loading ? 'invisible opacity-0' : ''}>
              {loading ? '確認中...' : '確認'}
            </span>
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="h-5 w-5 animate-spin text-current" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
