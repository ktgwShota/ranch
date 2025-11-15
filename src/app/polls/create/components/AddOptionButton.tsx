import { Add as AddIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

export function AddOptionButton({ onClick }: { onClick: () => void }) {
  return (
    <Box
      component="div"
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
      sx={{
        mb: 3,
        borderRadius: 0.5,
        border: '1px solid',
        borderColor: '#ddd',
        backgroundColor: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        height: '90px',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'auto',
        '&:hover': {
          borderColor: '#1976d2',
          backgroundColor: '#fafafa',
        },
        '&:focus': {
          outline: '2px solid #1976d2',
          outlineOffset: '2px',
        },
      }}
    >
      <AddIcon sx={{ color: '#1976d2', fontSize: '1.5rem', pointerEvents: 'none' }} />
      <Typography
        variant="body2"
        sx={{
          color: '#1976d2',
          fontSize: '0.95rem',
          fontWeight: 500,
          pointerEvents: 'none',
        }}
      >
        お店の候補を追加
      </Typography>
    </Box>
  );
}
