import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

import { commentsQueryKeys } from '@/shared/api/comment/query-keys';
import { CommentsResponse } from '../model';

export function useInfiniteComments(postId: string, limit: number = 2) {
  return useInfiniteQuery({
    queryKey: commentsQueryKeys.infinite(postId),
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as string | undefined;

      const url = cursor
        ? `/api/posts/${postId}/comments?cursor=${cursor}&limit=${limit}`
        : `/api/posts/${postId}/comments?limit=${limit}`;

      const { data } = await axios.get<CommentsResponse>(url);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: !!postId,
    staleTime: 1000 * 30,
  });
}
