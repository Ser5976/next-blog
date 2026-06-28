import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { articlesQueryKeys } from '@/shared/api';
import { commentsQueryKeys } from '@/shared/api/comment/query-keys';
import { deleteComment } from '../api/delete-comment';

export function useDeleteComment(postId: string, postSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: (_, commentId) => {
      // Обновляем кэш бесконечных комментариев
      queryClient.setQueryData(
        commentsQueryKeys.infinite(postId),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              comments: page.comments.filter(
                (comment: any) => comment.id !== commentId
              ),
              total: page.total - 1,
            })),
          };
        }
      );

      // Обновляем статью в кэше
      queryClient.setQueryData(
        articlesQueryKeys.detail(postSlug),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: (oldData.comments || []).filter(
              (c: any) => c.id !== commentId
            ),
          };
        }
      );

      toast.success('Comment deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete comment');
    },
  });
}
