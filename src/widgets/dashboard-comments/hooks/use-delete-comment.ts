import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteComment } from '../api';
import { CommentsResponse } from '../model';
import { commentsQueryKeys } from './use-comments';

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,

    // Оптимистичное удаление
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: commentsQueryKeys.all,
      });

      const previousCommentsData = queryClient.getQueriesData<CommentsResponse>(
        {
          queryKey: commentsQueryKeys.lists(),
        }
      );

      queryClient.setQueriesData<CommentsResponse>(
        { queryKey: commentsQueryKeys.lists() },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            comments: old.comments.filter(
              (comment) => comment.id !== commentId
            ),
            total: old.total - 1,
          };
        }
      );

      return { previousCommentsData };
    },

    onError: (error, commentId, context) => {
      toast.error(error.message || 'Failed to delete comment');

      if (context?.previousCommentsData) {
        context.previousCommentsData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSuccess: () => {
      toast.success('Comment deleted successfully');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsQueryKeys.all });
    },
  });
}
