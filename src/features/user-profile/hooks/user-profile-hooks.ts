import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getUserPosts, getUserProfile } from '../api';

export const userProfileQueryKeys = {
  all: ['user-profile'] as const,
  profile: (userId: string) =>
    [...userProfileQueryKeys.all, 'profile', userId] as const,
  posts: (userId: string, page: number, limit: number) =>
    [...userProfileQueryKeys.all, 'posts', userId, page, limit] as const,
};

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: userProfileQueryKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    staleTime: 1000 * 60 * 5, // 5 минут
    gcTime: 1000 * 60 * 10, // 10 минут
    retry: 2,
    enabled: !!userId,
  });
}

export function useUserPosts(
  userId: string,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: userProfileQueryKeys.posts(userId, page, limit),
    queryFn: () => getUserPosts(userId, page, limit),
    staleTime: 1000 * 30, // 30 секунд
    gcTime: 1000 * 60 * 5, // 5 минут
    retry: 1,
    enabled: !!userId,
  });
}

export function usePrefetchUserPosts() {
  const queryClient = useQueryClient();

  return (userId: string, page: number, limit: number) => {
    return queryClient.prefetchQuery({
      queryKey: userProfileQueryKeys.posts(userId, page, limit),
      queryFn: () => getUserPosts(userId, page, limit),
      // Оптимизации
      staleTime: 1000 * 30, // 30 секунд
      gcTime: 1000 * 60 * 5, // 5 минут (бывший cacheTime)
    });
  };
}
