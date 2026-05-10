import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateUserComment } from '../api';
import { userCommentsQueryKeys } from './use-user-comments';

export function useUserCommentUpdate(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => updateUserComment(commentId, content),
    onError: (error) => {
      toast.error(error.message || 'Failed to update comment');
    },
    onSuccess: () => {
      toast.success('Comment updated successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userCommentsQueryKeys.list(userId),
      });
      queryClient.invalidateQueries({
        queryKey: userCommentsQueryKeys.stats(userId),
      });
    },
  });
}
