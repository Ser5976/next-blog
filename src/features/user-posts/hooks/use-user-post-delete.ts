import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { userPostsQueryKeys } from '@/shared/api/user';
import { Article } from '@/shared/types';
import { deleteUserPost } from '../api';

export function useUserPostDelete(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserPost,

    // Оптимистичное удаление
    onMutate: async (postId) => {
      // 👇 Используем специфичный ключ для этого пользователя
      const queryKey = userPostsQueryKeys.list(userId);

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<{
        posts: Article[];
        stats: any;
      }>(queryKey);

      queryClient.setQueryData<{ posts: Article[]; stats: any }>(
        queryKey,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            posts: old.posts.filter((post) => post.id !== postId),
            // 👇 Также нужно обновить статистику
            stats: {
              ...old.stats,
              total: old.stats.total - 1,
              // Обновите другие поля статистики при необходимости
            },
          };
        }
      );

      return { previousData, queryKey };
    },

    onError: (error, postId, context) => {
      toast.error(error.message || 'Failed to delete post');

      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },

    onSuccess: () => {
      toast.success('Post deleted successfully');
    },

    onSettled: (data, error, postId, context) => {
      // 👇 Инвалидируем только данные этого пользователя
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }

      // Также инвалидируем статистику, если она кэшируется отдельно
      queryClient.invalidateQueries({
        queryKey: userPostsQueryKeys.stats(userId),
      });
    },
  });
}
