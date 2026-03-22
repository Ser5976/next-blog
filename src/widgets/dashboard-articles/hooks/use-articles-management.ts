'use client';

import { useCallback, useState } from 'react';

import { useCustomDebounce } from '@/shared/hooks';
import {
  useArticle,
  useArticles,
  useCreateArticle,
  useDeleteArticle,
  usePrefetchArticles,
  useTogglePublish,
  useUpdateArticle,
} from '.';
import { ArticlesFilters } from '../model';

export function useArticlesManagement() {
  const [filters, setFilters] = useState<ArticlesFilters>({
    page: 1,
    limit: 10,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    articleId: string | null;
    articleTitle: string | null;
  }>({ open: false, articleId: null, articleTitle: null });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    articleId: string | null;
  }>({ open: false, articleId: null });

  const debouncedSearch = useCustomDebounce(filters.search || '', 500);

  const {
    data: articlesData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useArticles({
    page: filters.page,
    limit: filters.limit,
    search: debouncedSearch,
    category: filters.category,
    tag: filters.tag,
    published: filters.published,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  const {
    articles = [],
    total = 0,
    page = 1,
    totalPages = 1,
  } = articlesData || {};

  if (editDialog.articleId) {
  }
  const { data: article } = useArticle(editDialog.articleId);

  const createArticlesMutation = useCreateArticle();
  const updateArticlMutation = useUpdateArticle();
  const togglePublishMutation = useTogglePublish();
  const deleteArticleMutation = useDeleteArticle();
  const prefetchArticles = usePrefetchArticles();

  const handleDeleteClick = useCallback(
    (articleId: string, articleTitle: string) => {
      setDeleteDialog({
        open: true,
        articleId,
        articleTitle,
      });
    },
    []
  );

  const handleEditClick = useCallback((articleId: string) => {
    setEditDialog({
      open: true,
      articleId,
    });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteDialog.articleId) {
      deleteArticleMutation.mutate(deleteDialog.articleId, {
        onSettled: () => {
          setDeleteDialog({
            open: false,
            articleId: null,
            articleTitle: null,
          });
        },
      });
    }
  }, [deleteDialog.articleId, deleteArticleMutation]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialog({ open: false, articleId: null, articleTitle: null });
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditDialog({ open: false, articleId: null });
  }, []);

  const handleTogglePublish = useCallback(
    (id: string, published: boolean) => {
      togglePublishMutation.mutate({ id, published });
    },
    [togglePublishMutation]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));

      const nextPage = newPage + 1;
      if (nextPage <= totalPages) {
        prefetchArticles({
          ...filters,
          page: nextPage,
          search: debouncedSearch,
        });
      }
    },
    [debouncedSearch, totalPages, prefetchArticles, filters]
  );

  const handleItemsPerPageChange = useCallback((itemsPerPage: number) => {
    setFilters((prev) => ({
      ...prev,
      limit: itemsPerPage,
      page: 1,
    }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: ArticlesFilters) => {
    setFilters({
      ...newFilters,
      page: 1,
    });
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePrefetchNextPage = useCallback(() => {
    const nextPage = filters.page + 1;
    if (nextPage <= totalPages) {
      prefetchArticles({
        ...filters,
        page: nextPage,
        search: debouncedSearch,
      });
    }
  }, [debouncedSearch, totalPages, prefetchArticles, filters]);

  const isArticleDeleting = useCallback(
    (articleId: string) => {
      return (
        deleteArticleMutation.isPending &&
        deleteArticleMutation.variables === articleId
      );
    },
    [deleteArticleMutation.isPending, deleteArticleMutation.variables]
  );

  const isArticleToggling = useCallback(
    (articleId: string) => {
      return (
        togglePublishMutation.isPending &&
        togglePublishMutation.variables?.id === articleId
      );
    },
    [togglePublishMutation.isPending, togglePublishMutation.variables]
  );

  return {
    filters,
    article,
    deleteDialog,
    editDialog,
    articles,
    total,
    page,
    totalPages,
    isLoading,
    isError,
    error,
    isFetching,
    debouncedSearch,
    deleteArticleMutation,
    togglePublishMutation,
    createArticlesMutation,
    updateArticlMutation,
    handleDeleteClick,
    handleEditClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleCloseEdit,
    handleTogglePublish,
    handlePageChange,
    handleItemsPerPageChange,
    handleFiltersChange,
    handleRefresh,
    handlePrefetchNextPage,
    isArticleDeleting,
    isArticleToggling,
    setFilters,
    setDeleteDialog,
    setEditDialog,
  };
}
