import { InputAdornment, TextField } from '@mui/material';
import { getServiceLabel } from '../../../../utils/url';

export function UrlInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <TextField
      fullWidth
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="https://tabelog.com/tokyo/..."
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error || ''}
      FormHelperTextProps={{
        sx: { fontSize: '0.875rem', fontWeight: 500 },
      }}
      slotProps={{
        input: {
          endAdornment: getServiceLabel(value) ? (
            <InputAdornment
              position="end"
              sx={{
                m: '6px',
                px: '8px',
                py: '4px',
                borderRadius: '12px',
                backgroundColor:
                  getServiceLabel(value) === '食べログ'
                    ? '#ff6b6b'
                    : getServiceLabel(value) === 'ぐるなび'
                      ? '#4ecdc4'
                      : '#9e9e9e',
                '& p': {
                  fontSize: '0.75rem',
                  color: 'white',
                },
              }}
            >
              {getServiceLabel(value)}
            </InputAdornment>
          ) : null,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingRight: 0,
          borderRadius: 0.5,
          fontSize: '0.875rem',
        },
        '& .MuiInputBase-input::placeholder': {
          fontSize: '0.875rem',
        },
        backgroundColor: '#fafafa',
      }}
    />
  );
}
