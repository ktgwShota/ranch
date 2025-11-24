import { Box, TextField } from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

export function TitleDisplay({
  value,
  onChange,
  register,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  register: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        label="店名"
        required
        {...register}
        value={value || ''}
        onChange={(e) => {
          register.onChange(e);
          onChange(e.target.value);
        }}
        placeholder="レストラン A"
        error={!!error}
        helperText={error}
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

