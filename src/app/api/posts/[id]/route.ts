import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';
import { deleteImageFromImageKit } from '@/shared/api/deleteImageFromImageKit';
import { articleFormSchema } from '@/widgets/dashboard-articles/model';

/**
 * GET /api/posts/[id]
 * Получение конкретной статьи по ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Ищем статью с включением связанных данных
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            clerkId: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Ошибка при получении статьи:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить статью' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/posts/[id]
 * Обновление существующей статьи
 * Требует прав администратора
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId: currentUserId, sessionClaims } = await auth();
    const body = await request.json();

    // Проверка авторизации
    if (!currentUserId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    // Только администратор может обновлять статьи
    if (
      sessionClaims?.metadata?.role !== 'admin' &&
      sessionClaims?.metadata?.role !== 'author'
    ) {
      return NextResponse.json(
        { error: 'Insufficient rights to update articles' },
        { status: 403 }
      );
    }

    // валидация body при помощи zod
    const { data, success, error } = articleFormSchema.safeParse(body.data);
    // console.log('validation:', validation);
    if (!success) return NextResponse.json(error, { status: 400 });

    // Получаем текущую статью, чтобы проверить, изменилось ли картинка
    const currentArticle = await prisma.post.findUnique({
      where: { id },
      select: { coverImage: true },
    });

    // Если если изменилась и старая существовала - удаляем старую из ImageKit
    if (
      currentArticle?.coverImage &&
      currentArticle.coverImage !== data.coverImage
    ) {
      await deleteImageFromImageKit(currentArticle.coverImage);
    }

    // Обновляем статью
    await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        // НЕ обновляем published - это делается отдельным endpoint'ом
        categoryId: data.categoryId,
        // Для тегов используем set - заменяем все существующие связи
        tags: {
          set: data.tags.map((tagId: string) => ({ id: tagId })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'The article has been updated successfully.',
    });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update the article' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/[id]
 * Удаление статьи
 * Требует прав администратора
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId: currentUserId, sessionClaims } = await auth();

    // Проверка авторизации
    if (!currentUserId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    // Только администратор может удалять статьи
    if (
      sessionClaims?.metadata?.role !== 'admin' &&
      sessionClaims?.metadata?.role !== 'author'
    ) {
      return NextResponse.json(
        { error: 'Insufficient rights to delete articles' },
        { status: 403 }
      );
    }

    // Сначала получаем статью, чтобы удалить обложку из ImageKit
    const article = await prisma.post.findUnique({
      where: { id },
      select: { coverImage: true },
    });

    // Удаляем статью из базы данных
    await prisma.post.delete({
      where: { id },
    });

    // Если была картинка - удаляем её из ImageKit
    if (article?.coverImage) {
      await deleteImageFromImageKit(article.coverImage);
    }

    return NextResponse.json({
      success: true,
      message: 'The article has been successfully deleted.',
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
