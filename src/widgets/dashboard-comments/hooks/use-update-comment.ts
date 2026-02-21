import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateComment } from '../api';
import { CommentsResponse } from '../model';
import { commentsQueryKeys } from './use-comments';

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,

    // Оптимистичное обновление
    onMutate: async (variables) => {
      const { commentId, content } = variables;

      // 1. Отменяем текущие запросы
      await queryClient.cancelQueries({
        queryKey: commentsQueryKeys.all,
      });

      // 2. Сохраняем предыдущее состояние
      const previousCommentsData = queryClient.getQueriesData<CommentsResponse>(
        {
          queryKey: commentsQueryKeys.lists(),
        }
      );

      // 3. Оптимистично обновляем данные списка комментариев
      queryClient.setQueriesData<CommentsResponse>(
        { queryKey: commentsQueryKeys.lists() },
        (old) => {
          if (!old || !old.comments) return old;

          return {
            ...old,
            comments: old.comments.map((comment) =>
              comment.id === commentId
                ? { ...comment, content, updatedAt: Date.now() }
                : comment
            ),
          };
        }
      );

      // Возвращаем контекст для возможного отката
      return { previousCommentsData, variables };
    },

    // При ошибке откатываем изменения
    onError: (error, variables, context) => {
      toast.error(error.message || 'Failed to update comment');

      // Восстанавливаем данные
      if (context?.previousCommentsData) {
        context.previousCommentsData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // При успехе показываем уведомление и обновляем кэш
    onSuccess: () => {
      toast.success('Comment updated successfully');

      // Инвалидируем кэш для синхронизации с сервером
      return queryClient.invalidateQueries({
        queryKey: commentsQueryKeys.all,
        refetchType: 'active',
      });
    },

    // Дополнительно: обработка завершения (успех или ошибка)
    onSettled: () => {
      // Гарантируем, что данные актуальны после мутации
      queryClient.invalidateQueries({
        queryKey: commentsQueryKeys.all,
      });
    },
  });
}
