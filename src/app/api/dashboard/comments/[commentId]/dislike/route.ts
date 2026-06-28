import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';

/**
 * Поставить дизлайк комментарию
 */
export async function POST(
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

    // Проверяем существование комментария
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }

    // Проверяем существующий дизлайк или лайк
    const existingDislike = await prisma.dislike.findUnique({
      where: {
        userId_commentId: {
          userId: dbUser.id,
          commentId: commentId,
        },
      },
    });

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId: dbUser.id,
          commentId: commentId,
        },
      },
    });

    // Если уже есть дизлайк - удаляем его (undislike)
    if (existingDislike) {
      await prisma.dislike.delete({
        where: {
          userId_commentId: {
            userId: dbUser.id,
            commentId: commentId,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Dislike removed',
        action: 'undisliked',
      });
    }

    // Если есть лайк - сначала удаляем его
    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_commentId: {
            userId: dbUser.id,
            commentId: commentId,
          },
        },
      });
    }

    // Создаем дизлайк
    await prisma.dislike.create({
      data: {
        userId: dbUser.id,
        commentId: commentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Comment disliked',
      action: 'disliked',
    });
  } catch (error) {
    console.error('Error disliking comment:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to dislike comment',
      },
      { status: 500 }
    );
  }
}
