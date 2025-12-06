'use client';

import { ReactNode } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

interface AdvancedSettingsAccordionProps {
  children: ReactNode;
  title?: string;
}

export default function AdvancedSettingsAccordion({
  children,
  title = '詳細設定',
}: AdvancedSettingsAccordionProps) {
  return (
    <Accordion
      sx={{
        boxShadow: 'none',
        border: '1px solid #e5e7eb',
        borderRadius: 0.5,
        '&:before': {
          display: 'none',
        },
        mb: 3,
        '&.Mui-expanded': {
          mb: 3,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          py: 2.5,
          px: 3,
          minHeight: '56px',
          '&.Mui-expanded': {
            minHeight: '56px',
            borderBottom: '1px solid #e5e7eb',
          },
          '& .MuiAccordionSummary-content': {
            my: 0,
            margin: 0,
            alignItems: 'center',
            '&.Mui-expanded': {
              margin: 0,
            },
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            color: 'text.secondary',
            '&.Mui-expanded': {
              transform: 'rotate(180deg)',
            },
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '1rem',
            lineHeight: 1.5,
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3, pb: 3 }}>{children}</AccordionDetails>
    </Accordion>
  );
}

