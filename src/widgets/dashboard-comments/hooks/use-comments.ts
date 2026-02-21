import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getComments } from '../api';
import { CommentsFilters, CommentsResponse } from '../model';

// Query keys для инвалидации
export const commentsQueryKeys = {
  all: ['comments'] as const,
  lists: () => [...commentsQueryKeys.all, 'list'] as const,
  list: (filters: CommentsFilters) =>
    [...commentsQueryKeys.lists(), filters] as const,
  details: () => [...commentsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentsQueryKeys.details(), id] as const,
} as const;

// Хук для получения комментариев
export function useComments(filters: CommentsFilters) {
  return useQuery<CommentsResponse, Error>({
    queryKey: commentsQueryKeys.list(filters),
    queryFn: () => getComments(filters),
    // Оптимизации
    staleTime: 1000 * 30, // 30 секунд
    gcTime: 1000 * 60 * 5, // 5 минут (бывший cacheTime)
    retry: 1,
    retryDelay: 1000,
    // Не обновлять при фокусе, чтобы не мешать пользователю
    refetchOnWindowFocus: false,
    // Убираем placeholder data чтобы не было миганий
    placeholderData: undefined,
  });
}

// Хук для префетчинга комментариев
export function usePrefetchComments() {
  const queryClient = useQueryClient();

  return (filters: CommentsFilters) => {
    return queryClient.prefetchQuery({
      queryKey: commentsQueryKeys.list(filters),
      queryFn: () => getComments(filters),
      // Оптимизации
      staleTime: 1000 * 30, // 30 секунд
      gcTime: 1000 * 60 * 5, // 5 минут (бывший cacheTime)
    });
  };
}
