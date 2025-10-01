import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

import { CreateUserInput, SyncUserService } from '@/features/sync-user';

export async function GET(request: NextRequest) {
  let clerkUserId: string | null = null;
  console.log('Sync user endpoint called');

  try {
    // Получаем текущего пользователя из Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    clerkUserId = userId;

    // Получаем redirect_url из параметров запроса
    const searchParams = request.nextUrl.searchParams;
    const redirectUrl = searchParams.get('redirect_url') || '/';

    // Получаем данные пользователя из Clerk
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);

    // Валидация email
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      throw new Error('User email is required');
    }

    // Создаем пользователя в нашей БД
    const userData: CreateUserInput = {
      clerkId: clerkUser.id,
      email: userEmail,
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      imageUrl: clerkUser.imageUrl,
      role:
        (clerkUser.publicMetadata?.role as 'USER' | 'AUTHOR' | 'ADMIN') ||
        'USER',
    };

    await SyncUserService.createUser(userData);

    console.log('User synced successfully, redirecting to:', redirectUrl);
    const successUrl = new URL(redirectUrl, request.url);
    successUrl.searchParams.set('welcome', 'true');

    // Редирект на целевую страницу
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('Sync user error:', error);

    //  ПРАВИЛЬНОЕ определение типа ошибки
    let errorType = 'sync_failed'; // значение по умолчанию

    if (error instanceof Error) {
      if (error.message === 'email_exists') {
        errorType = 'email_exists';
      } else if (
        error.message.includes('email') ||
        error.message.includes('unique')
      ) {
        errorType = 'email_exists';
      }
    }

    //  ОТКАТ: Удаляем пользователя из Clerk при ошибках
    if (clerkUserId && errorType !== 'email_exists') {
      // Для email_exists не удаляем - пусть пользователь сам разбирается
      try {
        console.log(
          'Attempting rollback: deleting user from Clerk',
          clerkUserId
        );
        const clerk = await clerkClient();
        await clerk.users.deleteUser(clerkUserId);
        console.log('Rollback successful: user deleted from Clerk');
      } catch (rollbackError) {
        console.error(
          'ROLLBACK FAILED: Could not delete user from Clerk:',
          rollbackError
        );
      }
    }

    // Редирект на страницу ошибки с правильным параметром
    const errorUrl = new URL('/sync-user-error', request.url);
    errorUrl.searchParams.set('error', errorType); //  errorType вместо error.massege

    return NextResponse.redirect(errorUrl);
  }
}
