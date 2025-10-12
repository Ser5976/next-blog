// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';

import { prisma } from '@/shared/api';

interface ClerkWebhookEvent {
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
    }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    unsafe_metadata?: {
      onboardingComplete?: boolean;
      role?: string;
    };
  };
  object: string;
  type: string;
}

export async function POST(request: NextRequest) {
  console.log('request:', request);
  try {
    const event = (await verifyWebhook(request)) as ClerkWebhookEvent;

    // Обрабатываем события
    switch (event.type) {
      case 'user.updated':
        console.log('User updated:', event.data.id);
        await handleUserUpdated(event.data);
        break;
      case 'role.updated':
        await handleRoleUpdated();
        break;
      case 'user.deleted':
        console.log('User deleted:', event.data.id);
        await handleUserDeleted(event.data);
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

async function handleUserUpdated(userData: ClerkWebhookEvent['data']) {
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    image_url,
    unsafe_metadata,
  } = userData;
  const email = email_addresses[0]?.email_address;

  if (!email) {
    throw new Error('No email found for user');
  }

  try {
    const roleFromMetadata = unsafe_metadata?.role as string;
    let role: 'USER' | 'AUTHOR' | 'ADMIN' = 'USER';

    if (roleFromMetadata === 'admin') role = 'ADMIN';
    else if (roleFromMetadata === 'author') role = 'AUTHOR';

    const user = await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
        role,
      },
      create: {
        clerkId: id,
        email,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
        role,
      },
    });

    console.log('User synchronized in database:', user.id);
  } catch (error) {
    console.error('Failed to sync user in database:', error);
    throw error;
  }
}

async function handleRoleUpdated() {
  console.log(`Role updated for user $`);
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
