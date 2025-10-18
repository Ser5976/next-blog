import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { SyncUserService } from '@/features/sync-user';
import { prisma } from '@/shared/api';

/**
 * Тип данных события Clerk webhook
 */
interface ClerkUserWebhookEvent {
  data: {
    id: string;
  };
  object: string;
  type: 'user.deleted' | string;
}

/**
 * Обработка webhook от Clerk
 */
export async function POST(request: NextRequest) {
  const event = (await verifyWebhook(request)) as ClerkUserWebhookEvent;
  try {
    if (event.type !== 'user.deleted') {
      console.log(`Unhandled Clerk webhook type: ${event.type}`);
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    console.log(`➡️  Clerk user.deleted received for ID: ${event.data.id}`);

    await SyncUserService.deleteUser(event.data.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Логируем основную ошибку (возможно, сбой при верификации webhook или при удалении)
    console.error('❌ Webhook processing failed:', error);

    // Если ошибка связана с отсутствием записи (P2025) — это не фатально
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      console.warn('⚠️  User already deleted in database, skipping.');
      return NextResponse.json(
        { message: 'User already deleted' },
        { status: 200 }
      );
    }
    // Записываем  неудачу в базу
    await prisma.failedUserDeletion.create({
      data: {
        clerkId: event.data.id,
        error: (error as Error).message,
      },
    });

    // Возвращаем 200, потому что мы сохранили ошибку и хотим, чтобы админ вручную сделал действие.
    // Если хочешь, чтобы Clerk сам повторил — возвращай 500 здесь.
    return NextResponse.json(
      { message: 'Deletion failed, admin will handle manually' },
      { status: 200 }
    );
  }
}
