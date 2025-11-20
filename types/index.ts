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
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  products?: MLProduct[];
}

export interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
