import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { User, userProfileQueryKeys } from '@/features/user-profile-info';
import { updateUserRole } from '../api';
import { UsersResponse } from '../model';
import { usersQueryKeys } from './use-users';

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRole,

    // Оптимистичное обновление
    onMutate: async (variables) => {
      const { userId, newRole } = variables;

      // 1. Отменяем текущие запросы для обоих ключей
      await Promise.all([
        queryClient.cancelQueries({ queryKey: usersQueryKeys.all }),
        queryClient.cancelQueries({
          queryKey: userProfileQueryKeys.profile(userId),
        }),
      ]);

      // 2. Сохраняем предыдущее состояние для обоих
      const previousUsersData = queryClient.getQueryData<UsersResponse>(
        usersQueryKeys.all
      );

      const userProfileKey = userProfileQueryKeys.profile(userId);
      const previousProfileData = queryClient.getQueryData(userProfileKey);

      // 3. Оптимистично обновляем данные списка пользователей
      if (previousUsersData) {
        queryClient.setQueryData<UsersResponse>(usersQueryKeys.all, (old) => {
          if (!old || !old.users) return old;

          return {
            ...old,
            users: old.users.map((user) =>
              user.id === userId ? { ...user, role: newRole } : user
            ),
          };
        });
      }

      // 4. Оптимистично обновляем данные профиля пользователя
      if (previousProfileData) {
        queryClient.setQueryData<User>(userProfileKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            role: newRole,
          };
        });
      }

      // Возвращаем контекст для возможного отката
      return { previousUsersData, previousProfileData, variables };
    },

    // При ошибке откатываем изменения
    onError: (error, variables, context) => {
      const { userId } = variables;
      toast.error(error.message || 'Failed to update role');

      // Восстанавливаем данные списка пользователей
      if (context?.previousUsersData) {
        queryClient.setQueryData(usersQueryKeys.all, context.previousUsersData);
      }

      // Восстанавливаем данные профиля
      if (context?.previousProfileData) {
        const userProfileKey = userProfileQueryKeys.profile(userId);
        queryClient.setQueryData(userProfileKey, context.previousProfileData);
      }
    },

    // При успехе показываем уведомление и обновляем кэш
    onSuccess: (data, variables) => {
      const { userId } = variables;
      toast.success('Role updated successfully');

      // Инвалидируем кэш для обоих запросов, чтобы синхронизировать с сервером
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: usersQueryKeys.all,
          refetchType: 'active',
        }),
        queryClient.invalidateQueries({
          queryKey: userProfileQueryKeys.profile(userId),
          refetchType: 'active',
        }),
      ]);
    },

    // Дополнительно: обработка завершения (успех или ошибка)
    onSettled: (data, error, variables) => {
      const { userId } = variables;
      // Гарантируем, что данные актуальны после мутации
      queryClient.invalidateQueries({
        queryKey: userProfileQueryKeys.profile(userId),
      });
    },
  });
}
