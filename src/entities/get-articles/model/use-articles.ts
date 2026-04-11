import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ArticlesFilters, articlesQueryKeys } from '@/shared/api';
import { getArticles } from '../api';
import { ArticlesResponse } from './types';

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
