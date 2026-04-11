import { useQuery } from '@tanstack/react-query';

import { articlesQueryKeys } from '@/shared/api';
import { Article } from '@/shared/types';
import { getArticle } from '../api';

export function useArticle(articleId: string | null) {
  return useQuery<Article | null, Error>({
    queryKey: articlesQueryKeys.detail(articleId || ''),
    queryFn: () => getArticle(articleId),
    enabled: !!articleId,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    placeholderData: undefined,
  });
}
