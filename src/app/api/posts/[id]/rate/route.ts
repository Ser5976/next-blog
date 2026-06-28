import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';

/**
 * POST: Поставить или изменить оценку статьи
 * - Если оценки нет - создает новую
 * - Если оценка есть - обновляет её
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId: clerkId } = await auth();
    const body = await request.json();

    const value = body.rating;

    // 1. Проверка авторизации
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to rate.' },
        { status: 401 }
      );
    }

    // 2. Валидация значения рейтинга
    if (!value || typeof value !== 'number' || value < 1 || value > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    // 3. Находим пост и пользователя параллельно
    const [post, user] = await Promise.all([
      prisma.post.findUnique({
        where: { id },
        select: { id: true, averageRating: true, ratingCount: true },
      }),
      prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
      }),
    ]);

    // 4. Проверяем существование поста
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // 5. Проверяем существование пользователя в БД
    if (!user) {
      return NextResponse.json(
        { error: 'User profile not found. Please complete registration.' },
        { status: 404 }
      );
    }

    // 6. Проверяем, есть ли уже оценка от этого пользователя
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: post.id,
        },
      },
      select: { value: true, id: true },
    });

    let newAverage: number;
    let newCount: number;
    let action: 'created' | 'updated';
    const currentAverage = post.averageRating ?? 0;

    // 7. Логика обновления статистики
    if (existingRating) {
      // Обновляем существующую оценку
      const oldValue = existingRating.value;

      // Пересчитываем общую сумму оценок

      const totalScore = currentAverage * post.ratingCount - oldValue + value;
      newCount = post.ratingCount;
      newAverage = totalScore / newCount;
      action = 'updated';

      // Обновляем оценку и пост в транзакции
      await prisma.$transaction([
        prisma.rating.update({
          where: { id: existingRating.id },
          data: { value },
        }),
        prisma.post.update({
          where: { id: post.id },
          data: {
            averageRating: newAverage,
            ratingCount: newCount,
          },
        }),
      ]);
    } else {
      // Создаем новую оценку
      const totalScore = currentAverage * post.ratingCount + value;
      newCount = post.ratingCount + 1;
      newAverage = totalScore / newCount;
      action = 'created';

      // Создаем оценку и обновляем пост в транзакции
      await prisma.$transaction([
        prisma.rating.create({
          data: {
            value,
            userId: user.id,
            postId: post.id,
          },
        }),
        prisma.post.update({
          where: { id: post.id },
          data: {
            averageRating: newAverage,
            ratingCount: newCount,
          },
        }),
      ]);
    }

    // 8. Возвращаем результат
    return NextResponse.json({
      success: true,
      action,
      userRating: value,
      averageRating: newAverage,
      ratingCount: newCount,
      message:
        action === 'created'
          ? 'Rating added successfully'
          : 'Rating updated successfully',
    });
  } catch (error) {
    console.error('Error saving rating:', error);
    return NextResponse.json(
      { error: 'Failed to save rating. Please try again.' },
      { status: 500 }
    );
  }
}
