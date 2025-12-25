'use client';

import { Loader2, RefreshCw, Users } from 'lucide-react';

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
import { useUsersManagement } from '../hooks';
import { UserRow } from './user-row';
import { UsersFiltersComponent } from './users-filters';

export const DashboardUsers = () => {
  const {
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
    handleRoleChange,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handlePageChange,
    handleItemsPerPageChange,
    handleFiltersChange,
    handleRefresh,
    handlePrefetchNextPage,
    isUserUpdatingRole,
    isUserDeleting,
    deleteUserMutation,
  } = useUsersManagement();

  if (isError) {
    return (
      <UniversalError
        error={error}
        onRetry={handleRefresh}
        title="Error loading users"
        icon={<Users className="h-12 w-12 mx-auto" />}
        data-testid="users-error-state"
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-6"
      data-testid="dashboard-users"
    >
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
            aria-label="Refresh users list"
            data-testid="refresh-users-button"
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
        <Card data-testid="users-card">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" aria-hidden="true" />
                  Users
                </CardTitle>
                <CardDescription data-testid="users-count">
                  {isLoading
                    ? 'Loading users...'
                    : `${total.toLocaleString()} total users`}
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
            <UsersFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />

            {/* Users List */}
            <div
              onMouseEnter={handlePrefetchNextPage}
              role="region"
              aria-label="Users list"
              data-testid="users-list-container"
            >
              {isLoading ? (
                <ListSkeleton data-testid="users-loading" />
              ) : users.length === 0 ? (
                <UniversalEmpty
                  searchQuery={debouncedEmailSearch}
                  icon={<Users className="h-12 w-12" aria-hidden="true" />}
                  title="No users"
                  data-testid="users-empty-state"
                />
              ) : (
                <div
                  className="space-y-3"
                  role="list"
                  aria-label="User list items"
                  data-testid="users-list"
                >
                  {users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onRoleChange={handleRoleChange}
                      onDelete={handleDeleteClick}
                      isUpdatingRole={isUserUpdatingRole(user.id)}
                      isDeleting={isUserDeleting(user.id)}
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
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) handleCancelDelete();
        }}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteDialog.userEmail}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={
          deleteUserMutation.isPending &&
          deleteDialog.userId === deleteUserMutation.variables
        }
        data-testid="delete-user-dialog"
        aria-label="Confirm user deletion"
      />
    </div>
  );
};
