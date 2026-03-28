import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Comment } from '@/entities/coment-row';
import { deleteUserComment } from '../api';
import { userCommentsQueryKeys } from './use-user-comments';

export function useUserCommentDelete(userId: string) {
  //  Добавляем userId как параметр
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string }) =>
      deleteUserComment(commentId),

    // Оптимистичное удаление
    onMutate: async ({ commentId }) => {
      // Используем специфичный ключ для этого пользователя
      const queryKey = userCommentsQueryKeys.list(userId);

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<{
        comments: Comment[];
        stats?: any; // Добавляем stats, если они есть в ответе
      }>(queryKey);

      queryClient.setQueryData<{ comments: Comment[]; stats?: any }>(
        queryKey,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            comments: old.comments.filter(
              (comment) => comment.id !== commentId
            ),
            // 👇 Если есть статистика, обновляем и её
            stats: old.stats
              ? {
                  ...old.stats,
                  total: old.stats.total - 1,
                  // Обновите другие поля статистики при необходимости
                }
              : undefined,
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

    onSettled: (data, error, _variables, context) => {
      // 👇 Инвалидируем только данные этого пользователя
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }

      // Также инвалидируем статистику, если она кэшируется отдельно
      queryClient.invalidateQueries({
        queryKey: userCommentsQueryKeys.stats(userId),
      });
    },
  });
}
