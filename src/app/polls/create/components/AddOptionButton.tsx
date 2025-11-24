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
        border: '2px dashed',
        borderColor: '#ddd',
        backgroundColor: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        height: '90px',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'auto',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: '#1976d2',
          backgroundColor: '#f5f9ff',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
          '& .add-icon': {
            transform: 'rotate(90deg)',
          },
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&:focus': {
          outline: '2px solid #1976d2',
          outlineOffset: '2px',
        },
      }}
    >
      <AddIcon
        className="add-icon"
        sx={{
          color: '#1976d2',
          fontSize: '1.75rem',
          pointerEvents: 'none',
          transition: 'transform 0.3s ease',
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: '#1976d2',
          fontWeight: 600,
          fontSize: '1rem',
          pointerEvents: 'none',
        }}
      >
        候補を追加
      </Typography>
    </Box>
  );
}
