import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { articlesQueryKeys } from '@/shared/api';
import { getUserRating, ratePost } from '../api/rate-post';

export const ratingQueryKeys = {
  post: (postId: string) => ['rating', postId] as const,
  userRating: (postId: string) => ['user-rating', postId] as const,
};

export function useRatePost(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rating: number) => ratePost(postId, rating),
    onSuccess: (data) => {
      queryClient.setQueryData(ratingQueryKeys.post(postId), data);
      queryClient.invalidateQueries({
        queryKey: ratingQueryKeys.userRating(postId),
      });
      queryClient.invalidateQueries({
        queryKey: articlesQueryKeys.all,
      });
    },
  });
}

export function useUserRating(postId: string) {
  return useQuery({
    queryKey: ratingQueryKeys.userRating(postId),
    queryFn: () => getUserRating(postId),
    enabled: !!postId,
    staleTime: 1000 * 60,
  });
}
