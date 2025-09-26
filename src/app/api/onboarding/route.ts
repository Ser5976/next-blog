import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

import { UserSyncService } from '@/features/user-sync/model/sync-service';

export async function POST() {
  try {
    // Получаем текущего пользователя из Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Получаем данные пользователя из Clerk
    const clerk = await clerkClient();

    const clerkUser = await clerk.users.getUser(userId);

    // Синхронизируем пользователя с нашей БД
    await UserSyncService.syncUserOnRegistration({
      id: clerkUser.id,
      emailAddresses: clerkUser.emailAddresses,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      publicMetadata: clerkUser.publicMetadata,
    });

    return NextResponse.json(
      { success: true, message: 'User synced successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
