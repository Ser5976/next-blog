import { ArticlesFilters } from './types';

export const articlesQueryKeys = {
  all: ['articles'] as const,
  lists: () => [...articlesQueryKeys.all, 'list'] as const,
  list: (filters: ArticlesFilters) =>
    [...articlesQueryKeys.lists(), filters] as const,
  details: () => [...articlesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...articlesQueryKeys.details(), id] as const,
};
