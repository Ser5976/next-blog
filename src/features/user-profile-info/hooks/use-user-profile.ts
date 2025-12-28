import { useQuery } from '@tanstack/react-query';

import { getUserProfile } from '../api';

export const userProfileQueryKeys = {
  all: ['user-profile'] as const,
  profile: (userId: string) =>
    [...userProfileQueryKeys.all, 'profile', userId] as const,
};

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: userProfileQueryKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    staleTime: 1000 * 60 * 5, // 5 минут
    gcTime: 1000 * 60 * 10, // 10 минут
    retry: 1,
    enabled: !!userId,
  });
}
