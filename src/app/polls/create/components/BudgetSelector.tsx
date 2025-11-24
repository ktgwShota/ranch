import { Box, Chip } from '@mui/material';
import { FieldErrors, UseFormRegisterReturn } from 'react-hook-form';
import { PollOption } from '../types';
import { CustomBudgetInput } from './CustomBudgetInput';

export function BudgetSelector({
  option,
  onOptionChange,
  registerMin,
  registerMax,
  errors,
}: {
  option: PollOption;
  onOptionChange: (updates: Partial<PollOption>) => void;
  registerMin: UseFormRegisterReturn;
  registerMax: UseFormRegisterReturn;
  errors?: FieldErrors<{ budgetMin?: string; budgetMax?: string }>;
}) {
  const budgetOptions = option.budgetOptions || [];

  return (
    <Box sx={{ mb: 2 }}>
      <Box>
        {/* ぐるなびの予算オプションがある場合は表示 */}
        {budgetOptions.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 3 }}>
            {budgetOptions.map((budget) => (
              <Chip
                key={budget.label}
                label={budget.label}
                size="small"
                onClick={() =>
                  onOptionChange({
                    budgetMin: budget.min,
                    budgetMax: budget.max,
                    budget: '',
                  })
                }
                sx={{
                  height: 28,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  backgroundColor:
                    option.budgetMin === budget.min &&
                      option.budgetMax === budget.max
                      ? '#10b981'
                      : '#f5f5f5',
                  color:
                    option.budgetMin === budget.min &&
                      option.budgetMax === budget.max
                      ? 'white'
                      : 'text.primary',
                  '&:hover': {
                    backgroundColor:
                      option.budgetMin === budget.min &&
                        option.budgetMax === budget.max
                        ? '#059669'
                        : '#e0e0e0',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      <CustomBudgetInput
        budgetMin={option.budgetMin || ''}
        budgetMax={option.budgetMax || ''}
        onBudgetMinChange={(value) => onOptionChange({ budgetMin: value })}
        onBudgetMaxChange={(value) => onOptionChange({ budgetMax: value })}
        registerMin={registerMin}
        registerMax={registerMax}
      />
    </Box>
  );
}
