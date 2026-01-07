import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Comment } from '@/entities/coment-row';
import { deleteUserComment } from '../api';
import { userCommentsQueryKeys } from './use-user-comments';

export function useUserCommentDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string }) =>
      deleteUserComment(commentId),

    // Оптимистичное удаление
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({ queryKey: userCommentsQueryKeys.all });

      const previousData = queryClient.getQueryData<{
        comments: Comment[];
      }>(userCommentsQueryKeys.all);

      queryClient.setQueryData<{ comments: Comment[] }>(
        userCommentsQueryKeys.all,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            comments: old.comments.filter(
              (comment) => comment.id !== commentId
            ),
          };
        }
      );

      return { previousData };
    },

    onError: (error, commentId, context) => {
      toast.error(error.message || 'Failed to delete comment');

      if (context?.previousData) {
        queryClient.setQueryData(
          userCommentsQueryKeys.all,
          context.previousData
        );
      }
    },

    onSuccess: () => {
      toast.success('Comment deleted successfully');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userCommentsQueryKeys.all });
    },
  });
}
