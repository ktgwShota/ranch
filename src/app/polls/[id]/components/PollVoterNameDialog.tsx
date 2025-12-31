'use client';

import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/primitives/alert';
import { Button } from '@/components/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/dialog';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';

interface PollVoterNameDialogProps {
  open: boolean;
  onClose: () => void;
  initialVoterName?: string;
  pollId?: string;
  onSubmit: (name: string, userId: string) => Promise<void>;
}

export function PollVoterNameDialog({
  open,
  onClose,
  initialVoterName = '',
  onSubmit,
}: PollVoterNameDialogProps) {
  const [localName, setLocalName] = useState(initialVoterName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLocalName(initialVoterName || '');
      setError(null);
    }
  }, [initialVoterName, open]);

  const handleSave = async () => {
    const trimmedName = localName.trim();
    if (!trimmedName) {
      setError('名前を入力してください');
      return;
    }
    if (trimmedName.length > 20) {
      setError('名前は20文字以内で入力してください');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      // Generate a simple unique ID for the user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await onSubmit(trimmedName, userId);
      onClose();
    } catch (e) {
      console.error(e);
      setError('エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md gap-6 rounded-[2px] p-6">
        <DialogHeader>
          <DialogTitle className="font-bold text-slate-900 text-xl">
            名前を入力してください
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert
              variant="destructive"
              className="rounded-[2px] border-red-100 bg-red-50 px-4 py-3 text-red-600"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2 font-medium text-[13px]">{error}</AlertDescription>
            </Alert>
          )}
          <Label htmlFor="voterName" className="mb-3 block font-bold text-[#1a1a1c] text-base">
            名前
          </Label>
          <Input
            id="voterName"
            autoFocus
            type="text"
            placeholder="田中 太郎"
            value={localName}
            onChange={(e) => {
              setLocalName(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
              }
            }}
            className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-white px-[14px] py-[16.5px] text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
          />
          {error && <p className="mx-[14px] mt-1 text-red-600 text-xs">{error}</p>}
        </div>

        <DialogFooter className="flex flex-row justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-[2px] border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="relative rounded-[2px] bg-[#1976d2] text-white hover:bg-[#1565c0]"
          >
            <span className={isSubmitting ? 'invisible opacity-0' : ''}>
              {isSubmitting ? '保存中...' : '投票へ進む'}
            </span>
            {isSubmitting && (
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
