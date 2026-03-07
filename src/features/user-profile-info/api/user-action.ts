'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

import { UserClerk } from '@/shared/types';

export async function getUserClerk(clerkId: string): Promise<UserClerk> {
  try {
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to view users');
    }

    const client = await clerkClient();

    // 👉 Получаем  пользователя
    const userResponse = await client.users.getUser(clerkId);

    // 👉 Преобразуем данные
    const user: UserClerk = {
      id: userResponse.id,
      email: userResponse.emailAddresses[0]?.emailAddress || '',
      firstName: userResponse.firstName || null,
      lastName: userResponse.lastName || null,
      role: (userResponse.publicMetadata?.role as string) || 'user',
      imageUrl: userResponse.imageUrl,
      createdAt: userResponse.createdAt,
      lastSignInAt: userResponse.lastSignInAt,
    };

    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Something wen wrong, the user was not received');
  }
}
