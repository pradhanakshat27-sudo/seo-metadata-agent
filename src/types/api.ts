export type APIResponseArray = APIResponse[];

export interface APIResponse {
  success: boolean;
  data: MetadataData;
  error?: string;
}

export interface MetadataData {
  url: string;
  keyword: string;
  analysis: {
    current: CurrentMetadata;
  };
  optimizedVariations: VariationItem[];
}

export interface CurrentMetadata {
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
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
