import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { articlesQueryKeys } from '@/shared/api';
import { createArticle } from '../api';

/**
 * Хук для создания статьи с мутацией
 * Автоматически инвалидирует кэш и показывает уведомления
 */
export function useCreateArticle() {
  const queryClient = useQueryClient(); // Для работы с кэшем React Query
  const router = useRouter(); // Для навигации после успешного создания
  const { userId, sessionClaims } = useAuth(); // Получаем данные пользователя

  return useMutation({
    // Функция мутации - вызывается при mutate()
    mutationFn: createArticle,

    // При успешном создании
    onSuccess: () => {
      // Показываем уведомление
      toast.success('The article has been successfully created.');

      // Инвалидируем все запросы статей, чтобы обновить список
      queryClient.invalidateQueries({ queryKey: articlesQueryKeys.all });
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

    // При ошибке
    onError: (error) => {
      toast.error(error.message || 'Failed to create article');
    },
  });
}
