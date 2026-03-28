// use-user-comment-delete.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Comment } from '@/entities/coment-row';
import { deleteUserComment } from '../api';
import { userCommentsQueryKeys } from './use-user-comments';

export function useUserCommentDelete(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string }) =>
      deleteUserComment(commentId),

    // Оптимистичное удаление
    onMutate: async ({ commentId }) => {
      const queryKey = userCommentsQueryKeys.list(userId);

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<{
        comments: Comment[];
        stats?: any;
      }>(queryKey);

      queryClient.setQueryData<{ comments: Comment[]; stats?: any }>(
        queryKey,
        (old) => {
          if (!old) return old;

          // Находим удаляемый комментарий, чтобы обновить статистику
          const deletedComment = old.comments.find(
            (comment) => comment.id === commentId
          );

          // Фильтруем комментарии
          const filteredComments = old.comments.filter(
            (comment) => comment.id !== commentId
          );

          // Обновляем статистику, если она есть
          let updatedStats = old.stats;
          if (old.stats && deletedComment) {
            updatedStats = {
              ...old.stats,
              totalComments: Math.max(0, (old.stats.totalComments || 0) - 1),
              totalLikes: Math.max(
                0,
                (old.stats.totalLikes || 0) -
                  (deletedComment.stats?.likesCount || 0)
              ),
              totalDislikes: Math.max(
                0,
                (old.stats.totalDislikes || 0) -
                  (deletedComment.stats?.dislikesCount || 0)
              ),
              // Обновляем количество уникальных постов
              postsCommented: Math.max(0, (old.stats.postsCommented || 0) - 1),
            };
          }

          return {
            ...old,
            comments: filteredComments,
            stats: updatedStats,
          };
        }
      );

      return { previousData, queryKey };
    },

    onError: (error, _variables, context) => {
      toast.error(error.message || 'Failed to delete comment');

      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },

    onSuccess: () => {
      toast.success('Comment deleted successfully');
    },

    onSettled: (_data, _error, _variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }

      queryClient.invalidateQueries({
        queryKey: userCommentsQueryKeys.stats(userId),
      });
    },
  });
}
