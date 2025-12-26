'use client';

import { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { type TimeValue, HOURS, MINUTES } from '../types';

const ITEM_HEIGHT = 40;

interface TimeWheelPickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
}

export default function TimeWheelPicker({ value, onChange }: TimeWheelPickerProps) {
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToSelected = (
      ref: React.RefObject<HTMLDivElement | null>,
      items: string[],
      selectedValue: string
    ) => {
      if (ref.current) {
        const index = items.indexOf(selectedValue);
        if (index >= 0) {
          ref.current.scrollTop = index * ITEM_HEIGHT;
        }
      }
    };

    scrollToSelected(hourRef, HOURS, value.hour);
    scrollToSelected(minuteRef, MINUTES, value.minute);
  }, [value]);

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    items: string[],
    key: 'hour' | 'minute'
  ) => {
    if (ref.current) {
      const scrollTop = ref.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      const newValue = items[clampedIndex];
      if (newValue && newValue !== value[key]) {
        onChange({ ...value, [key]: newValue });
      }
    }
  };

  const renderColumn = (
    ref: React.RefObject<HTMLDivElement | null>,
    items: string[],
    selectedValue: string,
    key: 'hour' | 'minute'
  ) => (
    <Box
      ref={ref}
      onScroll={() => handleScroll(ref, items, key)}
      sx={{
        height: ITEM_HEIGHT * 5,
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        position: 'relative',
        px: 1,
      }}
    >
      <Box sx={{ height: ITEM_HEIGHT * 2 }} />
      {items.map((item) => (
        <Box
          key={item}
          onClick={() => {
            onChange({ ...value, [key]: item });
            if (ref.current) {
              const index = items.indexOf(item);
              ref.current.scrollTo({
                top: index * ITEM_HEIGHT,
                behavior: 'smooth',
              });
            }
          }}
          sx={{
            height: ITEM_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            scrollSnapAlign: 'center',
            cursor: 'pointer',
            fontSize: '1.25rem',
            fontWeight: selectedValue === item ? 600 : 400,
            color: selectedValue === item ? 'primary.main' : 'text.secondary',
            transition: 'all 0.2s',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {item}
        </Box>
      ))}
      <Box sx={{ height: ITEM_HEIGHT * 2 }} />
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: 16,
          right: 16,
          transform: 'translateY(-50%)',
          height: ITEM_HEIGHT,
          backgroundColor: 'action.hover',
          borderRadius: 1,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {renderColumn(hourRef, HOURS, value.hour, 'hour')}
      </Box>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, px: 0.5, zIndex: 1 }}>:</Typography>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {renderColumn(minuteRef, MINUTES, value.minute, 'minute')}
      </Box>
    </Box>
  );
}

