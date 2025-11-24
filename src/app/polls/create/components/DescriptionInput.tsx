import { Box, TextField } from '@mui/material';

export function DescriptionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Box sx={{ mb: 0 }}>
      <TextField
        fullWidth
        variant="outlined"
        label="備考"
        placeholder="会社から徒歩10分 / 個室あり / 駐車場なし"
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue.length <= 50) {
            onChange(newValue);
          }
        }}
        inputProps={{
          maxLength: 50,
        }}
        InputLabelProps={{
          shrink: true,
          sx: {
            fontSize: '1rem',
          },
        }}
        FormHelperTextProps={{
          sx: {
            textAlign: 'right',
            fontSize: '0.75rem',
          },
        }}
        helperText={`${value.length}/50`}
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
