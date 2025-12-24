import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateUserRole } from '../api';
import { UsersResponse } from '../model';
import { usersQueryKeys } from './use-users';

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRole,

    // Оптимистичное обновление
    onMutate: async (variables) => {
      // Отменяем текущие запросы
      await queryClient.cancelQueries({ queryKey: usersQueryKeys.all });

      // Сохраняем предыдущее состояние
      const previousData = queryClient.getQueryData<UsersResponse>(
        usersQueryKeys.all
      );

      // Оптимистично обновляем данные
      queryClient.setQueryData<UsersResponse>(usersQueryKeys.all, (old) => {
        if (!old || !old.users) return old;

        return {
          ...old,
          users: old.users.map((user) =>
            user.id === variables.userId
              ? { ...user, role: variables.newRole }
              : user
          ),
        };
      });

      return { previousData, variables };
    },

    // При ошибке откатываем изменения
    onError: (error, variables, context) => {
      toast.error(error.message || 'Failed to update role');

      if (context?.previousData) {
        queryClient.setQueryData(usersQueryKeys.all, context.previousData);
      }
    },

    // При успехе показываем уведомление и обновляем кэш
    onSuccess: () => {
      toast.success('Role updated successfully');

      // Показываем спинер до полного обновления кэша
      // Возвращаем промис, чтобы мутация считалась завершенной только после обновления кэша
      return queryClient.invalidateQueries({
        queryKey: usersQueryKeys.all,
        refetchType: 'active', // Только активные запросы
      });
    },
  });
}
