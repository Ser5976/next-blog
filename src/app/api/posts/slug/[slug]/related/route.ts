import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/shared/api/prisma';

/**
 * Получение похожих статей по тегам и категории
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3');

    // Получаем текущую статью
    const currentPost = await prisma.post.findUnique({
      where: { slug },
      include: {
        tags: { select: { id: true } },
        category: { select: { id: true } },
      },
    });

    if (!currentPost) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const tagIds = currentPost.tags.map((tag) => tag.id);
    const categoryId = currentPost.category?.id;

    // Ищем похожие статьи
    const relatedPosts = await prisma.post.findMany({
      where: {
        id: { not: currentPost.id },
        published: true,
        OR: [
          ...(categoryId ? [{ categoryId }] : []),
          ...(tagIds.length > 0
            ? [{ tags: { some: { id: { in: tagIds } } } }]
            : []),
        ],
      },
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
      orderBy: [
        {
          // Сначала статьи с совпадающей категорией
          categoryId: categoryId ? 'asc' : undefined,
        },
        {
          // Затем по количеству совпадающих тегов
          // TODO: можно добавить более сложную сортировку
          createdAt: 'desc',
        },
      ],
      take: limit,
    });

    return NextResponse.json(relatedPosts);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return NextResponse.json(
      { error: 'Failed to load related articles' },
      { status: 500 }
    );
  }
}
