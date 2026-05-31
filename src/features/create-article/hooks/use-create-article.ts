import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { articlesQueryKeys } from '@/shared/api';
import { userPostsQueryKeys } from '@/shared/api/user';
import { createArticle } from '../api';

/**
 * Хук для создания статьи с мутацией
 * Автоматически инвалидирует кэш и показывает уведомления
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userId, sessionClaims } = useAuth();

  return useMutation({
    mutationFn: createArticle,

    onSuccess: () => {
      toast.success('The article has been successfully created.');
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: userPostsQueryKeys.list(userId),
        });
      }
      queryClient.invalidateQueries({ queryKey: articlesQueryKeys.lists() });

      const role = sessionClaims?.metadata?.role as string;

      if (role === 'admin') {
        router.push('/dashboard/articles');
      } else if (role === 'author') {
        router.replace(`/author/articles`);
      } else {
        router.push('/');
      }
    },

    onError: (error: any) => {
      console.log('error:', error);
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
