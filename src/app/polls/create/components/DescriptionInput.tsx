import { Box, TextField, Typography } from '@mui/material';

export function DescriptionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Box sx={{ position: 'relative', mt: 2 }}>
      <Box>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.85rem',
            color: 'text.secondary',
            mb: 1,
            fontWeight: 600,
          }}
        >
          備考
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          multiline
          rows={2}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 0.5,
              backgroundColor: '#fafafa',
            },
          }}
        />
      </Box>
    </Box>
  );
}
