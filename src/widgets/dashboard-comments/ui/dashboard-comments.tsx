'use client';

import { Loader2, MessageSquare, RefreshCw } from 'lucide-react';

import {
  ConfirmDialog,
  ListSkeleton,
  Pagination,
  UniversalEmpty,
  UniversalError,
} from '@/shared/ui';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { useCommentsManagement } from '../hooks';
import { DASHBOARD_COMMENTS_CONFIG } from '../lib';
import { CommentRow } from './comment-row';
import { CommentsFiltersComponent } from './comments-filters';

export const DashboardComments = () => {
  const {
    filters,
    deleteDialog,
    comments,
    total,
    page,
    totalPages,
    isLoading,
    isError,
    error,
    isFetching,
    debouncedSearch,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handlePageChange,
    handleItemsPerPageChange,
    handleFiltersChange,
    handleRefresh,
    handlePrefetchNextPage,
    isCommentDeleting,
    deleteCommentMutation,
  } = useCommentsManagement();

  if (isError) {
    return (
      <UniversalError
        error={error}
        onRetry={handleRefresh}
        title="Error loading comments"
        icon={<MessageSquare className="h-12 w-12 mx-auto" />}
        data-testid="comments-error-state"
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-6"
      data-testid="dashboard-comments"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {DASHBOARD_COMMENTS_CONFIG.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {DASHBOARD_COMMENTS_CONFIG.subtitle}
            </p>
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading || isFetching}
            className="gap-2"
            aria-label="Refresh comments list"
            data-testid="refresh-comments-button"
          >
            {isLoading || isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            )}
            Refresh
          </Button>
        </div>

        {/* Main Content */}
        <Card data-testid="comments-card">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                  Comments
                </CardTitle>
                <CardDescription data-testid="comments-count">
                  {isLoading
                    ? 'Loading comments...'
                    : `${total.toLocaleString()} total comments`}
                </CardDescription>
              </div>

              {/* Top Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={filters.limit}
                pageSizeOptions={[1, 3, 5, 10, 20, 50, 100]}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                className="mt-0"
                data-testid="pagination-top"
              />
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Filters */}
            <CommentsFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />

            {/* Comments List */}
            <div
              onMouseEnter={handlePrefetchNextPage}
              role="region"
              aria-label="Comments list"
              data-testid="comments-list-container"
            >
              {isLoading ? (
                <ListSkeleton data-testid="comments-loading" />
              ) : comments.length === 0 ? (
                <UniversalEmpty
                  searchQuery={debouncedSearch}
                  icon={
                    <MessageSquare className="h-12 w-12" aria-hidden="true" />
                  }
                  title="No comments"
                  data-testid="comments-empty-state"
                />
              ) : (
                <div
                  className="space-y-3"
                  role="list"
                  aria-label="Comment list items"
                  data-testid="comments-list"
                >
                  {comments.map((comment) => (
                    <CommentRow
                      key={comment.id}
                      comment={comment}
                      onDelete={handleDeleteClick}
                      isDeleting={isCommentDeleting(comment.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Pagination */}
            <div className="border-t pt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={filters.limit}
                pageSizeOptions={[1, 3, 5, 10, 20, 50, 100]}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                data-testid="pagination-bottom"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) handleCancelDelete();
        }}
        title="Delete Comment"
        description={`Are you sure you want to delete this comment? ${
          deleteDialog.commentContent
            ? `Content: "${deleteDialog.commentContent.substring(0, 100)}${
                deleteDialog.commentContent.length > 100 ? '...' : ''
              }"`
            : ''
        } This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={
          deleteCommentMutation.isPending &&
          deleteDialog.commentId === deleteCommentMutation.variables
        }
        data-testid="delete-comment-dialog"
        aria-label="Confirm comment deletion"
      />
    </div>
  );
};
