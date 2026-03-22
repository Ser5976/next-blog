import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createArticle } from '../api';
import { articlesQueryKeys } from './use-articles';

/**
 * Хук для создания статьи с мутацией
 * Автоматически инвалидирует кэш и показывает уведомления
 */
export function useCreateArticle() {
  const queryClient = useQueryClient(); // Для работы с кэшем React Query
  const router = useRouter(); // Для навигации после успешного создания

  return useMutation({
    // Функция мутации - вызывается при mutate()
    mutationFn: createArticle,

    // При успешном создании
    onSuccess: () => {
      // Показываем уведомление
      toast.success('The article has been successfully created.');

      // Инвалидируем все запросы статей, чтобы обновить список
      queryClient.invalidateQueries({ queryKey: articlesQueryKeys.all });

      // Перенаправляем на список статей
      router.push('/dashboard/articles');
    },

    // При ошибке
    onError: (error) => {
      toast.error(error.message || 'Failed to create article');
    },
  });
}
