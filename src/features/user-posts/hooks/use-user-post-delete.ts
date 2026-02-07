import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Post } from '@/entities/post-row';
import { deleteUserPost } from '../api';
import { userPostsQueryKeys } from './use-user-posts';

export function useUserPostDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserPost,

    // Оптимистичное удаление
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: userPostsQueryKeys.all });

      const previousData = queryClient.getQueryData<{ posts: Post[] }>(
        userPostsQueryKeys.all
      );

      queryClient.setQueryData<{ posts: Post[] }>(
        userPostsQueryKeys.all,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            posts: old.posts.filter((post) => post.id !== postId),
          };
        }
      );

      return { previousData };
    },

    onError: (error, postId, context) => {
      toast.error(error.message || 'Failed to delete user');

      if (context?.previousData) {
        queryClient.setQueryData(userPostsQueryKeys.all, context.previousData);
      }
    },

    onSuccess: () => {
      toast.success('User deleted successfully');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userPostsQueryKeys.all });
    },
  });
}
