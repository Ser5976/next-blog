import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { articlesQueryKeys } from '@/shared/api';
import { userPostsQueryKeys } from '@/shared/api/user';
import { ArticleFormValues } from '@/shared/schemas';
import { updateArticle } from '../api';

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userId } = useAuth(); // Получаем  пользователя

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ArticleFormValues }) =>
      updateArticle(id, data),

    onSuccess: (data) => {
      toast.success('Article updated successfully');
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: userPostsQueryKeys.list(userId),
        });
      }

      queryClient.invalidateQueries({
        queryKey: articlesQueryKeys.lists(),
      });

      // Перенаправление в зависимости от роли
      router.replace(`/article/${data.article.slug}`);
    },

    onError: (error: any) => {
      // Проверяем на ошибку уникальности slug
      if (error?.response?.data?.error === 'SLUG_ALREADY_EXISTS') {
        toast.error(
          error.response.data.message ||
            'This slug is already taken. Please choose a different one.'
        );
      } else {
        toast.error(error?.message || 'Failed to create article');
      }
    },
  });
}
