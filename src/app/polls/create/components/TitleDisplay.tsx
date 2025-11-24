import { Box, TextField, Typography } from '@mui/material';

export function TitleDisplay({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: '0.875rem',
            mb: 1.5,
          }}
        >
          店名 <span style={{ color: '#f44336' }}>*</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="レストラン A"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 0.5,
              backgroundColor: '#fafafa',
              fontSize: '0.875rem',
            },
            '& .MuiInputBase-input::placeholder': {
              fontSize: '0.875rem',
            },
          }}
        />
      </Box>
    </Box>
  );
}

