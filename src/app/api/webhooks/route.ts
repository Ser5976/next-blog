import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';

import { SyncUserService } from '@/features/sync-user';
import { ClerkUserWebhookEvent } from '@/features/sync-user/model';
import { prisma } from '@/shared/api';

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

    // Записываем  ошибки
    try {
      await prisma.failedUserDeletion.create({
        data: {
          clerkId: event.data.id,
          error: error instanceof Error ? error.message : String(error),
        },
      });
      console.log(
        '⚠️  Logged failed deletion for admin review:',
        event.data.id
      );
    } catch (logError) {
      console.error('❌ Failed to record failed deletion:', logError);
    }

    // Возвращаем 200, потому что мы сохранили ошибку и хотим, чтобы админ вручную сделал действие.
    // Если хочешь, чтобы Clerk сам повторил — возвращай 500 здесь.
    return NextResponse.json(
      { message: 'Deletion failed, admin will handle manually' },
      { status: 200 }
    );
  }
}
