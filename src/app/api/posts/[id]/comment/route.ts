import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';
import { commentFormSchema } from '@/shared/schemas/comment-form-schemas';
import { UserClerk } from '@/shared/types';

/**
 * Создание нового комментария к статье
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // валидация body при помощи zod
    const { data, success, error } = commentFormSchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error,
        },
        { status: 400 }
      );
    }

    // Находим пользователя в базе данных
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: currentUserId },
      select: { id: true, clerkId: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Проверяем существование поста
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true, published: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (!post.published) {
      return NextResponse.json(
        { error: 'Cannot comment on unpublished post' },
        { status: 403 }
      );
    }

    // Получаем автора, если он существует в clerk
    let clerkUser: UserClerk | null = null;
    const clerkId = dbUser.clerkId;

    if (clerkId) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(clerkId);

        clerkUser = {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          role: (user.publicMetadata?.role as string) || 'user',
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
          lastSignInAt: user.lastSignInAt,
        };
      } catch (error) {
        // Если пользователь не найден в Clerk, просто оставляем author = null
        console.warn(`User with clerkId ${clerkId} not found in Clerk:`, error);
        clerkUser = null;
      }
    }

    // Создаем комментарий
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        authorId: dbUser.id,
        postId: id,
      },
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
    });

    // Форматируем ответ в соответствии с вашим типом Article
    const formattedComment = {
      id: comment.id,
      content: comment.content,
      likes: comment._count.likes,
      dislikes: comment._count.dislikes,
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
      createdAt: comment.createdAt,
      userReaction: dbUser
        ? comment.likes?.length > 0
          ? 'like'
          : comment.dislikes?.length > 0
            ? 'dislike'
            : null
        : null,
      isAuthor: currentUserId === comment.author?.clerkId,
    };

    return NextResponse.json(formattedComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
