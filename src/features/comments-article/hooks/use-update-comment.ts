import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { commentsQueryKeys } from '@/shared/api/comment/query-keys';
import { updateComment } from '../api/update-comment';

interface UseUpdateCommentData {
  commentId: string;
  content: string;
}

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: UseUpdateCommentData) =>
      updateComment(commentId, { content }),
    onSuccess: (updatedComment) => {
      // Обновляем кэш бесконечных комментариев
      queryClient.setQueryData(
        commentsQueryKeys.infinite(postId),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              comments: page.comments.map((comment: any) =>
                comment.id === updatedComment.id
                  ? {
                      ...comment,
                      content: updatedComment.content,
                      updatedAt: updatedComment.updatedAt,
                    }
                  : comment
              ),
            })),
          };
        }
      );
      // Просто инвалидируем кэш, чтобы перезапросить данные
      queryClient.invalidateQueries({
        queryKey: commentsQueryKeys.infinite(postId),
      });
      toast.success('Comment updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update comment');
    },
  });
}
