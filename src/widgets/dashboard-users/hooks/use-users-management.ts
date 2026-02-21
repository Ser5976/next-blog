'use client';

import { useCallback, useState } from 'react';

import { useCustomDebounce } from '@/shared/hooks';
import { useDeleteUser, usePrefetchUsers, useUpdateRole, useUsers } from '.';
import { UsersFilters as FiltersType } from '../model';

export function useUsersManagement() {
  // State
  const [filters, setFilters] = useState<FiltersType>({
    page: 1,
    limit: 10,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: string | null;
    userEmail: string | null;
  }>({ open: false, userId: null, userEmail: null });

  // Дебаунс для поиска
  const debouncedEmailSearch = useCustomDebounce(
    filters.emailSearch || '',
    500
  );

  // Queries
  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useUsers({
    page: filters.page,
    limit: filters.limit,
    emailSearch: debouncedEmailSearch,
  });

  const { users = [], total = 0, page = 1, totalPages = 1 } = usersData || {};

  // Mutations
  const updateRoleMutation = useUpdateRole();
  const deleteUserMutation = useDeleteUser();
  const prefetchUsers = usePrefetchUsers();

  // Handlers
  const handleRoleChange = useCallback(
    (userId: string, newRole: string) => {
      updateRoleMutation.mutate({ userId, newRole });
    },
    [updateRoleMutation]
  );

  const handleDeleteClick = useCallback((userId: string, userEmail: string) => {
    setDeleteDialog({
      open: true,
      userId,
      userEmail,
    });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteDialog.userId) {
      deleteUserMutation.mutate(deleteDialog.userId, {
        onSettled: () => {
          setDeleteDialog({ open: false, userId: null, userEmail: null });
        },
      });
    }
  }, [deleteDialog.userId, deleteUserMutation]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialog({ open: false, userId: null, userEmail: null });
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
        prefetchUsers({
          page: nextPage,
          limit: filters.limit,
          emailSearch: debouncedEmailSearch,
        });
      }
    },
    [debouncedEmailSearch, totalPages, prefetchUsers, filters.limit]
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
      emailSearch: newFilters.emailSearch,
    });
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePrefetchNextPage = useCallback(() => {
    const nextPage = filters.page + 1;
    if (nextPage <= totalPages) {
      prefetchUsers({
        page: nextPage,
        limit: filters.limit,
        emailSearch: debouncedEmailSearch,
      });
    }
  }, [
    debouncedEmailSearch,
    totalPages,
    prefetchUsers,
    filters.limit,
    filters.page,
  ]);

  // Helpers
  const isUserUpdatingRole = useCallback(
    (userId: string) => {
      return (
        updateRoleMutation.isPending &&
        updateRoleMutation.variables?.userId === userId
      );
    },
    [updateRoleMutation.isPending, updateRoleMutation.variables]
  );

  const isUserDeleting = useCallback(
    (userId: string) => {
      return (
        deleteUserMutation.isPending && deleteUserMutation.variables === userId
      );
    },
    [deleteUserMutation.isPending, deleteUserMutation.variables]
  );

  return {
    // State
    filters,
    deleteDialog,
    users,
    total,
    page,
    totalPages,
    isLoading,
    isError,
    error,
    isFetching,
    debouncedEmailSearch,

    // Mutations
    updateRoleMutation,
    deleteUserMutation,

    // Handlers
    handleRoleChange,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handlePageChange,
    handleItemsPerPageChange,
    handleFiltersChange,
    handleRefresh,
    handlePrefetchNextPage,

    // Helpers
    isUserUpdatingRole,
    isUserDeleting,

    // Actions
    setFilters,
    setDeleteDialog,
  };
}
