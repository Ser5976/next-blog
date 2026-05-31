import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/shared/api/prisma';

/**
 
 * Получение конкретной статьи по slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Ищем статью с включением связанных данных
    const post = await prisma.post.findUnique({
      where: { slug },
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
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error retrieving article:', error);
    return NextResponse.json(
      { error: 'Failed to load article' },
      { status: 500 }
    );
  }
}
