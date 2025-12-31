'use client';

import { Button } from '@/components/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/dialog';

interface ActionsHook {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  handleDeleteConfirm: () => void;
}

interface DialogsProps {
  actionsHook: ActionsHook;
}

export function Dialogs({ actionsHook }: DialogsProps) {
  return (
    <Dialog open={actionsHook.deleteDialogOpen} onOpenChange={actionsHook.setDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>日程調整を削除</DialogTitle>
          <DialogDescription>
            この日程調整を削除しますか？この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={() => actionsHook.setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={actionsHook.handleDeleteConfirm} variant="destructive">
            削除する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
