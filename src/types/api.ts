export type APIResponseArray = APIResponse[];

export interface APIResponse {
  success: boolean;
  data: MetadataData;
  error?: string;
}

export interface MetadataData {
  url: string;
  keyword: string;
  current: CurrentMetadata;
  competitors: CompetitorItem[];
  competitorInsight: string;
  optimizedVariations: VariationItem[];
}

export interface CurrentMetadata {
  title: string;
  description: string;
}

export interface CompetitorItem {
  rank: number;
  title: string;
  description: string;
  url: string;
  source: 'scraped' | 'serpapi_fallback';
}

export interface VariationItem {
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  strategy: 'urgency' | 'benefits' | 'social_proof';
  meetsRequirements: {
    titleLength: boolean;
    descriptionLength: boolean;
  };
}

export interface HistoryEntry {
  id: string;             // Date.now().toString()
  timestamp: string;      // ISO string — safe for JSON
  url: string;
  keyword: string;
  success: boolean;
  result?: MetadataData;  // present only when success === true
  error?: string;         // present only when success === false
}
