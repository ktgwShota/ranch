import { InputAdornment, TextField } from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';
import { getServiceLabel } from '../../../../utils/url';

export function UrlInput({
  value,
  onChange,
  error,
  register,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  register: UseFormRegisterReturn;
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
      placeholder="https://tabelog.com/tokyo/..."
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
      }}
    />
  );
}
