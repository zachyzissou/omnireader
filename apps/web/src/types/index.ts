// API types based on backend schema
export interface Source {
  id: string;
  type: 'RSS' | 'YOUTUBE' | 'PODCAST' | 'CUSTOM' | 'N8N';
  url?: string;
  config?: Record<string, unknown>;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
  lastFetchedAt?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    items: number;
  };
}

export interface Item {
  id: string;
  sourceId: string;
  source: Source;
  title: string;
  author?: string;
  url?: string;
  publishedAt: string;
  content?: string;
  media?: Record<string, unknown>;
  hash: string;
  raw: Record<string, unknown>;
  annotations: Annotation[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    embeddings: number;
  };
}

export interface Annotation {
  id: string;
  itemId: string;
  kind: 'SUMMARY' | 'TAGS' | 'TOPICS' | 'HIGHLIGHTS' | 'NOTE';
  text?: string;
  data?: Record<string, unknown>;
  createdBy?: string;
  createdAt: string;
}

export interface Filter {
  id: string;
  name: string;
  logic: Record<string, unknown>; // JSON Logic DSL
  owner?: string;
  active: boolean;
}

export interface User {
  id: string;
  email?: string;
  roles: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SearchRequest {
  query: string;
  topK?: number;
  rerank?: boolean;
}

export interface SearchResult {
  query: string;
  results: (Item & { score: number })[];
  reranked: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
}

// Frontend-specific types
export interface AppState {
  user: User | null;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  wizardCompleted: boolean;
}

export interface ItemsFilters {
  query?: string;
  tags?: string;
  sourceId?: string;
  after?: string;
  before?: string;
  limit?: number;
  cursor?: string;
}