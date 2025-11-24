import { Box, InputAdornment, TextField } from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

export function DescriptionInput({
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
    <Box sx={{ mb: 0 }}>
      <TextField
        fullWidth
        variant="outlined"
        label="備考"
        placeholder="会社から徒歩10分 / 個室あり / 駐車場なし"
        {...register}
        value={value}
        onChange={(e) => {
          register.onChange(e);
          const newValue = e.target.value;
          if (newValue.length <= 50) {
            onChange(newValue);
          }
        }}
        error={!!error}
        helperText={error}
        inputProps={{
          maxLength: 50,
        }}
        InputLabelProps={{
          shrink: true,
          sx: {
            fontSize: '1rem',
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    pr: 1,
                  }}
                >
                  {value.length}/50
                </Box>
              </InputAdornment>
            ),
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
