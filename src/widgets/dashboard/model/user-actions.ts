'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

interface UpdateRoleParams {
  userId: string;
  newRole: string;
}

export async function updateUserRole({ userId, newRole }: UpdateRoleParams) {
  try {
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    // Проверяем права текущего пользователя (только админы могут менять роли)

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to change roles');
    }

    const client = await clerkClient();

    // Обновляем роль пользователя
    await client.users.updateUser(userId, {
      publicMetadata: {
        role: newRole,
      },
    });

    return {
      success: true,
      message: 'The role has been updated successfully.',
    };
  } catch (error) {
    console.error('Error updating role:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while updating the role.',
    };
  }
}

export async function getUsersWithRoles() {
  try {
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    // Проверяем права текущего пользователя (только админы могут менять роли)

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to change roles');
    }

    const client = await clerkClient();

    // Получаем всех пользователей
    const users = await client.users.getUserList();

    // Фильтруем и форматируем данные
    const usersWithRoles = users.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || 'No email',
      firstName: user.firstName || 'No firstName',
      lastName: user.lastName || 'No lastName ',
      role: (user.publicMetadata?.role as string) || 'user',
      imageUrl: user.imageUrl,
    }));

    return { success: true, users: usersWithRoles };
  } catch (error) {
    console.error('Error getting users:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while retrieving users',
      users: [],
    };
  }
}
