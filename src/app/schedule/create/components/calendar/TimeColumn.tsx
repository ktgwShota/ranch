'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface TimeColumnProps {
  items: readonly string[];
  selectedValue: string;
  onSelect: (val: string) => void;
}

export const TimeColumn = ({
  items,
  selectedValue,
  onSelect,
}: TimeColumnProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const selector = `[data-value="${selectedValue}"]`;
    const element = container.querySelector(selector);

    if (!element) return;

    const containerRect = container.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;

    if (isVisible) return;

    element.scrollIntoView({ block: 'center', behavior: 'auto' });
  }, [selectedValue]);

  return (
    <Box
      ref={containerRef}
      sx={{
        overflowY: 'auto',
        width: '100%',
        height: '100%',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        scrollSnapType: 'y mandatory',
        display: 'grid',
        gap: 1,
        gridAutoRows: {
          xs: 'calc((100% - 32px) / 5)',
          sm: 'calc((100% - 40px) / 6)',
          md: 'calc((100% - 48px) / 7)'
        },
      }}
    >
      {items.map((item) => {
        const isSelected = item === selectedValue;
        return (
          <Box
            key={item}
            data-value={item}
            onClick={() => onSelect(item)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              scrollSnapAlign: 'center',
              transition: 'all 0.2s',
              backgroundColor: isSelected ? 'primary.main' : 'transparent',
              color: isSelected ? 'primary.contrastText' : 'text.primary',
              borderRadius: '1px',
              mx: 0.5,
              '&:hover': {
                backgroundColor: isSelected ? 'primary.dark' : 'rgba(0,0,0,0.04)'
              }
            }}
          >
            {item}
          </Box>
        );
      })}
    </Box>
  );
};
