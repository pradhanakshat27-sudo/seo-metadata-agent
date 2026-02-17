import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Container,
  Typography,
  Box,
  Alert,
  AlertTitle,
  CircularProgress,
  Button,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InputForm from './InputForm';
import CurrentMetadata from './CurrentMetadata';
import VariationCard from './VariationCard';
import CompetitorCard from './CompetitorCard';
import HistoryPanel from './HistoryPanel';
import { useHistory } from './hooks/useHistory';
import type { MetadataData, APIResponseArray, APIResponse, HistoryEntry } from './types/api';

const API_URL = import.meta.env.VITE_API_URL || '';
const DRAWER_WIDTH = 300;

function App() {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MetadataData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { history, addSuccess, addFailure, deleteEntry, clearAll } = useHistory();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSubmit = () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const submittedUrl = url;
    const submittedKeyword = keyword;

    axios
      .post<APIResponseArray | APIResponse>(
        `${API_URL}/webhook/seo-metadata-agent`,
        { url, keyword },
        { timeout: 60000 }
      )
      .then((response) => {
        const first = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (!first) {
          const msg = 'No response received from the agent.';
          setError(msg);
          addFailure(submittedUrl, submittedKeyword, msg);
          return;
        }
        if (!first.success) {
          const msg = first.error || 'The agent returned an error.';
          setError(msg);
          addFailure(submittedUrl, submittedKeyword, msg);
          return;
        }
        setResult(first.data);
        addSuccess(submittedUrl, submittedKeyword, first.data);
      })
      .catch((err: AxiosError) => {
        let msg: string;
        if (err.response) {
          msg = `Server error ${err.response.status}: ${err.response.statusText}`;
        } else if (err.request) {
          msg = 'Could not reach the n8n agent. Is n8n running and the workflow Active?';
        } else if (err.code === 'ECONNABORTED') {
          msg = 'Request timed out. Please try again.';
        } else {
          msg = err.message || 'An unexpected error occurred.';
        }
        setError(msg);
        addFailure(submittedUrl, submittedKeyword, msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSelectHistory = (entry: HistoryEntry) => {
    setUrl(entry.url);
    setKeyword(entry.keyword);
    if (entry.success && entry.result) {
      setResult(entry.result);
      setError(null);
    } else {
      setResult(null);
      setError(entry.error ?? 'This attempt failed.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <HistoryPanel
        history={history}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        onSelect={handleSelectHistory}
        onDelete={deleteEntry}
        onClear={clearAll}
      />

      <Box
        sx={{
          marginLeft: sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: 'margin-left 225ms cubic-bezier(0.0, 0, 0.2, 1)',
        }}
      >
        {/* Re-open sidebar button */}
        {!sidebarOpen && (
          <Tooltip title="Open history" placement="right">
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{
                position: 'fixed',
                left: 8,
                top: 12,
                zIndex: 1200,
                backgroundColor: 'background.paper',
                boxShadow: 2,
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <CircularProgress />
              <Typography variant="body1">Analysing competitors & generating insights...</Typography>
            </Box>
          </Box>
        )}

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SearchIcon sx={{ color: 'white', fontSize: 22 }} />
              </Box>
              <Typography variant="h4" component="h1">
                SEO Metadata Agent
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ pl: 0.5 }}>
              Generate AI-optimized meta tags using real competitor analysis
            </Typography>
          </Box>

          {/* Input form */}
          <InputForm
            url={url}
            keyword={keyword}
            onUrlChange={setUrl}
            onKeywordChange={setKeyword}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          {/* Error */}
          {error && !isLoading && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              }
            >
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          {/* Results */}
          {result && !isLoading && (
            <>
              <Divider sx={{ mb: 3 }} />

              {/* Row 1: Current Metadata + Optimized Variations */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '2fr 3fr' },
                  gap: 3,
                  alignItems: 'start',
                  mb: 4,
                }}
              >
                {/* Current metadata + competitor insight */}
                <CurrentMetadata
                  metadata={result.current}
                  competitorInsight={result.competitorInsight}
                />

                {/* Variations */}
                <Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Optimized Variations
                  </Typography>
                  {result.optimizedVariations.map((variation, index) => (
                    <VariationCard
                      key={`${variation.strategy}-${index}`}
                      variation={variation}
                      index={index}
                    />
                  ))}
                </Box>
              </Box>

              {/* Row 2: Competitor Analysis */}
              {result.competitors && result.competitors.length > 0 && (
                <>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleAltIcon sx={{ color: '#6366f1' }} />
                    <Typography variant="h6" fontWeight={700}>
                      Top Ranking Competitors
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                      gap: 2,
                    }}
                  >
                    {result.competitors.map((competitor) => (
                      <CompetitorCard key={competitor.rank} competitor={competitor} />
                    ))}
                  </Box>
                </>
              )}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default App;
