import { Box, TextField } from '@mui/material';

export function TitleDisplay({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        label="店名"
        required
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="レストラン A"
        InputLabelProps={{
          shrink: true,
          sx: {
            fontSize: '1rem',
            '& .MuiFormLabel-asterisk': {
              color: '#f44336',
            },
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 0.5,
            fontSize: '0.875rem',
          },
          '& .MuiInputBase-input::placeholder': {
            fontSize: '0.875rem',
          },
        }}
      />
    </Box>
  );
}

