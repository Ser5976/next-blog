import { useQuery } from '@tanstack/react-query';

import { getRelatedArticles } from '../api';

export const relatedArticlesQueryKeys = {
  detail: (slug: string, limit: number) =>
    ['related-articles', slug, limit] as const,
};

export function useRelatedArticles(slug: string, limit: number = 3) {
  return useQuery({
    queryKey: relatedArticlesQueryKeys.detail(slug, limit),
    queryFn: () => getRelatedArticles(slug, limit),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
