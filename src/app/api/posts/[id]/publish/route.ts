import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api';

/**
 * PATCH /api/posts/[id]/publish
 * Переключение статуса публикации статьи
 * Требует прав администратора
 */
export async function PATCH(
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

    // Только администратор может публиковать/снимать с публикации
    if (sessionClaims?.metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient rights to publish articles' },
        { status: 403 }
      );
    }
    const { published } = await request.json();

    // Обновляем статус публикации
    await prisma.post.update({
      where: { id },
      data: {
        published,
        // Если публикуем - устанавливаем дату публикации, иначе null
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error changing publication status:', error);
    return NextResponse.json(
      { error: 'Failed to update article status' },
      { status: 500 }
    );
  }
}
