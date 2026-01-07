import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Проверяем авторизацию и роль
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to view users');
    }

    // Проверяем существование пользователя
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    if (!clerkUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Ищем пользователя в базе по clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      // Если пользователя нет в базе, возвращаем пустой результат
      return NextResponse.json({
        success: true,
        comments: [],
        stats: {
          totalComments: 0,
          totalLikes: 0,
          totalDislikes: 0,
          postsCommented: 0,
        },
      });
    }

    // Получаем комментарии пользователя
    const comments = await prisma.comment.findMany({
      where: { authorId: dbUser.id },
      select: {
        id: true,
        content: true,
        createdAt: true,
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
            published: true,
          },
        },
        _count: {
          select: {
            likes: true,
            dislikes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Получаем статистику по комментариям
    const [postsCommented, totalLikes, totalDislikes] = await Promise.all([
      // Количество уникальных постов с комментариями
      prisma.comment
        .groupBy({
          by: ['postId'],
          where: { authorId: dbUser.id },
          _count: true,
        })
        .then((groups) => groups.length),
      // Общее количество лайков на комментарии пользователя
      prisma.like.count({
        where: {
          comment: {
            authorId: dbUser.id,
          },
        },
      }),
      // Общее количество дислайков на комментарии пользователя
      prisma.dislike.count({
        where: {
          comment: {
            authorId: dbUser.id,
          },
        },
      }),
    ]);

    // Форматируем данные
    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      post: {
        id: comment.post.id,
        title: comment.post.title,
        slug: comment.post.slug,
        published: comment.post.published,
      },
      stats: {
        likesCount: comment._count.likes,
        dislikesCount: comment._count.dislikes,
      },
    }));

    return NextResponse.json({
      success: true,
      comments: formattedComments,
      stats: {
        totalComments: comments.length,
        totalLikes,
        totalDislikes,
        postsCommented,
      },
    });
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch user comments',
      },
      { status: 500 }
    );
  }
}
