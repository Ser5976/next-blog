'use client';

import { useCallback, useState } from 'react';
import { MessageSquare } from 'lucide-react';

import { CommentRow } from '@/entities/coment-row';
import { CommentsStats } from '@/entities/comments-stats';
import {
  ConfirmDialog,
  ListSkeleton,
  UniversalEmpty,
  UniversalError,
} from '@/shared/ui';
import { useUserCommentDelete, useUserComments } from '../hooks';

export function UserCommentsList({ userId }: { userId: string }) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    commentId: string | null;
    content: string | null;
  }>({ open: false, commentId: null, content: null });

  const {
    data: commentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserComments(userId);

  const handleRefresh = () => {
    refetch();
  };

  const deleteUserCommentMutation = useUserCommentDelete();

  const handleDeleteClick = useCallback(
    (commentId: string, content: string) => {
      setDeleteDialog({
        open: true,
        commentId,
        content,
      });
    },
    []
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteDialog.commentId) {
      deleteUserCommentMutation.mutate(
        { commentId: deleteDialog.commentId },
        {
          onSettled: () => {
            setDeleteDialog({ open: false, commentId: null, content: null });
          },
        }
      );
    }
  }, [deleteDialog.commentId, deleteUserCommentMutation]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialog({ open: false, commentId: null, content: null });
  }, []);

  if (isLoading) {
    return <ListSkeleton count={4} />;
  }

  if (isError) {
    return (
      <UniversalError
        error={error}
        classNameCard="rounded-none"
        icon={<MessageSquare className="h-12 w-12 mx-auto text-red-500" />}
        title="Comments not found"
        onRetry={handleRefresh}
        data-testid="user-comments-error"
        aria-label="Error loading user comments"
      />
    );
  }

  if (!commentsData?.comments.length) {
    return (
      <UniversalEmpty
        icon={<MessageSquare className="h-12 w-12" />}
        title="No comments found"
        description="This user hasn't posted any comments yet."
        data-testid="user-comments-empty"
        aria-label="User has no comments"
      />
    );
  }

  const { comments, stats } = commentsData;

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <CommentsStats stats={stats} />

      {/* Список комментариев */}
      <div className="space-y-3" role="list" aria-label="User comments list">
        {comments.map((comment) => (
          <CommentRow
            key={comment.id}
            comment={comment}
            onDelete={() => handleDeleteClick(comment.id, comment.content)}
            isDeleting={
              deleteUserCommentMutation.isPending &&
              deleteDialog.commentId === comment.id
            }
          />
        ))}
      </div>

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) handleCancelDelete();
        }}
        title="Delete Comment"
        description={`Are you sure you want to delete this comment? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={
          deleteUserCommentMutation.isPending &&
          deleteDialog.commentId ===
            deleteUserCommentMutation.variables?.commentId
        }
        data-testid="delete-comment-dialog"
        aria-label="Confirm comment deletion"
      />
    </div>
  );
}
