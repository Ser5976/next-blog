import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { User } from '@/features/user-profile-info';
import { deleteUser } from '../api';
import { usersQueryKeys } from './use-users';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    // Оптимистичное удаление
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: usersQueryKeys.all });

      const previousData = queryClient.getQueryData<{ users: User[] }>(
        usersQueryKeys.all
      );

      queryClient.setQueryData<{ users: User[] }>(usersQueryKeys.all, (old) => {
        if (!old) return old;

        return {
          ...old,
          users: old.users.filter((user) => user.id !== userId),
        };
      });

      return { previousData };
    },

    onError: (error, userId, context) => {
      toast.error(error.message || 'Failed to delete user');

      if (context?.previousData) {
        queryClient.setQueryData(usersQueryKeys.all, context.previousData);
      }
    },

    onSuccess: () => {
      toast.success('User deleted successfully');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
    },
  });
}
