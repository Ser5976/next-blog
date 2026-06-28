import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { commentsQueryKeys } from '@/shared/api/comment/query-keys';
import {
  dislikeComment,
  likeComment,
  removeReaction,
} from '../api/like-comment';
import { Comment } from '../model/types';

interface LikeCommentAction {
  commentId: string;
  action: 'like' | 'dislike' | 'remove';
}

export function useLikeComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, action }: LikeCommentAction) => {
      switch (action) {
        case 'like':
          return await likeComment(commentId);
        case 'dislike':
          return await dislikeComment(commentId);
        case 'remove':
          return await removeReaction(commentId);
        default:
          throw new Error('Invalid action');
      }
    },
    onMutate: async ({ commentId, action }) => {
      await queryClient.cancelQueries({
        queryKey: commentsQueryKeys.infinite(postId),
      });

      const previousComments = queryClient.getQueryData(
        commentsQueryKeys.infinite(postId)
      );

      queryClient.setQueryData(
        commentsQueryKeys.infinite(postId),
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              comments: page.comments.map((comment: Comment) => {
                if (comment.id !== commentId) return comment;

                let newLikesCount = comment.likesCount;
                let newDislikesCount = comment.dislikesCount;
                let newUserReaction = comment.userReaction;

                if (newUserReaction === 'like') {
                  newLikesCount--;
                } else if (newUserReaction === 'dislike') {
                  newDislikesCount--;
                }

                if (action === 'like') {
                  newLikesCount++;
                  newUserReaction = 'like';
                } else if (action === 'dislike') {
                  newDislikesCount++;
                  newUserReaction = 'dislike';
                } else if (action === 'remove') {
                  newUserReaction = null;
                }

                return {
                  ...comment,
                  likesCount: newLikesCount,
                  dislikesCount: newDislikesCount,
                  userReaction: newUserReaction,
                };
              }),
            })),
          };
        }
      );

      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentsQueryKeys.infinite(postId),
          context.previousComments
        );
      }
      toast.error('Failed to update reaction');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: commentsQueryKeys.infinite(postId),
      });
    },
  });
}
