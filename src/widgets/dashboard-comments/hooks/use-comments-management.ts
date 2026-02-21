'use client';

import { useCallback, useState } from 'react';

import { useCustomDebounce } from '@/shared/hooks';
import { useComments, useDeleteComment, usePrefetchComments } from '.';
import { CommentsFilters as FiltersType } from '../model';

export function useCommentsManagement() {
  // State
  const [filters, setFilters] = useState<FiltersType>({
    page: 1,
    limit: 10,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    commentId: string | null;
    commentContent: string | null;
  }>({ open: false, commentId: null, commentContent: null });

  // Дебаунс для поиска
  const debouncedSearch = useCustomDebounce(filters.search || '', 500);

  // Queries
  const {
    data: commentsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useComments({
    page: filters.page,
    limit: filters.limit,
    search: debouncedSearch,
  });

  const {
    comments = [],
    total = 0,
    page = 1,
    totalPages = 1,
  } = commentsData || {};

  // Mutations

  const deleteCommentMutation = useDeleteComment();
  const prefetchComments = usePrefetchComments();

  // Handlers

  const handleDeleteClick = useCallback(
    (commentId: string, commentContent: string) => {
      setDeleteDialog({
        open: true,
        commentId,
        commentContent,
      });
    },
    []
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteDialog.commentId) {
      deleteCommentMutation.mutate(deleteDialog.commentId, {
        onSettled: () => {
          setDeleteDialog({
            open: false,
            commentId: null,
            commentContent: null,
          });
        },
      });
    }
  }, [deleteDialog.commentId, deleteCommentMutation]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialog({ open: false, commentId: null, commentContent: null });
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));

      // Префетчим следующую страницу
      const nextPage = newPage + 1;
      if (nextPage <= totalPages) {
        prefetchComments({
          page: nextPage,
          limit: filters.limit,
          search: debouncedSearch,
        });
      }
    },
    [debouncedSearch, totalPages, prefetchComments, filters.limit]
  );

  const handleItemsPerPageChange = useCallback((itemsPerPage: number) => {
    setFilters((prev) => ({
      ...prev,
      limit: itemsPerPage,
      page: 1,
    }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: FiltersType) => {
    setFilters({
      page: newFilters.page,
      limit: newFilters.limit,
      search: newFilters.search,
    });
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePrefetchNextPage = useCallback(() => {
    const nextPage = filters.page + 1;
    if (nextPage <= totalPages) {
      prefetchComments({
        page: nextPage,
        limit: filters.limit,
        search: debouncedSearch,
      });
    }
  }, [
    debouncedSearch,
    totalPages,
    prefetchComments,
    filters.limit,
    filters.page,
  ]);

  // Helpers

  const isCommentDeleting = useCallback(
    (commentId: string) => {
      return (
        deleteCommentMutation.isPending &&
        deleteCommentMutation.variables === commentId
      );
    },
    [deleteCommentMutation.isPending, deleteCommentMutation.variables]
  );

  return {
    // State
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
    // Mutations
    deleteCommentMutation,
    // Handlers
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handlePageChange,
    handleItemsPerPageChange,
    handleFiltersChange,
    handleRefresh,
    handlePrefetchNextPage,
    // Helpers
    isCommentDeleting,
    // Actions
    setFilters,
    setDeleteDialog,
  };
}
