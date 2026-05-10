import { useQuery } from '@tanstack/react-query';

import { getAuthorStats } from '../api';

export const authorStatsQueryKeys = {
  all: ['author-stats'] as const,
  byRange: (timeRange: 'week' | 'month' | 'year') =>
    [...authorStatsQueryKeys.all, timeRange] as const,
};

export function useAuthorStats(timeRange: 'week' | 'month' | 'year') {
  return useQuery({
    queryKey: authorStatsQueryKeys.byRange(timeRange),
    queryFn: () => getAuthorStats(timeRange),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
