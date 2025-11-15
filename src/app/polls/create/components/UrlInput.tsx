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
                m: '0 !important',
                ml: '0 !important',
                maxHeight: 'none !important',
                height: 'auto !important',
                px: '10px !important',
                py: '4px !important',
                borderRadius: '12px !important',
                backgroundColor:
                  getServiceLabel(value) === '食べログ'
                    ? '#ff6b6b !important'
                    : getServiceLabel(value) === 'ぐるなび'
                      ? '#4ecdc4 !important'
                      : '#9e9e9e !important',
                color: 'white !important',
                fontSize: '0.7rem !important',
                fontWeight: '600 !important',
                letterSpacing: '0.5px !important',
                lineHeight: '1 !important',
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
        },
        backgroundColor: '#fafafa',
      }}
    />
  );
}
