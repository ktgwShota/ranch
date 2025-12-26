import { Box, Button, CircularProgress } from '@mui/material';

export function CreatePollButton({
  loading,
  disabled,
  onClick,
}: {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="contained"
      size="large"
      fullWidth
      sx={{
        py: 2,
        px: 4,
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: 1,
        backgroundColor: '#1976d2',
        textTransform: 'none',
        '&:disabled': {
          backgroundColor: '#ddd',
          color: '#9e9e9e',
          boxShadow: 'none',
        },
      }}
    >
      {loading ? (
        <Box display="flex" alignItems="center" gap={1.5} m={0}>
          <CircularProgress size={20} color="inherit" />
          作成中...
        </Box>
      ) : (
        'ページを作成'
      )}
    </Button>
  );
}
