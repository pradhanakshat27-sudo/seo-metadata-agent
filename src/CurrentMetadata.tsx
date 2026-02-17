import { Paper, Typography, Box, Divider } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import type { CurrentMetadata as CurrentMetadataType } from './types/api';

interface CurrentMetadataProps {
  metadata: CurrentMetadataType;
  competitorInsight?: string;
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

const CurrentMetadata = ({ metadata, competitorInsight }: CurrentMetadataProps) => {
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

      <Box sx={{ mb: competitorInsight ? 2.5 : 0 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.75 }}>
          Meta Description
        </Typography>
        <Typography variant="body2" sx={codeBoxSx}>
          {metadata.description}
        </Typography>
      </Box>

      {competitorInsight && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: '#fefce8',
              border: '1px solid #fde047',
            }}
          >
            <LightbulbIcon sx={{ fontSize: 18, color: '#ca8a04', flexShrink: 0, mt: 0.1 }} />
            <Box>
              <Typography variant="caption" fontWeight={700} color="#92400e" sx={{ display: 'block', mb: 0.25 }}>
                Competitor Insight
              </Typography>
              <Typography variant="body2" color="#78350f" sx={{ lineHeight: 1.5 }}>
                {competitorInsight}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default CurrentMetadata;
