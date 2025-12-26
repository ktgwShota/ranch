import type { ReactNode } from 'react';
import { Box, Paper, Typography, Button, Tooltip } from '@mui/material';
import { ManageAccounts as ManageAccountsIcon } from '@mui/icons-material';

interface HeaderBaseProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  onOrganizerMenuClick?: (event: React.MouseEvent<HTMLElement>) => void;
  isOrganizer?: boolean;
}

export default function PageHeader({ title, children, actions, onOrganizerMenuClick, isOrganizer = true }: HeaderBaseProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'white',
        display: 'grid',
        gap: { xs: 2.5, sm: 3 },
        gridTemplateColumns: { xs: '1fr auto', sm: '1fr auto' },
        gridTemplateAreas: {
          xs: `
            "title title"
            "content actions"
          `,
          sm: `
            "title actions"
            "space content"
          `,
        },
        alignItems: { xs: 'end', sm: 'start' },
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: { xs: 2, sm: 2.5 },
        mb: 2,
      }}
    >
      {/* Title Area */}
      <Box sx={{ gridArea: 'title' }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '18px', sm: '20px' } }}
        >
          {title}
        </Typography>
      </Box>

      {/* Actions Area (Organizer Button + Other Actions) */}
      <Box sx={{ gridArea: 'actions', display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: "flex-end" }}>
        {onOrganizerMenuClick && (
          <Tooltip title={!isOrganizer ? "幹事（作成者）のみ利用可能" : ""}>
            <Box component="span" sx={{ display: 'inline-block' }}>
              <Button
                onClick={onOrganizerMenuClick}
                variant="outlined"
                disabled={!isOrganizer}
                sx={{
                  color: '#64748b',
                  borderColor: '#cbd5e1',
                  borderWidth: '1px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  gap: 0.5,
                  backgroundColor: 'transparent',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 116, 139, 0.04)',
                    borderColor: '#94a3b8',
                    borderWidth: '1px',
                  },
                  '&.Mui-disabled': {
                    borderColor: '#e2e8f0',
                    color: '#94a3b8',
                  }
                }}
              >
                <ManageAccountsIcon sx={{ fontSize: 20, mb: 0 }} />
                幹事メニュー
              </Button>
            </Box>
          </Tooltip>
        )}
        {actions}
      </Box>

      {/* Content Area */}
      {/* 
        NOTE: Gridアイテムはデフォルトでmin-width: autoが効いており、中身のコンテンツサイズより小さくなれない。
        そのため、minWidth: 0を指定して縮小可能にすることで、子要素のtext-overflow: ellipsis（省略表示）が効くようにしている。
      */}
      <Box sx={{ gridArea: 'content', minWidth: 0 }}>
        {children}
      </Box>
    </Paper >
  );
}
