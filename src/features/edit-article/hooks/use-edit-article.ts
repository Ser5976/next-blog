import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { articlesQueryKeys } from '@/shared/api';
import { ArticleFormValues } from '@/shared/schemas';
import { updateArticle } from '../api';

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userId, sessionClaims } = useAuth(); // Получаем  пользователя

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ArticleFormValues }) =>
      updateArticle(id, data),

    onSuccess: () => {
      toast.success('Article updated successfully');
      queryClient.invalidateQueries({
        queryKey: articlesQueryKeys.all,
      });
      // Получение роли из sessionClaims (если настроено в Clerk)
      const role = sessionClaims?.metadata?.role as string;

      // Перенаправление в зависимости от роли
      if (role === 'admin') {
        router.push('/dashboard/articles'); // Страница статей в дашборде
      } else if (role === 'author') {
        router.push(`/profile/${userId}`); // Профиль пользователя
      } else {
        router.push('/'); // Дефолтное перенаправление
      }
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
