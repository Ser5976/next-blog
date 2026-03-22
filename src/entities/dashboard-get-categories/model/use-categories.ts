import { useQuery } from '@tanstack/react-query';

import { getCategoriesDashboard } from '../api';
import { Category } from './types';

// Ключи для кэширования запросов категорий в React Query
export const categoriesQueryKeys = {
  all: ['categories'] as const, // Базовый ключ для всех запросов категорий
};

export function useCategories(enabled: boolean = true) {
  return useQuery<Category[], Error>({
    queryKey: categoriesQueryKeys.all,
    queryFn: () => getCategoriesDashboard(),
    enabled: enabled,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    placeholderData: undefined,
  });
}
