import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getArticles } from '../api';
import { ArticlesFilters, ArticlesResponse } from '../model';

export const articlesQueryKeys = {
  all: ['articles'] as const,
  lists: () => [...articlesQueryKeys.all, 'list'] as const,
  list: (filters: ArticlesFilters) =>
    [...articlesQueryKeys.lists(), filters] as const,
  details: () => [...articlesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...articlesQueryKeys.details(), id] as const,
};

export function useArticles(filters: ArticlesFilters) {
  return useQuery<ArticlesResponse, Error>({
    queryKey: articlesQueryKeys.list(filters),
    queryFn: () => getArticles(filters),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    placeholderData: undefined,
  });
}

export function usePrefetchArticles() {
  const queryClient = useQueryClient();

  return (filters: ArticlesFilters) => {
    return queryClient.prefetchQuery({
      queryKey: articlesQueryKeys.list(filters),
      queryFn: () => getArticles(filters),
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    });
  };
}
