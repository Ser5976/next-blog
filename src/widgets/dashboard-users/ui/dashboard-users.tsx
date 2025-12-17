'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  deleteUser,
  getUsersWithStats,
  updateUserRole,
  User,
  UsersFilters,
} from '../model';
import { Pagination } from './pagination';
import { UserRow } from './user-row';
import { UserStats } from './user-stats';
import { UsersFiltersComponent } from './users-filters';

export const DashboardUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId] = useState<string>('');
  const [filters, setFilters] = useState<UsersFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    authors: 0,
    regular: 0,
    activeToday: 0,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUsersWithStats(filters);

      if (result.success) {
        setUsers(result.users);
        setPagination({
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
        });
        setStats(result.stats); // 👈 Статистика приходит вместе с пользователями
      } else {
        toast.error(result.message || 'Failed to load users');
      }
    } catch (error) {
      toast.error('Error loading users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const result = await updateUserRole({ userId, newRole });

      if (result.success) {
        toast.success('Role updated successfully');
        // Обновляем локальное состояние
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error updating role');
      console.error(error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const result = await deleteUser({ userId });

      if (result.success) {
        toast.success('User deleted successfully');
        // Перезагружаем данные
        loadData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error deleting user');
      console.error(error);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRefresh = () => {
    loadData();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage user roles, permissions, and accounts
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            className="gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {/* Статистика */}
        {!loading && <UserStats stats={stats} />}

        {/* Основной контент */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users List
            </CardTitle>
            <CardDescription>
              Showing {users.length} of {pagination.total} users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Фильтры */}
            <UsersFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
            />

            {/* Список пользователей */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-12 w-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {filters.search || filters.role
                    ? 'Try adjusting your search or filters'
                    : 'No users in the system yet'}
                </p>
                {(filters.search || filters.role) && (
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ page: 1, limit: 10 })}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onRoleChange={handleRoleChange}
                    onDelete={handleDelete}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            )}

            {/* Пагинация */}

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
