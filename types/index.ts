// Tipos para Mercado Libre API
export interface MLProduct {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  thumbnail: string;
  condition: string;
  permalink: string;
  seller?: {
    id: number;
    nickname: string;
  };
  shipping?: {
    free_shipping: boolean;
  };
  original_price?: number;
  available_quantity?: number;
  sold_quantity?: number;
  specs?: ProductSpecs;
  relatedProducts?: string[]; // IDs of related products (accessories)
}

export interface ProductSpecs {
  ram: string;
  storage: string;
  processor: string;
  screen: {
    size: string;
    type: string;
    refresh: number;
  };
  camera: {
    main: string;
    ultrawide?: string;
    telephoto?: string;
    front: string;
  };
  battery: {
    capacity: string;
    charging: string;
  };
  connectivity: string[];
  os: string;
  weight: number;
  waterResistance: string;
}

export interface MLSearchResponse {
  site_id: string;
  query: string;
  results: MLProduct[];
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
}

export interface MLCategory {
  id: string;
  name: string;
}

// Tipos para el Chat
export interface SearchFilters {
  price?: { min: number; max: number };
  brands?: string[];
  ram?: string[];
  storage?: string[];
  colors?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  products?: MLProduct[];
  isHtml?: boolean;
  comparisonProducts?: MLProduct[];
  geminiInsights?: string;
  priceRange?: { min: number; max: number };
  availableFilters?: SearchFilters;
  activeFilters?: SearchFilters;
  suggestedProducts?: MLProduct[]; // Products suggested for cross-selling
  accessorySuggestionFor?: MLProduct; // Product for which to suggest accessories
}

export interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
