import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { articlesQueryKeys } from '@/shared/api';
import { commentsQueryKeys } from '@/shared/api/comment/query-keys';
import { createComment, CreateCommentData } from '../api/create-comment';

export function useCreateComment(postId: string, postSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => createComment(data),
    onSuccess: (newComment) => {
      // Обновляем кэш бесконечных комментариев
      queryClient.setQueryData(
        commentsQueryKeys.infinite(postId),
        (oldData: any) => {
          if (!oldData || !oldData.pages) {
            // Если данных нет, создаем новую структуру
            return {
              pages: [
                {
                  comments: [newComment],
                  nextCursor: null,
                  hasMore: false,
                  total: 1,
                },
              ],
              pageParams: [undefined],
            };
          }

          // Создаем новый массив страниц
          const newPages = [...oldData.pages];
          newPages[0] = {
            ...newPages[0],
            comments: [newComment, ...newPages[0].comments],
            total: (newPages[0].total || 0) + 1,
          };

          const updatedData = {
            ...oldData,
            pages: newPages,
          };

          console.log('Updated data:', updatedData); // Для отладки
          return updatedData;
        }
      );

      // Обновляем статью в кэше
      queryClient.setQueryData(
        articlesQueryKeys.detail(postSlug),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: [newComment, ...(oldData.comments || [])],
            commentsCount: (oldData.commentsCount || 0) + 1,
          };
        }
      );

      toast.success('Comment posted!');
    },
    onError: (error: any) => {
      console.error('Error posting comment:', error); // Для отладки
      toast.error(error.response?.data?.error || 'Failed to post comment');
    },
  });
}
