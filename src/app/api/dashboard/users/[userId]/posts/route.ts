import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Проверяем существование пользователя
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(params.userId);

    if (!clerkUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Ищем пользователя в базе по clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: params.userId },
    });

    if (!dbUser) {
      return NextResponse.json({
        success: true,
        posts: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      });
    }

    // Получаем посты пользователя
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: dbUser.id },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          published: true,
          viewCount: true,
          averageRating: true,
          ratingCount: true,
          createdAt: true,
          publishedAt: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: { authorId: dbUser.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to fetch user posts',
      },
      { status: 500 }
    );
  }
}
