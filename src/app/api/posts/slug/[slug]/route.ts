import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';
import { UserClerk } from '@/shared/types';

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
    const postResponse = await prisma.post.findUnique({
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
        comments: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!postResponse) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Получаем автора, если он существует
    let author: UserClerk | null = null;
    const clerkId = postResponse.author?.clerkId;

    if (clerkId) {
      try {
        const client = await clerkClient();
        const userResponse = await client.users.getUser(clerkId);

        author = {
          id: userResponse.id,
          email: userResponse.emailAddresses[0]?.emailAddress || '',
          firstName: userResponse.firstName || null,
          lastName: userResponse.lastName || null,
          role: (userResponse.publicMetadata?.role as string) || 'user',
          imageUrl: userResponse.imageUrl,
          createdAt: userResponse.createdAt,
          lastSignInAt: userResponse.lastSignInAt,
        };
      } catch (error) {
        // Если пользователь не найден в Clerk, просто оставляем author = null
        console.warn(`User with clerkId ${clerkId} not found in Clerk:`, error);
        author = null;
      }
    }

    // Формируем итоговый объект статьи
    const post = { ...postResponse, author };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error retrieving article:', error);
    return NextResponse.json(
      { error: 'Failed to load article' },
      { status: 500 }
    );
  }
}
