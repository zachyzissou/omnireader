import type { Source, Filter, ItemsFilters, SearchRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    this.accessToken = localStorage.getItem('accessToken');
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyToken(token: string) {
    return this.request('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  // Brain service endpoints (proxied through API gateway)
  async getSources() {
    return this.request('/api/brain/sources');
  }

  async createSource(data: Partial<Source>) {
    return this.request('/api/brain/sources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSource(id: string, data: Partial<Source>) {
    return this.request(`/api/brain/sources/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSource(id: string) {
    return this.request(`/api/brain/sources/${id}`, {
      method: 'DELETE',
    });
  }

  async refreshSource(id: string) {
    return this.request(`/api/brain/sources/${id}/refresh`, {
      method: 'POST',
    });
  }

  async getItems(filters: ItemsFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    
    const query = params.toString();
    return this.request(`/api/brain/items${query ? `?${query}` : ''}`);
  }

  async getItem(id: string) {
    return this.request(`/api/brain/items/${id}`);
  }

  async addAnnotation(itemId: string, annotation: Record<string, unknown>) {
    return this.request(`/api/brain/items/${itemId}/annotate`, {
      method: 'POST',
      body: JSON.stringify(annotation),
    });
  }

  async search(query: string, options: Partial<SearchRequest> = {}) {
    return this.request('/api/brain/search', {
      method: 'POST',
      body: JSON.stringify({ query, ...options }),
    });
  }

  async getSimilarItems(itemId: string, limit = 10) {
    return this.request(`/api/brain/search/similar/${itemId}?limit=${limit}`);
  }

  async getFilters() {
    return this.request('/api/brain/filters');
  }

  async createFilter(filter: Partial<Filter>) {
    return this.request('/api/brain/filters', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  }

  async updateFilter(id: string, filter: Partial<Filter>) {
    return this.request(`/api/brain/filters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(filter),
    });
  }

  async deleteFilter(id: string) {
    return this.request(`/api/brain/filters/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);