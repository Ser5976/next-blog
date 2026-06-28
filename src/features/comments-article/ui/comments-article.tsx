'use client';

import { useCallback, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Loader2, MessageSquare } from 'lucide-react';

import {
  useCreateComment,
  useDeleteComment,
  useInfiniteComments,
  useLikeComment,
  useUpdateComment,
} from '../hooks';
import { CommentsArticleProps } from '../model';
import { CommentForm } from './comment-form';
import { CommentItem } from './comment-item';

export function CommentsArticle({
  postId,
  postSlug,
  initialCommentsCount = 0,
}: CommentsArticleProps) {
  const { userId } = useAuth();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteComments(postId);

  const { mutateAsync: createComment, isPending: isCreating } =
    useCreateComment(postId, postSlug);
  const { mutateAsync: likeComment, isPending: isLiking } =
    useLikeComment(postId);
  const { mutateAsync: deleteComment, isPending: isDeleting } =
    useDeleteComment(postId, postSlug);
  const { mutateAsync: updateComment, isPending: isUpdating } =
    useUpdateComment(postId);

  const comments = data?.pages.flatMap((page) => page.comments) || [];
  const totalComments = data?.pages[0]?.total || initialCommentsCount;

  // Intersection Observer для бесконечной загрузки
  const lastCommentCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const handleCreateComment = async (content: string) => {
    if (!userId) return;
    await createComment({ content, postId });
  };

  const handleLike = async (commentId: string) => {
    if (!userId) return;
    await likeComment({ commentId, action: 'like' });
  };

  const handleDislike = async (commentId: string) => {
    if (!userId) return;
    await likeComment({ commentId, action: 'dislike' });
  };

  const handleEdit = async (commentId: string, content: string) => {
    if (!userId) return;
    await updateComment({ commentId, content });
  };

  const handleDelete = async (commentId: string) => {
    if (!userId) return;
    await deleteComment(commentId);
  };

  if (isLoading && comments.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-emerald-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Comments
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({totalComments})
        </span>
      </div>

      {/* Create Comment Form */}
      <CommentForm onSubmit={handleCreateComment} isSubmitting={isCreating} />

      {/* Comments List with Infinite Scroll */}
      {comments.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {comments.map((comment, index) => {
            const isLast = index === comments.length - 1;
            return (
              <div
                key={comment.id}
                ref={isLast ? lastCommentCallbackRef : null}
              >
                <CommentItem
                  comment={comment}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isLiking={isLiking}
                  isDeleting={isDeleting}
                  isEditing={isUpdating}
                />
              </div>
            );
          })}

          {/* Loading indicator for next page */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
