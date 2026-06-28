import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';

/**
 * Поставить лайк комментарию
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

    // Проверяем существующий лайк или дизлайк
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId: dbUser.id,
          commentId: commentId,
        },
      },
    });

    const existingDislike = await prisma.dislike.findUnique({
      where: {
        userId_commentId: {
          userId: dbUser.id,
          commentId: commentId,
        },
      },
    });

    // Если уже есть лайк - удаляем его (unlike)
    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_commentId: {
            userId: dbUser.id,
            commentId: commentId,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Like removed',
        action: 'unliked',
      });
    }

    // Если есть дизлайк - сначала удаляем его
    if (existingDislike) {
      await prisma.dislike.delete({
        where: {
          userId_commentId: {
            userId: dbUser.id,
            commentId: commentId,
          },
        },
      });
    }

    // Создаем лайк
    await prisma.like.create({
      data: {
        userId: dbUser.id,
        commentId: commentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Comment liked',
      action: 'liked',
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to like comment',
      },
      { status: 500 }
    );
  }
}
