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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.85rem',
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          備考
        </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              color: 'text.secondary',
            }}
          >
            {value.length}/50
          </Typography>
        </Box>
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
