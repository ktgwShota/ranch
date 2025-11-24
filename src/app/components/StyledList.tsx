'use client';

import { Box, Typography, SxProps, Theme } from '@mui/material';

interface StyledListProps {
  items: string[];
  sx?: SxProps<Theme>;
}

export default function StyledList({ items, sx }: StyledListProps) {
  return (
    <Box
      component="ul"
      sx={{
        m: 0,
        pl: 2.5,
        mb: 0,
        listStyleType: 'disc',
        '& li': {
          display: 'list-item',
          '&::marker': {
            color: 'text.secondary',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      }}
    >
      {items.map((item, index) => (
        <Typography
          key={index}
          component="li"
          variant="body1"
          color="text.secondary"
          sx={{
            mb: index === items.length - 1 ? 0 : 1.5,
            lineHeight: 1.8,
          }}
        >
          {item}
        </Typography>
      ))}
    </Box>
  );
}

