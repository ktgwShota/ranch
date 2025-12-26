'use client';

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';

interface TermsAgreementCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export default function TermsAgreementCheckbox({
  checked,
  onChange,
  error,
}: TermsAgreementCheckboxProps) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" my={4}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            color="primary"
            size="small"
            sx={{ p: 0 }}
          />
        }
        label={
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: 500, position: 'relative', top: '0.5px', fontSize: '13px' }}
          >
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                paddingLeft: 4,
              }}
            >
              利用規約
            </a>
            に同意する
          </Typography>
        }
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

