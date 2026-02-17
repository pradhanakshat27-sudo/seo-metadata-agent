import { Paper, Typography, Box, Chip, Tooltip } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import type { CompetitorItem } from './types/api';

interface CompetitorCardProps {
  competitor: CompetitorItem;
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

const CompetitorCard = ({ competitor }: CompetitorCardProps) => {
  const isScraped = competitor.source === 'scraped';
  const domain = (() => {
    try { return new URL(competitor.url).hostname.replace('www.', ''); }
    catch { return competitor.url; }
  })();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: '3px solid #6366f1',
        borderRadius: 2,
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              backgroundColor: '#6366f1',
              color: 'white',
              borderRadius: '50%',
              width: 22,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {competitor.rank}
          </Typography>
          <Tooltip title={competitor.url} placement="top">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'default' }}>
              <LinkIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {domain}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
        <Chip
          label={isScraped ? 'Scraped' : 'SerpApi'}
          size="small"
          color={isScraped ? 'success' : 'default'}
          variant="outlined"
          sx={{ fontSize: '0.7rem', height: 20 }}
        />
      </Box>

      {/* Title */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Title
        </Typography>
        <Typography variant="body2" sx={codeBoxSx}>
          {competitor.title}
        </Typography>
      </Box>

      {/* Description */}
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Description / Snippet
        </Typography>
        <Typography variant="body2" sx={codeBoxSx}>
          {competitor.description}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CompetitorCard;
