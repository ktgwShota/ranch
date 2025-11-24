'use client';

import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface DescriptionTextProps {
  description: string;
}

export function DescriptionText({ description }: DescriptionTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 説明が2行を超えるかどうかを判定（簡易的な方法）
  const descriptionLines = description ? description.split('\n').length : 0;
  const shouldShowExpandButton = description && (description.length > 100 || descriptionLines > 2);

  return (
    <Box>
      <Typography
        variant="body1"
        sx={{
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: 1.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? 'none' : 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {description}
      </Typography>
      {shouldShowExpandButton && (
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="small"
          sx={{
            mt: 0.5,
            p: 0,
            minWidth: 'auto',
            fontSize: '12px',
            color: '#6b7280',
            textTransform: 'none',
            '&:hover': {
              background: 'transparent',
              color: '#1976d2',
            },
          }}
        >
          {isExpanded ? '折りたたむ' : 'もっと見る'}
        </Button>
      )}
    </Box>
  );
}

