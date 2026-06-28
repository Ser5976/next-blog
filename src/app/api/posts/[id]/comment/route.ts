import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';
import { commentFormSchema } from '@/shared/schemas/comment-form-schemas';

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
    console.log('body create comment:', body);
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
      select: { id: true },
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
      author: comment.author,
      createdAt: comment.createdAt,
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
