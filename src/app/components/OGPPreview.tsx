'use client';

import { Restaurant as RestaurantIcon } from '@mui/icons-material';
import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { validateUrl } from '../../utils/url';

interface OGPData {
  title: string;
  image: string | null;
  description?: string | null;
  budgetMin?: string;
  budgetMax?: string;
  budgetOptions?: Array<{ label: string; min: string; max: string }>;
  url?: string | null;
  type?: string | null;
  siteName?: string | null;
  locale?: string | null;
  twitterCard?: string | null;
  twitterSite?: string | null;
  keywords?: string | null;
  error?: string;
}

interface OGPPreviewProps {
  url: string;
  size?: 'small' | 'medium' | 'large';
  onDataLoaded?: (data: OGPData | null) => void;
}

export function OGPPreview({ url, size = 'small', onDataLoaded }: OGPPreviewProps) {
  const [ogpData, setOgpData] = useState<OGPData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const onDataLoadedRef = useRef(onDataLoaded);

  // onDataLoadedの最新の参照を保持
  useEffect(() => {
    onDataLoadedRef.current = onDataLoaded;
  }, [onDataLoaded]);

  const sizeConfig = {
    small: { imageSize: 60, padding: 2 },
    medium: { imageSize: 80, padding: 3 },
    large: { imageSize: 120, padding: 3 },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    // URLが空、またはバリデーションエラーがある場合は取得しない
    if (!url.trim() || validateUrl(url) !== null) {
      setOgpData(null);
      onDataLoadedRef.current?.(null);
      return;
    }

    // debounce処理
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/ogp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        const responseData = await response.json().catch(() => ({
          title: 'お店の情報を取得できませんでした',
          image: null,
          error: 'Failed to parse response',
        }));

        // エラー時でもデータを設定してカードを表示
        const data = responseData as OGPData;
        console.log('🔍 OGP Preview - Full data received:', JSON.stringify(data, null, 2));
        setOgpData(data);
        onDataLoadedRef.current?.(data);
      } catch (error) {
        console.error('Error fetching OGP:', error);
        // エラー時でもカードを表示
        const errorData: OGPData = {
          title: 'お店の情報を取得できませんでした',
          image: null,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        setOgpData(errorData);
        onDataLoadedRef.current?.(errorData);
      } finally {
        setIsLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [url]);

  // ローディング中
  if (isLoading) {
    return (
      <Box
        sx={{
          p: config.padding,
          display: 'flex',
          gap: 2,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          backgroundColor: '#f9fafb',
        }}
      >
        <Skeleton
          variant="rectangular"
          width={config.imageSize}
          height={config.imageSize}
          sx={{ borderRadius: 1, flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Skeleton
            variant="text"
            width="60%"
            height={size === 'small' ? 20 : 24}
            sx={{ mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width="80%"
            height={14}
          />
        </Box>
      </Box>
    );
  }

  // データがない場合は何も表示しない
  if (!ogpData) {
    return null;
  }

  // エラーがある場合のスタイル
  const hasError = !!ogpData.error;

  return (
    <Box
      sx={{
        p: config.padding,
        display: 'flex',
        gap: 2,
        border: hasError ? '1px solid #fca5a5' : '1px solid #e0e0e0',
        borderRadius: 0.5,
        backgroundColor: hasError ? '#fef2f2' : '#f9fafb',
      }}
    >
      {ogpData.image && !hasError ? (
        <Box
          component="img"
          src={ogpData.image}
          alt={ogpData.title}
          sx={{
            width: config.imageSize,
            height: config.imageSize,
            objectFit: 'cover',
            borderRadius: 1,
            flexShrink: 0,
          }}
        />
      ) : (
        <Box
          sx={{
            width: config.imageSize,
            height: config.imageSize,
            borderRadius: 1,
            backgroundColor: hasError ? '#fee2e2' : '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <RestaurantIcon
            sx={{
              color: hasError ? '#f87171' : '#9ca3af',
              fontSize: config.imageSize * 0.5,
            }}
          />
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: hasError ? '#dc2626' : '#374151',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: size === 'small' ? 2 : 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {hasError ? 'お店の情報を取得できませんでした' : ogpData.title}
        </Typography>
        {!hasError && ogpData.description && (
          <Typography
            variant="caption"
            sx={{
              color: '#6b7280',
              fontSize: '0.75rem',
              mt: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: size === 'small' ? 1 : 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {ogpData.description}
          </Typography>
        )}
        {hasError && (
          <Typography
            variant="caption"
            sx={{
              color: '#dc2626',
              fontSize: '0.75rem',
              mt: 0.5,
              display: 'block',
            }}
          >
            {ogpData.error === 'サイトが OGP に対応していない or 入力された URL が不正です。'
              ? 'サイトが OGP に対応していない or 入力された URL が不正です。'
              : ogpData.error?.includes('HTTP error')
                ? 'ページにアクセスできませんでした'
                : ogpData.error?.includes('timeout')
                  ? 'タイムアウトしました'
                  : ogpData.error || 'エラーが発生しました'}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

