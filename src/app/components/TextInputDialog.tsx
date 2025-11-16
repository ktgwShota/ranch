import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface TextInputDialogProps {
  open: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onClose?: () => void;
  title?: string;
  label?: string;
  submitLabel?: string;
  validate?: (value: string) => boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export function TextInputDialog({
  open,
  value,
  onValueChange,
  onSubmit,
  onClose,
  title = '入力してください',
  label = '入力',
  submitLabel = '決定',
  validate = (val) => !!val.trim(),
  maxWidth = 'sm',
  fullWidth = true,
}: TextInputDialogProps) {
  const isValid = validate(value);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && isValid) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={maxWidth} fullWidth={fullWidth}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={label}
          fullWidth
          variant="outlined"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit} variant="contained" disabled={!isValid}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

