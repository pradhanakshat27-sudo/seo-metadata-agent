import { Paper, Typography, Box } from '@mui/material';
import type { CurrentMetadata as CurrentMetadataType } from './types/api';

interface CurrentMetadataProps {
  metadata: CurrentMetadataType;
}

const codeBoxSx = {
  fontFamily: 'monospace',
  wordBreak: 'break-word',
  p: 1.5,
  borderRadius: 1,
  backgroundColor: '#f1f5f9',
  border: '1px solid #e2e8f0',
  fontSize: '0.875rem',
  lineHeight: 1.6,
} as const;

const CurrentMetadata = ({ metadata }: CurrentMetadataProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Current Metadata
      </Typography>

      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.75 }}>
          Meta Title
        </Typography>
        <Typography variant="body1" sx={codeBoxSx}>
          {metadata.title}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.75 }}>
          Meta Description
        </Typography>
        <Typography variant="body2" sx={codeBoxSx}>
          {metadata.description}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CurrentMetadata;
