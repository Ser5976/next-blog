'use client';

import { useCallback, useState } from 'react';
import { FileText } from 'lucide-react';

import { PostRow } from '@/entities/post-row';
import { PostsStats } from '@/entities/posts-stats';
import {
  ConfirmDialog,
  ListSkeleton,
  UniversalEmpty,
  UniversalError,
} from '@/shared/ui';
import { useUserPostDelete, useUserPosts } from '../hooks';

export function UserPostsList({ userId }: { userId: string }) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    postId: string | null;
    title: string | null;
  }>({ open: false, postId: null, title: null });

  const {
    data: postsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserPosts(userId);

  const handleRefresh = () => {
    refetch();
  };

  const deleteUserPostMutation = useUserPostDelete();

  const handleDeleteClick = useCallback((postId: string, title: string) => {
    setDeleteDialog({
      open: true,
      postId,
      title,
    });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteDialog.postId) {
      deleteUserPostMutation.mutate(deleteDialog.postId, {
        onSettled: () => {
          setDeleteDialog({ open: false, postId: null, title: null });
        },
      });
    }
  }, [deleteDialog.postId, deleteUserPostMutation]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialog({ open: false, postId: null, title: null });
  }, []);

  if (isLoading) {
    return <ListSkeleton count={4} />;
  }

  if (isError) {
    return (
      <UniversalError
        error={error}
        classNameCard="rounded-none"
        icon={<FileText className="h-12 w-12 mx-auto text-red-500" />}
        title="Posts not found"
        onRetry={handleRefresh}
        data-testid="user-posts-error"
        aria-label="Error loading user posts"
      />
    );
  }

  if (!postsData?.posts.length) {
    return (
      <UniversalEmpty
        icon={<FileText className="h-12 w-12" />}
        title="No posts found"
        description="This user hasn't created any posts yet."
        data-testid="user-posts-empty"
        aria-label="User has no posts"
      />
    );
  }

  const { posts, stats } = postsData;

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <PostsStats stats={stats} />

      {/* Список постов */}
      <div className="space-y-3" role="list" aria-label="User posts list">
        {posts.map((post) => (
          <PostRow
            key={post.id}
            post={post}
            onDelete={() => handleDeleteClick(post.id, post.title)}
            isDeleting={
              deleteUserPostMutation.isPending &&
              deleteDialog.postId === post.id
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
        title="Delete Post"
        description={`Are you sure you want to delete "${deleteDialog.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={
          deleteUserPostMutation.isPending &&
          deleteDialog.postId === deleteUserPostMutation.variables
        }
        data-testid="delete-post-dialog"
        aria-label="Confirm post deletion"
      />
    </div>
  );
}
