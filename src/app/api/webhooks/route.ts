// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';

import { prisma } from '@/shared/api';

interface ClerkUserWebhookEvent {
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
    }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
  object: string;
  type: string;
}

interface ClerkRoleWebhookEvent {
  data: {
    id: string;
    object: string;
  };
  object: string;
  type: string;
}
type ClerkWebhookEvent = ClerkUserWebhookEvent | ClerkRoleWebhookEvent;

export async function POST(request: NextRequest) {
  console.log('request:', request);
  try {
    const event = (await verifyWebhook(request)) as ClerkWebhookEvent;

    // Обрабатываем события
    switch (event.type) {
      case 'user.updated':
        console.log('User updated:', event.data.id);
        await handleUserUpdated((event as ClerkUserWebhookEvent).data);
        break;
      case 'role.updated':
        await handleRoleUpdated((event as ClerkRoleWebhookEvent).data);
        break;
      case 'user.deleted':
        console.log('User deleted:', event.data.id);
        await handleUserDeleted((event as ClerkUserWebhookEvent).data);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleUserUpdated(userData: ClerkUserWebhookEvent['data']) {
  const { id, email_addresses, first_name, last_name, image_url } = userData;
  const email = email_addresses[0]?.email_address;

  if (!email) {
    throw new Error('No email found for user');
  }

  try {
    const user = await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
      },
      create: {
        clerkId: id,
        email,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
      },
    });

    console.log('User synchronized in database:', user.id);
  } catch (error) {
    console.error('Failed to sync user in database:', error);
    throw error;
  }
}

async function handleRoleUpdated(roleData: ClerkRoleWebhookEvent['data']) {
  const { id, object } = roleData;

  try {
    // Преобразуем роль в формат Prisma
    const prismaRole = getRoleFromMetadata(object);

    // Обновляем роль пользователя в базе данных
    const updatedUser = await prisma.user.update({
      where: { clerkId: id },
      data: { role: prismaRole },
    });

    return updatedUser;
  } catch (error) {
    console.error('Failed to update user role in database:', error);

    // Если пользователь не найден, логируем но не прерываем выполнение
    if (
      error instanceof Error &&
      error.message.includes('Record to update does not exist')
    ) {
      console.log('User not found in database, skipping role update:', id);
      return;
    }

    throw error;
  }
}

async function handleUserDeleted(userData: ClerkWebhookEvent['data']) {
  const { id } = userData;

  try {
    await prisma.user.delete({
      where: { clerkId: id },
    });
    console.log('User deleted from database:', id);
  } catch (error) {
    console.error('Failed to delete user from database:', error);

    if (
      error instanceof Error &&
      error.message.includes('Record to delete does not exist')
    ) {
      console.log('User already deleted from database:', id);
      return;
    }

    throw error;
  }
}
// Вспомогательные функции для преобразования ролей
function getRoleFromMetadata(
  roleFromMetadata?: string
): 'USER' | 'AUTHOR' | 'ADMIN' {
  if (roleFromMetadata === 'admin') return 'ADMIN';
  if (roleFromMetadata === 'author') return 'AUTHOR';
  return 'USER';
}
