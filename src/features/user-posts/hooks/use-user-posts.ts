import { useQuery } from '@tanstack/react-query';

import { getUserPosts } from '../api';
import { UserPostsResponse } from '../model';

// Ключи для кэширования
export const userPostsQueryKeys = {
  all: ['user-posts'] as const,
  stats: (userId: string) =>
    [...userPostsQueryKeys.all, 'stats', userId] as const,
} as const;

// Хук для получения постов пользователя
export function useUserPosts(userId: string) {
  return useQuery<UserPostsResponse, Error>({
    queryKey: userPostsQueryKeys.all,
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 минут
    gcTime: 1000 * 60 * 10, // 10 минут
    retry: 1,
    retryDelay: 1000,
    // Не обновлять при фокусе, чтобы не мешать пользователю
    refetchOnWindowFocus: false,
    // Убираем placeholder data чтобы не было миганий
    placeholderData: undefined,
  });
}
