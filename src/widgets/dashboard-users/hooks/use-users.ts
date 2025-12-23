import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getUsers } from '../api';
import { UsersFilters, UsersResponse } from '../model';

// Query keys для инвалидации
export const usersQueryKeys = {
  all: ['users'] as const,
  lists: () => [...usersQueryKeys.all, 'list'] as const,
  list: (filters: UsersFilters) =>
    [...usersQueryKeys.lists(), filters] as const,
  details: () => [...usersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersQueryKeys.details(), id] as const,
} as const;

// Хук для получения пользователей
export function useUsers(filters: UsersFilters) {
  return useQuery<UsersResponse, Error>({
    queryKey: usersQueryKeys.list(filters),
    queryFn: () => getUsers(filters),
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

// Хук для префетчинга пользователей
export function usePrefetchUsers() {
  const queryClient = useQueryClient();

  return (filters: UsersFilters) => {
    return queryClient.prefetchQuery({
      queryKey: usersQueryKeys.list(filters),
      queryFn: () => getUsers(filters),
      // Оптимизации
      staleTime: 1000 * 30, // 30 секунд
      gcTime: 1000 * 60 * 5, // 5 минут (бывший cacheTime)
    });
  };
}
