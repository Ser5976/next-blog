import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getUserComments } from '../api';
import { UserCommentsResponse } from '../model';

// Ключи для кэширования
export const userCommentsQueryKeys = {
  all: ['user-comments'] as const,
  stats: (userId: string) =>
    [...userCommentsQueryKeys.all, 'stats', userId] as const,
} as const;

// Хук для получения комментариев пользователя
export function useUserComments(userId: string) {
  return useQuery<UserCommentsResponse, Error>({
    queryKey: userCommentsQueryKeys.all,
    queryFn: () => getUserComments(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 минут
    gcTime: 1000 * 60 * 10, // 10 минут
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    placeholderData: undefined,
  });
}

// Хук для префетчинга
export function usePrefetchUserComments() {
  const queryClient = useQueryClient();

  return (userId: string) => {
    return queryClient.prefetchQuery({
      queryKey: userCommentsQueryKeys.all,
      queryFn: () => getUserComments(userId),
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    });
  };
}
