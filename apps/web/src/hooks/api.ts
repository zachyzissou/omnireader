import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { Source, Item, Filter, ItemsFilters, SearchRequest } from '../types';

// Query keys
export const queryKeys = {
  sources: ['sources'] as const,
  items: (filters?: ItemsFilters) => ['items', filters] as const,
  item: (id: string) => ['items', id] as const,
  filters: ['filters'] as const,
  search: (query: string) => ['search', query] as const,
  similar: (itemId: string) => ['similar', itemId] as const,
  currentUser: ['auth', 'me'] as const,
};

// Sources hooks
export function useSources() {
  return useQuery({
    queryKey: queryKeys.sources,
    queryFn: () => apiClient.getSources(),
  });
}

export function useCreateSource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Source>) => apiClient.createSource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sources });
    },
  });
}

export function useUpdateSource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Source> }) =>
      apiClient.updateSource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sources });
    },
  });
}

export function useDeleteSource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteSource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sources });
    },
  });
}

export function useRefreshSource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.refreshSource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sources });
    },
  });
}

// Items hooks
export function useItems(filters?: ItemsFilters) {
  return useQuery({
    queryKey: queryKeys.items(filters),
    queryFn: () => apiClient.getItems(filters),
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: queryKeys.item(id),
    queryFn: () => apiClient.getItem(id),
    enabled: !!id,
  });
}

export function useAddAnnotation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, annotation }: { itemId: string; annotation: any }) =>
      apiClient.addAnnotation(itemId, annotation),
    onSuccess: (_, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.item(itemId) });
    },
  });
}

// Search hooks
export function useSearch(query: string, options?: Partial<SearchRequest>) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => apiClient.search(query, options),
    enabled: query.length > 0,
  });
}

export function useSimilarItems(itemId: string) {
  return useQuery({
    queryKey: queryKeys.similar(itemId),
    queryFn: () => apiClient.getSimilarItems(itemId),
    enabled: !!itemId,
  });
}

// Filters hooks
export function useFilters() {
  return useQuery({
    queryKey: queryKeys.filters,
    queryFn: () => apiClient.getFilters(),
  });
}

export function useCreateFilter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (filter: Partial<Filter>) => apiClient.createFilter(filter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.filters });
    },
  });
}

export function useUpdateFilter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, filter }: { id: string; filter: Partial<Filter> }) =>
      apiClient.updateFilter(id, filter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.filters });
    },
  });
}

export function useDeleteFilter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteFilter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.filters });
    },
  });
}

// Auth hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: () => apiClient.getCurrentUser(),
    retry: false,
  });
}