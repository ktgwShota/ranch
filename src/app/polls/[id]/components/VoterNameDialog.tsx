import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface VoterNameDialogProps {
  open: boolean;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
}

export function VoterNameDialog({ open, name, onNameChange, onSubmit }: VoterNameDialogProps) {
  return (
    <Dialog open={open} onClose={() => {}} maxWidth="sm" fullWidth>
      <DialogTitle>投票者名を入力してください</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="お名前"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSubmit();
            }
          }}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit} variant="contained" disabled={!name.trim()}>
          決定
        </Button>
      </DialogActions>
    </Dialog>
  );
}

