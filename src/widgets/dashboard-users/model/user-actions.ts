'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

import {
  DeleteUserParams,
  UpdateRoleParams,
  User,
  UsersFilters,
  UsersResponse,
} from './types';

// Интерфейс для ответа со статистикой
export interface UsersWithStatsResponse extends UsersResponse {
  stats: {
    total: number;
    admins: number;
    authors: number;
    regular: number;
    activeToday: number;
    // Дополнительная статистика
    activeThisWeek?: number;
    newThisMonth?: number;
  };
}

export async function getUsersWithStats(
  filters: UsersFilters = {}
): Promise<UsersWithStatsResponse> {
  try {
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to view users');
    }

    const client = await clerkClient();
    const {
      page = 1,
      limit = 1,
      search,
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // 👉 ОДИН запрос для получения всех данных
    const allUsersResponse = await client.users.getUserList();

    const allUsers = allUsersResponse.data;
    const total = allUsersResponse.totalCount;

    // 👉 Рассчитываем статистику на основе полученных данных
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const stats = {
      total: total,
      admins: 0,
      authors: 0,
      regular: 0,
      activeToday: 0,
      activeThisWeek: 0,
      newThisMonth: 0,
    };

    // Фильтруем пользователей и считаем статистику за один проход
    const filteredUsers: User[] = [];

    for (const clerkUser of allUsers) {
      const user: User = {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || null,
        lastName: clerkUser.lastName || null,
        role: (clerkUser.publicMetadata?.role as string) || 'user',
        imageUrl: clerkUser.imageUrl,
        createdAt: clerkUser.createdAt,
        lastSignInAt: clerkUser.lastSignInAt,
      };

      // Считаем статистику
      const userRole = user.role;
      if (userRole === 'admin') stats.admins++;
      else if (userRole === 'author') stats.authors++;
      else stats.regular++;

      // Активность сегодня
      if (user.lastSignInAt && now - user.lastSignInAt < oneDay) {
        stats.activeToday++;
      }

      // Активность на этой неделе
      if (user.lastSignInAt && now - user.lastSignInAt < oneWeek) {
        stats.activeThisWeek++;
      }

      // Новые в этом месяце
      if (now - user.createdAt < oneMonth) {
        stats.newThisMonth++;
      }

      // Применяем фильтры для списка пользователей
      let passesFilters = true;

      // Фильтр по поиску
      if (search) {
        const searchLower = search.toLowerCase();
        const passesSearch =
          user.email.toLowerCase().includes(searchLower) ||
          user.firstName?.toLowerCase().includes(searchLower) ||
          false ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          false;

        if (!passesSearch) passesFilters = false;
      }

      // Фильтр по роли
      if (role && role !== 'all' && user.role !== role) {
        passesFilters = false;
      }

      if (passesFilters) {
        filteredUsers.push(user);
      }
    }

    // Сортировка
    filteredUsers.sort((a, b) => {
      if (sortBy === 'email') {
        return sortOrder === 'asc'
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      }

      const aValue = a[sortBy] || 0;
      const bValue = b[sortBy] || 0;

      return sortOrder === 'asc'
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

    // Пагинация
    const totalFiltered = filteredUsers.length;
    const totalPages = Math.ceil(totalFiltered / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      success: true,
      users: paginatedUsers,
      total: totalFiltered,
      page,
      totalPages,
      stats, // 👈 Возвращаем статистику в том же ответе
    };
  } catch (error) {
    console.error('Error getting users with stats:', error);
    return {
      success: false,
      users: [],
      total: 0,
      page: 1,
      totalPages: 0,
      stats: {
        total: 0,
        admins: 0,
        authors: 0,
        regular: 0,
        activeToday: 0,
        activeThisWeek: 0,
        newThisMonth: 0,
      },
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while retrieving users',
    };
  }
}

export async function updateUserRole({ userId, newRole }: UpdateRoleParams) {
  try {
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to change roles');
    }

    const client = await clerkClient();

    await client.users.updateUser(userId, {
      publicMetadata: {
        role: newRole,
      },
    });

    return {
      success: true,
      message: 'Role updated successfully',
    };
  } catch (error) {
    console.error('Error updating role:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while updating the role',
    };
  }
}

export async function deleteUser({ userId }: DeleteUserParams) {
  try {
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to delete users');
    }

    if (currentUserId === userId) {
      throw new Error('You cannot delete your own account');
    }

    const client = await clerkClient();
    await client.users.deleteUser(userId);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while deleting the user',
    };
  }
}
