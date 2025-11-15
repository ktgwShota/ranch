import { Box, TextField, Typography } from '@mui/material';

export function TitleInput({
  title,
  onChange,
}: {
  title: string;
  onChange: (value: string) => void;
}) {
  return (
    <Box>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
      >
        タイトル <span style={{ color: '#f44336' } as React.CSSProperties}>*</span>
      </Typography>
      <TextField
        fullWidth
        placeholder="歓迎会のお店はどこがいい？"
        value={title}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 0.5,
            backgroundColor: '#fafafa',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
              borderWidth: 2,
            },
          },
        }}
      />
    </Box>
  );
}
