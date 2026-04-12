import { useQuery } from '@tanstack/react-query';

import { getCategories } from '../api';
import { Category } from '../model';

export const categoriesQueryKeys = {
  all: ['dashboard-categories'] as const,
  lists: () => [...categoriesQueryKeys.all, 'list'] as const,
  list: () => [...categoriesQueryKeys.lists()] as const,
  details: () => [...categoriesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoriesQueryKeys.details(), id] as const,
};

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: categoriesQueryKeys.list(),
    queryFn: () => getCategories(),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    placeholderData: undefined,
  });
}
