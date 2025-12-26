'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface ActionsHook {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  handleDeleteConfirm: () => void;
}

interface ResultPageDialogsProps {
  actionsHook: ActionsHook;
}

export function ResultPageDialogs({ actionsHook }: ResultPageDialogsProps) {
  return (
    <Dialog open={actionsHook.deleteDialogOpen} onClose={() => actionsHook.setDeleteDialogOpen(false)}>
      <DialogTitle>日程調整を削除</DialogTitle>
      <DialogContent>
        <DialogContentText>
          この日程調整を削除しますか？この操作は取り消せません。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => actionsHook.setDeleteDialogOpen(false)}>キャンセル</Button>
        <Button onClick={actionsHook.handleDeleteConfirm} color="error" variant="contained">
          削除する
        </Button>
      </DialogActions>
    </Dialog>
  );
}
