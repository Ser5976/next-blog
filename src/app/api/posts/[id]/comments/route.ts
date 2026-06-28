import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';
import { UserClerk } from '@/shared/types';

/**
 * GET - Получение комментариев с пагинацией (для бесконечного скролла)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '2');
    const { userId: currentUserId } = await auth();

    // Проверяем существование поста
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Находим пользователя в БД для проверки реакций
    let dbUser = null;
    if (currentUserId) {
      dbUser = await prisma.user.findUnique({
        where: { clerkId: currentUserId },
        select: { id: true },
      });
    }

    // Получаем комментарии с курсором для пагинации
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: {
        author: {
          select: {
            id: true,
            clerkId: true,
          },
        },
        ...(dbUser && {
          likes: {
            where: { userId: dbUser.id },
            select: { userId: true },
          },
          dislikes: {
            where: { userId: dbUser.id },
            select: { userId: true },
          },
        }),
        _count: {
          select: {
            likes: true,
            dislikes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // берем на 1 больше, чтобы понять, есть ли следующая страница
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
    });

    // Проверяем, есть ли еще комментарии
    const hasMore = comments.length > limit;
    const items = hasMore ? comments.slice(0, -1) : comments;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    // Получаем данные авторов из Clerk
    const clerkIds = [
      ...new Set(items.map((c) => c.author?.clerkId).filter(Boolean)),
    ];
    const clerkUsers = new Map<string, UserClerk>();

    if (clerkIds.length > 0) {
      const client = await clerkClient();
      for (const clerkId of clerkIds) {
        try {
          const user = await client.users.getUser(clerkId as string);
          clerkUsers.set(clerkId as string, {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            role: (user.publicMetadata?.role as string) || 'user',
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
            lastSignInAt: user.lastSignInAt,
          });
        } catch (error) {
          console.warn(`User ${clerkId} not found:`, error);
        }
      }
    }

    // Форматируем комментарии
    const formattedComments = items.map((comment) => {
      const clerkUser = comment.author?.clerkId
        ? clerkUsers.get(comment.author.clerkId)
        : null;

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: clerkUser
          ? {
              id: clerkUser.id,
              name:
                [clerkUser.firstName, clerkUser.lastName]
                  .filter(Boolean)
                  .join(' ') || clerkUser.email.split('@')[0],
              imageUrl: clerkUser.imageUrl,
            }
          : {
              id: null,
              name: 'Deleted User',
              imageUrl: null,
            },
        likesCount: comment._count.likes,
        dislikesCount: comment._count.dislikes,
        userReaction: dbUser
          ? comment.likes?.length > 0
            ? 'like'
            : comment.dislikes?.length > 0
              ? 'dislike'
              : null
          : null,
        isAuthor: currentUserId === comment.author?.clerkId,
      };
    });

    return NextResponse.json({
      comments: formattedComments,
      nextCursor,
      hasMore,
      total: await prisma.comment.count({ where: { postId: id } }),
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to load comments' },
      { status: 500 }
    );
  }
}
