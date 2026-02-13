import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  InputAdornment,
  Divider,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchIcon from '@mui/icons-material/Search';
import { formatDistanceToNow } from 'date-fns';
import type { HistoryEntry } from './types/api';

const DRAWER_WIDTH = 300;

interface HistoryPanelProps {
  history: HistoryEntry[];
  open: boolean;
  onToggle: () => void;
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max) + '…';
}

function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;   // e.g. "www.thesouledstore.com"
    return hostname.replace(/^www\./, '');    // e.g. "thesouledstore.com"
  } catch {
    return truncate(url, 35);                 // fallback for invalid URLs
  }
}

const HistoryPanel = ({
  history,
  open,
  onToggle,
  onSelect,
  onDelete,
  onClear,
}: HistoryPanelProps) => {
  const [filterText, setFilterText] = useState('');

  const lower = filterText.toLowerCase();
  const filtered = history.filter(
    (e) =>
      e.url.toLowerCase().includes(lower) ||
      e.keyword.toLowerCase().includes(lower)
  );

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          gap: 1,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" sx={{ flexGrow: 1, letterSpacing: '0.08em' }}>
          HISTORY
        </Typography>
        {history.length > 0 && (
          <Tooltip title="Clear all">
            <IconButton size="small" onClick={onClear}>
              <DeleteSweepIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Collapse">
          <IconButton size="small" onClick={onToggle}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* Search bar */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Filter by URL or keyword…"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider />

      {/* List */}
      <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
        {filtered.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 120,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {history.length === 0 ? 'No history yet' : 'No matches'}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filtered.map((entry) => (
              <ListItemButton
                key={entry.id}
                onClick={() => onSelect(entry)}
                sx={{ alignItems: 'flex-start', py: 1.25, px: 1.5, mx: 0.5, gap: 1, borderRadius: 1.5 }}
              >
                {/* Status chip */}
                <Chip
                  label={entry.success ? 'OK' : 'ERR'}
                  color={entry.success ? 'success' : 'error'}
                  size="small"
                  sx={{ mt: 0.25, flexShrink: 0, minWidth: 42 }}
                />

                {/* Text content */}
                <ListItemText
                  primary={extractDomain(entry.url)}
                  secondary={
                    <>
                      <span>
                        {entry.keyword} ·{' '}
                        {formatDistanceToNow(new Date(entry.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                      {!entry.success && entry.error && (
                        <>
                          <br />
                          <span style={{ color: '#d32f2f' }}>
                            {truncate(entry.error, 60)}
                          </span>
                        </>
                      )}
                    </>
                  }
                  primaryTypographyProps={{
                    variant: 'body2',
                    noWrap: true,
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    component: 'span',
                  }}
                  sx={{ my: 0 }}
                />

                {/* Delete button */}
                <IconButton
                  size="small"
                  sx={{ mt: 0.25, flexShrink: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default HistoryPanel;
