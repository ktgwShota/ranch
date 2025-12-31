import { Eye, FileEdit, MoreVertical, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { closePollAction, deletePollAction } from '@/app/polls/actions';
import { Button } from '@/components/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';
import { Separator } from '@/components/primitives/separator';
import { Dialog as ConfirmationDialog } from '@/components/ui/Dialog';
import type { ParsedPoll as Poll } from '@/db/core/types';
import { useOrganizer } from '../hooks/useOrganizer';
import { PollPasswordDialog } from './PollPasswordDialog';

interface PollMenuProps {
  poll: Poll;
  onChangeVoterName: () => void;
}

export function PollMenu({ poll, onChangeVoterName }: PollMenuProps) {
  const router = useRouter();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [onPasswordSuccess, setOnPasswordSuccess] = useState<(() => void) | null>(null);

  const {
    passwordDialogOpen,
    errorDialogOpen,
    setPasswordDialogOpen,
    setErrorDialogOpen,
    checkOrganizerAccess,
    verifyPassword,
  } = useOrganizer(poll.id, poll.password);

  const requireOrganizerAccess = (action: () => void) => {
    checkOrganizerAccess(action, () => {
      setOnPasswordSuccess(() => action);
      setPasswordDialogOpen(true);
    });
  };

  const handleEndPollClick = () => {
    requireOrganizerAccess(() => setConfirmDialogOpen(true));
  };

  const handlePasswordConfirm = async (password: string) => {
    await verifyPassword(password);
    setPasswordDialogOpen(false);
    if (onPasswordSuccess) {
      onPasswordSuccess();
      setOnPasswordSuccess(null);
    }
  };

  const handleConfirmEndPoll = async () => {
    setConfirmDialogOpen(false);

    try {
      const result = await closePollAction(poll.id);
      if (!result.success) {
        throw new Error(result.error);
      }
      router.refresh();
    } catch (_e) {
      alert('投票の公開に失敗しました。もう一度お試しください。');
    }
  };

  const handleChangeVoterName = () => {
    onChangeVoterName();
  };

  const handleDeleteClick = () => {
    requireOrganizerAccess(() => setDeleteDialogOpen(true));
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await deletePollAction(poll.id);
      if (!result.success) {
        throw new Error(result.error);
      }
      window.location.href = '/';
    } catch (error) {
      alert(error instanceof Error ? error.message : '投票の削除に失敗しました');
    }
  };

  const canEndPoll = !poll.isClosed;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-full p-0 transition-colors hover:bg-slate-100"
          >
            <MoreVertical size={20} className="text-slate-500" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[200px] rounded-[2px] border-slate-200 p-1.5 shadow-lg"
        >
          <DropdownMenuItem
            onClick={handleChangeVoterName}
            className="flex cursor-pointer items-center gap-2.5 rounded-[2px] px-3 py-2.5 transition-colors hover:bg-slate-50"
          >
            <FileEdit size={16} className="text-blue-500" />
            <span className="font-medium text-[14px] text-slate-700">投票者名を設定</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleEndPollClick}
            disabled={!canEndPoll}
            className={`flex cursor-pointer items-center gap-2.5 rounded-[2px] px-3 py-2.5 transition-colors ${canEndPoll ? 'text-slate-700 hover:bg-blue-50' : 'cursor-not-allowed opacity-50 grayscale'}
            `}
          >
            <Eye size={16} className={canEndPoll ? 'text-blue-500' : 'text-slate-400'} />
            <span
              className={`font-medium text-[14px] ${canEndPoll ? 'text-blue-700' : 'text-slate-400'}`}
            >
              投票結果を公開
            </span>
          </DropdownMenuItem>

          <Separator className="my-1.5 bg-slate-100" />

          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="group flex cursor-pointer items-center gap-2.5 rounded-[2px] px-3 py-2.5 transition-colors hover:bg-red-50"
          >
            <Trash2 size={16} className="text-red-500 group-hover:text-red-600" />
            <span className="font-medium text-[14px] text-red-600 group-hover:text-red-700">
              ページを削除
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PollPasswordDialog
        open={passwordDialogOpen}
        onClose={() => {
          setPasswordDialogOpen(false);
          setOnPasswordSuccess(null);
        }}
        onConfirm={handlePasswordConfirm}
      />

      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        title="投票を終了しますか？"
        description="投票を終了すると結果が全員に表示され、以降は新しい投票を受け付けなくなります。この操作は取り消せません。"
        confirmLabel="投票を終了"
        onConfirm={handleConfirmEndPoll}
        confirmButtonColor="error"
        confirmButtonProps={{
          disabled: false,
        }}
        cancelLabel="キャンセル"
      />

      <ConfirmationDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="操作を実行できません"
        description="この投票はパスワードが設定されていないため、主催者のみが操作を実行できます。主催者のブラウザからアクセスしてください。"
        confirmLabel="閉じる"
        onConfirm={() => setErrorDialogOpen(false)}
        confirmButtonColor="primary"
        cancelLabel={undefined}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="投票を削除しますか？"
        description="この操作は取り消せません。本当に削除してもよろしいですか？"
        confirmLabel="削除する"
        cancelLabel="キャンセル"
        onConfirm={handleConfirmDelete}
        confirmButtonColor="error"
        confirmButtonProps={{ disabled: false }}
      />
    </>
  );
}
