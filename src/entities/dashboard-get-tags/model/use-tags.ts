import { useQuery } from '@tanstack/react-query';

import { getTagsDashboard } from '../api';
import { Tag } from './types';

// Ключи для кэширования запросов категорий в React Query
export const tagsQueryKeys = {
  all: ['tags'] as const, // Базовый ключ для всех запросов категорий
};

export function useTags(enabled: boolean = true) {
  return useQuery<Tag[], Error>({
    queryKey: tagsQueryKeys.all,
    queryFn: () => getTagsDashboard(),
    enabled: enabled,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    placeholderData: undefined,
  });
}
