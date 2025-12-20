import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateUserRole } from '../api';
import { User } from '../model';
import { usersQueryKeys } from './useUsers';

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRole,

    // Оптимистичное обновление
    onMutate: async (variables) => {
      // Отменяем текущие запросы
      await queryClient.cancelQueries({ queryKey: usersQueryKeys.all });

      // Сохраняем предыдущее состояние
      const previousData = queryClient.getQueryData<{ users: User[] }>(
        usersQueryKeys.all
      );

      // Оптимистично обновляем данные
      queryClient.setQueryData<{ users: User[] }>(usersQueryKeys.all, (old) => {
        if (!old) return old;

        return {
          ...old,
          users: old.users.map((user) =>
            user.id === variables.userId
              ? { ...user, role: variables.newRole }
              : user
          ),
        };
      });

      return { previousData };
    },

    // При ошибке откатываем изменения
    onError: (error, variables, context) => {
      toast.error(error.message || 'Failed to update role');

      if (context?.previousData) {
        queryClient.setQueryData(usersQueryKeys.all, context.previousData);
      }
    },

    // При успехе показываем уведомление
    onSuccess: () => {
      toast.success('Role updated successfully');
    },

    // В любом случае инвалидируем кэш
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
    },
  });
}
