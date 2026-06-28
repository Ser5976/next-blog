import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';

/**
 * Удаление реакции (лайка или дизлайка) с комментария
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Находим пользователя в БД
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: currentUserId },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Пытаемся удалить лайк
    const likeDeleted = await prisma.like.deleteMany({
      where: {
        userId: dbUser.id,
        commentId: commentId,
      },
    });

    // Пытаемся удалить дизлайк
    const dislikeDeleted = await prisma.dislike.deleteMany({
      where: {
        userId: dbUser.id,
        commentId: commentId,
      },
    });

    if (likeDeleted.count === 0 && dislikeDeleted.count === 0) {
      return NextResponse.json(
        { success: false, message: 'No reaction found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reaction removed',
    });
  } catch (error) {
    console.error('Error removing reaction:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to remove reaction',
      },
      { status: 500 }
    );
  }
}
