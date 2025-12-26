'use client';

import { Box, Typography } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  Add as AddIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';

interface BrowserWindowProps {
  imageSrc?: string;
  imageAlt?: string;
  address: string;
  children?: React.ReactNode;
}

export default function BrowserWindow({ imageSrc, imageAlt, address, children }: BrowserWindowProps) {
  return (
    <Box>
      {/* Safariスタイルのヘッダーバー */}
      <Box
        sx={{
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          height: 40,
          bgcolor: '#2d2d2d',
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          gap: 1.5,
        }}
      >
        {/* macOSウィンドウコントロール（3色の点） */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ff5f57' }}
          />
          <Box
            sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ffbd2e' }}
          />
          <Box
            sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#28ca42' }}
          />
        </Box>

        {/* ナビゲーションコントロール */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <ArrowBackIcon
            sx={{
              fontSize: 16,
              color: '#fff',
              opacity: 0.7,
              cursor: 'pointer',
              '&:hover': { opacity: 1 },
            }}
          />
          <ArrowForwardIcon
            sx={{
              fontSize: 16,
              color: '#fff',
              opacity: 0.4,
              cursor: 'not-allowed',
            }}
          />
        </Box>

        {/* アドレスバー */}
        <Box
          sx={{
            flex: 1,
            height: 24,
            bgcolor: '#3a3a3a',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            pl: '9px',
            pr: '6px',
          }}
        >
          {/* URL */}
          <Typography
            sx={{
              fontSize: '11px',
              color: '#fff',
              fontWeight: 400,
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {address}
          </Typography>
          {/* リフレッシュアイコン */}
          <RefreshIcon
            sx={{
              fontSize: 16,
              color: '#fff',
              opacity: 0.7,
              cursor: 'pointer',
            }}
          />
        </Box>

        {/* ブラウザアクションアイコン（右側） */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <UploadIcon
            sx={{
              fontSize: 18,
              color: '#fff',
              opacity: 0.7,
              cursor: 'pointer',
              '&:hover': { opacity: 1 },
            }}
          />
          <AddIcon
            sx={{
              fontSize: 18,
              color: '#fff',
              opacity: 0.7,
              cursor: 'pointer',
              '&:hover': { opacity: 1 },
            }}
          />
          <ViewModuleIcon
            sx={{
              fontSize: 18,
              color: '#fff',
              opacity: 0.7,
              cursor: 'pointer',
              '&:hover': { opacity: 1 },
            }}
          />
        </Box>
      </Box>

      {children ? (
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
      ) : (
        <Box
          component="img"
          src={imageSrc}
          alt={imageAlt}
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'contain',
            objectPosition: 'top',
            borderLeft: '1px solid',
            borderRight: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        />
      )}
    </Box>
  );
}

