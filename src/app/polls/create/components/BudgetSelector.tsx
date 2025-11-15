import { Box, Chip, Typography } from '@mui/material';
import { PollOption, CommonBudget } from '../types';
import { CustomBudgetInput } from './CustomBudgetInput';

const BUDGET_PRESETS: CommonBudget[] = [
  { label: '~ 2,000円', min: '1000', max: '2000' },
  { label: '2,000 ~ 3,000円', min: '2000', max: '3000' },
  { label: '3,000 ~ 4,000円', min: '3000', max: '4000' },
  { label: '4,000 ~ 5,000円', min: '4000', max: '5000' },
  { label: '5,000円 ~', min: '5000', max: '' },
] as const;

export function BudgetSelector({
  option,
  onOptionChange,
}: {
  option: PollOption;
  onOptionChange: (updates: Partial<PollOption>) => void;
}) {
  const showCustomBudget = option.showCustomBudget || false;
  return (
    <Box sx={{ mb: 2.5 }}>
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
          予算
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {BUDGET_PRESETS.map((budget) => (
            <Chip
              key={budget.label}
              label={budget.label}
              size="small"
              onClick={() =>
                onOptionChange({
                  budgetMin: budget.min,
                  budgetMax: budget.max,
                  budget: '',
                  showCustomBudget: false,
                })
              }
              sx={{
                height: 28,
                fontSize: '0.8rem',
                cursor: 'pointer',
                backgroundColor:
                  option.budgetMin === budget.min &&
                    option.budgetMax === budget.max &&
                    !showCustomBudget
                    ? '#1976d2'
                    : '#f5f5f5',
                color:
                  option.budgetMin === budget.min &&
                    option.budgetMax === budget.max &&
                    !showCustomBudget
                    ? 'white'
                    : 'text.primary',
                '&:hover': {
                  backgroundColor:
                    option.budgetMin === budget.min &&
                      option.budgetMax === budget.max &&
                      !showCustomBudget
                      ? '#1565c0'
                      : '#e0e0e0',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            />
          ))}
          <Chip
            label="カスタム入力"
            size="small"
            onClick={() =>
              onOptionChange({
                showCustomBudget: !showCustomBudget,
                budgetMin: !showCustomBudget ? '' : option.budgetMin,
                budgetMax: !showCustomBudget ? '' : option.budgetMax,
                budget: '',
              })
            }
            sx={{
              height: 28,
              fontSize: '0.8rem',
              cursor: 'pointer',
              backgroundColor: showCustomBudget ? '#1976d2' : '#f5f5f5',
              color: showCustomBudget ? 'white' : 'text.primary',
              '&:hover': {
                backgroundColor: showCustomBudget ? '#1565c0' : '#e0e0e0',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          />
        </Box>
      </Box>

      {showCustomBudget && (
        <CustomBudgetInput
          budgetMin={option.budgetMin || ''}
          budgetMax={option.budgetMax || ''}
          onBudgetMinChange={(value) => onOptionChange({ budgetMin: value })}
          onBudgetMaxChange={(value) => onOptionChange({ budgetMax: value })}
        />
      )}
    </Box>
  );
}
