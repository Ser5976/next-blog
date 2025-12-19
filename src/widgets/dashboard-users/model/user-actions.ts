'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

import {
  DeleteUserParams,
  UpdateRoleParams,
  User,
  UsersFilters,
  UsersResponse,
} from './types';

export interface UsersWithStatsResponse extends UsersResponse {
  stats: {
    total: number;
    admins: number;
    authors: number;
    regular: number;
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
    const { page = 1, limit = 10, emailSearch } = filters;

    // 👉 Параметры для Clerk API с поддержкой поиска
    const clerkParams: {
      limit: number;
      offset: number;
      query?: string; // 👈 НОВОЕ: поисковый запрос
    } = {
      limit: limit,
      offset: (page - 1) * limit,
    };

    // 👉 ПОДДЕРЖКА ПОИСКА ПО ЧАСТИ EMAIL И ИМЕНИ!
    if (emailSearch && emailSearch.trim()) {
      clerkParams.query = emailSearch.trim(); // 👈 Clerk ищет по email и имени
    }

    // 👉 Получаем пагинированных пользователей с поиском
    const usersResponse = await client.users.getUserList(clerkParams);

    // 👉 Преобразуем данные
    const users: User[] = usersResponse.data.map((clerkUser) => ({
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || null,
      lastName: clerkUser.lastName || null,
      role: (clerkUser.publicMetadata?.role as string) || 'user',
      imageUrl: clerkUser.imageUrl,
      createdAt: clerkUser.createdAt,
      lastSignInAt: clerkUser.lastSignInAt,
    }));

    // 👉 Получаем общее количество
    // Для поиска: используем totalCount из ответа (Clerk возвращает общее количество найденных)
    // Без поиска: получаем общее количество всех пользователей
    let total: number;

    if (emailSearch) {
      // При поиске Clerk возвращает totalCount для найденных пользователей
      total = usersResponse.totalCount;
    } else {
      // Без поиска: получаем общее количество
      const allResponse = await client.users.getUserList({ limit: 10 });
      total = allResponse.totalCount;
    }

    // 👉 Рассчитываем статистику (только при первой загрузке или без поиска)
    const stats = {
      total: 0,
      admins: 0,
      authors: 0,
      regular: 0,
    };

    // Получаем статистику только если нет активного поиска
    // или если это первая страница (чтобы не нагружать API)
    if (!emailSearch && page === 1) {
      const statsUsers = await client.users.getUserList({
        limit: 1000,
        query: emailSearch, // 👈 Учитываем поиск и в статистике
      });

      stats.total = statsUsers.totalCount;

      // Считаем статистику
      statsUsers.data.forEach((clerkUser) => {
        const role = (clerkUser.publicMetadata?.role as string) || 'user';
        if (role === 'admin') stats.admins++;
        else if (role === 'author') stats.authors++;
        else stats.regular++;
      });
    }

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      users,
      total,
      page,
      totalPages,
      stats,
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
