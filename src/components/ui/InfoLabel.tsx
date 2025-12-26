import { Box, Typography } from '@mui/material';

interface InfoLabelProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

export function InfoLabel({ label, value, icon }: InfoLabelProps) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#f8fafc', // 非常に薄いグレー（青みがかかったグレー）
        border: '1px solid #e2e8f0',
        borderRadius: '2px',
        pl: 1,
        pr: '10px',
        py: 1,
        gap: 1,
        maxWidth: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
        {icon}
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#475569', // 少し濃く
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* 区切り線 */}
      <Box sx={{ width: '1px', height: '14px', backgroundColor: '#cbd5e1', flexShrink: 0 }} />

      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#1e293b',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
