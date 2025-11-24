import { Box, TextField, Typography } from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';
import { formatNumber, parseNumber } from '../../../../utils/budget';

export function CustomBudgetInput({
  budgetMin,
  budgetMax,
  onBudgetMinChange,
  onBudgetMaxChange,
  registerMin,
  registerMax,
}: {
  budgetMin: string;
  budgetMax: string;
  onBudgetMinChange: (value: string) => void;
  onBudgetMaxChange: (value: string) => void;
  registerMin: UseFormRegisterReturn;
  registerMax: UseFormRegisterReturn;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <TextField
          variant="outlined"
          label="予算下限"
          placeholder="8,000"
          type="text"
          inputMode="numeric"
          {...registerMin}
          value={budgetMin ? formatNumber(budgetMin) : ''}
          onChange={(e) => {
            registerMin.onChange(e);
            const numericValue = parseNumber(e.target.value);
            onBudgetMinChange(numericValue);
          }}
          onBlur={(e) => {
            registerMin.onBlur(e);
            const numericValue = parseNumber(e.target.value);
            if (numericValue) {
              onBudgetMinChange(numericValue);
            }
          }}
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) &&
              !(e.ctrlKey || e.metaKey)
            ) {
              e.preventDefault();
            }
          }}
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: '1rem',
              backgroundColor: 'white',
              px: 0.5,
            },
          }}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0.5,
              fontSize: '0.875rem',
            },
            '& .MuiInputBase-input::placeholder': {
              fontSize: '0.875rem',
            },
          }}
        />
        <Typography variant="body1" sx={{ color: 'text.secondary', px: 0.5, fontSize: '0.875rem', alignSelf: 'center' }}>
          〜
        </Typography>
        <TextField
          variant="outlined"
          label="予算上限"
          placeholder="10,000"
          type="text"
          inputMode="numeric"
          {...registerMax}
          value={budgetMax ? formatNumber(budgetMax) : ''}
          onChange={(e) => {
            registerMax.onChange(e);
            const numericValue = parseNumber(e.target.value);
            onBudgetMaxChange(numericValue);
          }}
          onBlur={(e) => {
            registerMax.onBlur(e);
            const numericValue = parseNumber(e.target.value);
            if (numericValue) {
              onBudgetMaxChange(numericValue);
            }
          }}
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) &&
              !(e.ctrlKey || e.metaKey)
            ) {
              e.preventDefault();
            }
          }}
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: '1rem',
              backgroundColor: 'white',
              px: 0.5,
            },
          }}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0.5,
              fontSize: '0.875rem',
            },
            '& .MuiInputBase-input::placeholder': {
              fontSize: '0.875rem',
            },
          }}
        />
        <Typography variant="body1" sx={{ color: 'text.secondary', ml: 0.5, fontSize: '0.875rem', alignSelf: 'center' }}>
          円
        </Typography>
      </Box>
    </Box>
  );
}
