import { Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <Typography
      variant="h5"
      sx={{
        fontWeight: 600,
        color: 'text.primary',
        pt: 3,
        pb: 6,
        mb: 3,
        borderBottom: '1px solid #ddd',
        textAlign: 'center',
      }}
    >
      {title}
    </Typography>
  );
}

