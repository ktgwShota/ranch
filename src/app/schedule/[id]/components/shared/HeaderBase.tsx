import { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface HeaderBaseProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function HeaderBase({ title, children, actions }: HeaderBaseProps) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 3, mb: 2, borderRadius: 0.5, border: '1px solid #ddd', backgroundColor: 'white' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {actions}
        </Box>
      </Box>
      {children}
    </Paper>
  );
}

