import { Box, TextField, Typography } from '@mui/material';
import { formatNumber, parseNumber } from '../../../../utils/budget';

export function CustomBudgetInput({
  budgetMin,
  budgetMax,
  onBudgetMinChange,
  onBudgetMaxChange,
}: {
  budgetMin: string;
  budgetMax: string;
  onBudgetMinChange: (value: string) => void;
  onBudgetMaxChange: (value: string) => void;
}) {
  return (
    <Box sx={{ mt: 2.5 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="8,000"
          type="text"
          inputMode="numeric"
          value={budgetMin ? formatNumber(budgetMin) : ''}
          onChange={(e) => {
            const numericValue = parseNumber(e.target.value);
            onBudgetMinChange(numericValue);
          }}
          onBlur={(e) => {
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
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0.5,
              backgroundColor: '#fafafa',
            },
          }}
        />
        <Typography variant="body2" sx={{ color: 'text.secondary', px: 0.5 }}>
          〜
        </Typography>
        <TextField
          size="small"
          placeholder="10,000"
          type="text"
          inputMode="numeric"
          value={budgetMax ? formatNumber(budgetMax) : ''}
          onChange={(e) => {
            const numericValue = parseNumber(e.target.value);
            onBudgetMaxChange(numericValue);
          }}
          onBlur={(e) => {
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
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0.5,
              backgroundColor: '#fafafa',
            },
          }}
        />
        <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
          円
        </Typography>
      </Box>
    </Box>
  );
}
