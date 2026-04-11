import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/shared/api/prisma';

/**
 * Увеличение счетчика просмотров статьи
 * Не требует авторизации - вызывается при каждом просмотре страницы
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Увеличиваем счетчик просмотров на 1
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        viewCount: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error incrementing view counter:', error);
    return NextResponse.json(
      { error: 'Failed to increase view counter' },
      { status: 500 }
    );
  }
}
