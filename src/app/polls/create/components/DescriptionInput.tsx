import { Box, TextField, Typography } from '@mui/material';

export function DescriptionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Box>
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
          helperText={`${value.length}/50`}
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
