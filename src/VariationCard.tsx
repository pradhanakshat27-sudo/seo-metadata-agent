import { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Snackbar,
  Divider,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import type { VariationItem } from './types/api';

interface VariationCardProps {
  variation: VariationItem;
  index: number;
}

type StrategyChipColor = 'warning' | 'primary' | 'success';

function getStrategyColor(strategy: VariationItem['strategy']): StrategyChipColor {
  switch (strategy) {
    case 'urgency': return 'warning';
    case 'benefits': return 'primary';
    case 'social_proof': return 'success';
  }
}

function getStrategyLabel(strategy: VariationItem['strategy']): string {
  switch (strategy) {
    case 'urgency': return 'URGENCY';
    case 'benefits': return 'BENEFITS';
    case 'social_proof': return 'SOCIAL PROOF';
  }
}

const borderTopColors: Record<VariationItem['strategy'], string> = {
  urgency: '#d97706',
  benefits: '#4f46e5',
  social_proof: '#16a34a',
};

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

interface CharBadgeProps {
  length: number;
  meets: boolean;
  range: string;
}

const CharBadge = ({ length, meets, range }: CharBadgeProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    {meets
      ? <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
      : <WarningAmberIcon sx={{ fontSize: 14, color: 'warning.main' }} />
    }
    <Typography
      variant="caption"
      sx={{ color: meets ? 'success.main' : 'warning.main', fontWeight: 600 }}
    >
      {length} chars {meets ? '✓' : `(target: ${range})`}
    </Typography>
  </Box>
);

const VariationCard = ({ variation, index }: VariationCardProps) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const borderTopColor = borderTopColors[variation.strategy];

  const handleCopy = () => {
    const text = `Title: ${variation.title}\nDescription: ${variation.description}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => setSnackbarOpen(true));
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderTop: `3px solid ${borderTopColor}`,
          borderRadius: 2,
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderColor: 'transparent',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Variation {index + 1}
          </Typography>
          <Chip
            label={getStrategyLabel(variation.strategy)}
            color={getStrategyColor(variation.strategy)}
            size="small"
          />
        </Box>

        {/* Title */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Title
            </Typography>
            <CharBadge
              length={variation.titleLength}
              meets={variation.meetsRequirements.titleLength}
              range="50–60"
            />
          </Box>
          <Typography variant="body1" sx={codeBoxSx}>
            {variation.title}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Description */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <CharBadge
              length={variation.descriptionLength}
              meets={variation.meetsRequirements.descriptionLength}
              range="150–160"
            />
          </Box>
          <Typography variant="body2" sx={codeBoxSx}>
            {variation.description}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopy}
          sx={{ borderRadius: 1.5 }}
        >
          Copy Metadata
        </Button>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default VariationCard;
