import { useState, type FC, type FormEvent } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface InputFormProps {
  url: string;
  keyword: string;
  onUrlChange: (url: string) => void;
  onKeywordChange: (keyword: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputForm: FC<InputFormProps> = ({
  url,
  keyword,
  onUrlChange,
  onKeywordChange,
  onSubmit,
  isLoading,
}) => {
  const isUrlValid = /^https?:\/\//.test(url.trim());
  const isKeywordValid = keyword.trim().length >= 2;
  const canSubmit = isUrlValid && isKeywordValid && !isLoading;

  const [urlTouched, setUrlTouched] = useState(false);
  const [keywordTouched, setKeywordTouched] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
        Analyze SEO Metadata
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Page URL"
          placeholder="https://example.com/product"
          value={url}
          onChange={(e) => {
            onUrlChange(e.target.value);
            setUrlTouched(true);
          }}
          onBlur={() => setUrlTouched(true)}
          disabled={isLoading}
          required
          fullWidth
          size="small"
          error={urlTouched && !isUrlValid && url.trim() !== ''}
          helperText={
            urlTouched && !isUrlValid && url.trim() !== ''
              ? 'URL must start with http:// or https://'
              : ' '
          }
        />
        <TextField
          label="Target Keyword"
          placeholder="mens tshirt"
          value={keyword}
          onChange={(e) => {
            onKeywordChange(e.target.value);
            setKeywordTouched(true);
          }}
          onBlur={() => setKeywordTouched(true)}
          disabled={isLoading}
          required
          fullWidth
          size="small"
          error={keywordTouched && !isKeywordValid}
          helperText={
            keywordTouched && !isKeywordValid
              ? 'Keyword must be at least 2 characters'
              : ' '
          }
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!canSubmit}
          startIcon={
            isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SearchIcon />
            )
          }
          fullWidth
        >
          {isLoading ? 'Generating...' : 'Generate Optimized Metadata'}
        </Button>
      </Box>
    </Paper>
  );
};

export default InputForm;
