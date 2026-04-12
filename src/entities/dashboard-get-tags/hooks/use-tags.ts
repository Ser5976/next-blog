import { useQuery } from '@tanstack/react-query';

import { getTags } from '../api';
import { Tag } from '../model';

export const tagsQueryKeys = {
  all: ['dashboard-tags'] as const,
  lists: () => [...tagsQueryKeys.all, 'list'] as const,
  list: () => [...tagsQueryKeys.lists()] as const,
  details: () => [...tagsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagsQueryKeys.details(), id] as const,
};

export function useTags() {
  return useQuery<Tag[], Error>({
    queryKey: tagsQueryKeys.list(),
    queryFn: () => getTags(),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
}
