import { TextField } from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

export function UrlInput({
  value,
  onChange,
  error,
  register,
  placeholder = "https://example.com/...",
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
}) {
  return (
    <TextField
      fullWidth
      type="url"
      variant="outlined"
      label="URL"
      required
      {...register}
      value={value}
      onChange={(e) => {
        register.onChange(e);
        onChange(e.target.value);
      }}
      placeholder={placeholder}
      error={!!error}
      helperText={error || ''}
      InputLabelProps={{
        shrink: true,
        sx: {
          fontSize: '1rem',
          '& .MuiFormLabel-asterisk': {
            color: '#f44336',
          },
        },
      }}
      FormHelperTextProps={{
        sx: { fontSize: '0.875rem', fontWeight: 500 },
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
  );
}
