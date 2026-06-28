import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';

/**
 * Получение оценки пользователя для конкретного поста
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      return NextResponse.json({ rating: null });
    }

    // Находим пользователя в БД
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: currentUserId },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ rating: null });
    }

    // Получаем рейтинг пользователя
    const rating = await prisma.rating.findUnique({
      where: {
        userId_postId: {
          userId: dbUser.id,
          postId: id,
        },
      },
      select: { value: true },
    });

    return NextResponse.json({ rating: rating?.value || null });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return NextResponse.json({ rating: null });
  }
}
