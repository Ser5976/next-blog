'use client';

import { useCallback, useMemo, useState } from 'react';
import { Loader2, RefreshCw, Users } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  useDeleteUser,
  usePrefetchUsers,
  useUpdateRole,
  useUsers,
} from '../hooks';
import { UsersFilters as FiltersType } from '../model';
import { Pagination } from './pagination';
import { UsersFiltersComponent } from './users-filters';
import { UsersTable } from './users-table';

// 👇 Вспомогательная функция для безопасных значений
function getSafePage(page: number | undefined): number {
  return page && page > 0 ? page : 1;
}

function getSafeLimit(limit: number | undefined): number {
  return limit && limit > 0 ? limit : 10;
}

export const DashboardUsers = () => {
  const [filters, setFilters] = useState<FiltersType>({
    page: 1,
    limit: 10,
  });

  // 👇 Безопасные значения из фильтров
  const safePage = getSafePage(filters.page);
  const safeLimit = getSafeLimit(filters.limit);

  // TanStack Query хуки с безопасными фильтрами
  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useUsers({
    page: safePage,
    limit: safeLimit,
    emailSearch: filters.emailSearch,
  });

  const updateRoleMutation = useUpdateRole();
  const deleteUserMutation = useDeleteUser();
  const prefetchUsers = usePrefetchUsers();

  // 👇 Мемоизированные данные с безопасным доступом
  const { users, pagination } = useMemo(() => {
    if (!usersData) {
      return {
        users: [],
        pagination: {
          total: 0,
          page: 1,
          totalPages: 1,
        },
      };
    }

    return {
      users: usersData.users || [],
      pagination: {
        total: usersData.total ?? 0,
        page: usersData.page ?? 1,
        totalPages: usersData.totalPages ?? 1,
      },
    };
  }, [usersData]);

  // Обработчики
  const handleRoleChange = useCallback(
    async (userId: string, newRole: string) => {
      try {
        await updateRoleMutation.mutateAsync({ userId, newRole });
      } catch (error) {
        // Ошибка обрабатывается в хуке
      }
    },
    [updateRoleMutation]
  );

  const handleDelete = useCallback(
    async (userId: string, userEmail: string) => {
      if (!confirm(`Are you sure you want to delete user ${userEmail}?`)) {
        return;
      }

      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        // Ошибка обрабатывается в хуке
      }
    },
    [deleteUserMutation]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const newPage = getSafePage(page);
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));

      // Префетчим следующую страницу
      const nextPage = newPage + 1;
      if (nextPage <= pagination.totalPages) {
        prefetchUsers({
          page: nextPage,
          limit: safeLimit,
          emailSearch: filters.emailSearch,
        });
      }
    },
    [filters.emailSearch, pagination.totalPages, prefetchUsers, safeLimit]
  );

  const handleFiltersChange = useCallback((newFilters: FiltersType) => {
    setFilters({
      page: getSafePage(newFilters.page),
      limit: getSafeLimit(newFilters.limit),
      emailSearch: newFilters.emailSearch,
    });
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Префетчим следующую страницу при наведении
  const handlePrefetchNextPage = useCallback(() => {
    const nextPage = safePage + 1;
    if (nextPage <= pagination.totalPages) {
      prefetchUsers({
        page: nextPage,
        limit: safeLimit,
        emailSearch: filters.emailSearch,
      });
    }
  }, [
    filters.emailSearch,
    pagination.totalPages,
    prefetchUsers,
    safeLimit,
    safePage,
  ]);

  if (isError) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Users className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Error loading users
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {error?.message || 'An error occurred while loading users'}
                </p>
                <Button onClick={handleRefresh} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage users with Clerk integration
            </p>
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading || isFetching}
            className="gap-2"
          >
            {isLoading || isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Users
                </CardTitle>
                <CardDescription>
                  {isLoading
                    ? 'Loading users...'
                    : `${pagination.total.toLocaleString()} total users`}
                </CardDescription>
              </div>

              {/* Top Pagination */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={safeLimit}
                onPageChange={handlePageChange}
                isLoading={isFetching}
                className="mt-0"
              />
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Filters */}
            <UsersFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />

            {/* Users Table */}
            <div onMouseEnter={handlePrefetchNextPage}>
              <UsersTable
                users={users}
                isLoading={isLoading}
                onRoleChange={handleRoleChange}
                onDelete={handleDelete}
              />
            </div>

            {/* Bottom Pagination */}
            <div className="border-t pt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={safeLimit}
                onPageChange={handlePageChange}
                isLoading={isFetching}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
