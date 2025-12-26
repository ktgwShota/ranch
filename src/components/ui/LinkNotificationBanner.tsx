import Link from 'next/link';
import { Box, Button, Paper } from '@mui/material';
import { Campaign as CampaignIcon } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface LinkNotificationBannerProps {
  /**
   * メインのメッセージ（太字で表示）
   */
  title: ReactNode;
  /**
   * サブメッセージ（補足説明）
   */
  description: ReactNode;
  /**
   * ボタンのラベル
   */
  buttonText: string;
  /**
   * リンク先のURL
   */
  href: string;
  /**
   * カラーバリエーション（デフォルトは orange）
   */
  color?: 'orange' | 'blue';
}

export function LinkNotificationBanner({
  title,
  description,
  buttonText,
  href,
  color = 'orange',
}: LinkNotificationBannerProps) {
  const isOrange = color === 'orange';

  // カラー定義
  const styles = isOrange
    ? {
      bgcolor: '#fff7ed', // orange-50 like
      border: '1px solid #ffedd5', // orange-100 like
      iconColor: '#f97316', // orange-500 like
      buttonBg: '#ea580c', // orange-600 like
      buttonHover: '#c2410c', // orange-700 like
      textColor: '#9a3412', // orange-900 like
    }
    : {
      bgcolor: '#eff6ff', // blue-50
      border: '1px solid #dbeafe', // blue-100
      iconColor: '#3b82f6', // blue-500
      buttonBg: '#2563eb', // blue-600
      buttonHover: '#1d4ed8', // blue-700
      textColor: '#1e3a8a', // blue-900
    };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: 1,
        bgcolor: styles.bgcolor,
        border: styles.border,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2.5, sm: 3 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        <CampaignIcon
          sx={{
            color: styles.iconColor,
            fontSize: '26px',
            flexShrink: 0,
          }}
        />
        <Box>
          <Box
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              color: styles.textColor,
              mb: 1,
              lineHeight: 1.5,
            }}
          >
            {title}
          </Box>
          <Box
            sx={{
              fontSize: '0.875rem',
              color: styles.textColor,
              opacity: 0.9,
              lineHeight: 1.5,
            }}
          >
            {description}
          </Box>
        </Box>
      </Box>

      <Button
        component={Link}
        href={href}
        variant="contained"
        sx={{
          bgcolor: styles.buttonBg,
          color: 'white',
          fontWeight: 700,
          px: 3,
          py: 1,
          borderRadius: 99, // 丸いボタン
          whiteSpace: 'nowrap',
          boxShadow: 'none',
          flexShrink: 0,
          alignSelf: { xs: 'stretch', sm: 'center' },
          '&:hover': {
            bgcolor: styles.buttonHover,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        {buttonText}
      </Button>
    </Paper>
  );
}
