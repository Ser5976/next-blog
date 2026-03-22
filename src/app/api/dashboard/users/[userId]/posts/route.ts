import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    // Проверяем авторизацию и роль
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to view users');
    }

    // Проверяем существование пользователя
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    if (!clerkUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Ищем пользователя в базе по clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!dbUser) {
      // Если пользователя нет в базе, возвращаем пустой результат
      return NextResponse.json({
        success: true,
        posts: [],
        totalPages: 0,
        stats: {
          totalPosts: 0,
          publishedPosts: 0,
          draftPosts: 0,
          totalViews: 0,
          averageRating: 0,
          totalRatings: 0,
        },
      });
    }

    // Получаем посты пользователя
    const posts = await prisma.post.findMany({
      where: { authorId: dbUser.id },
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
            content: true,
            _count: {
              select: {
                likes: true,
                dislikes: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // console.log('post:', posts);

    // Получаем общую статистику по постам пользователя
    const [publishedPosts, viewStats, ratingStats, averageRating] =
      await Promise.all([
        // Опубликованные посты
        prisma.post.count({
          where: {
            authorId: dbUser.id,
            published: true,
          },
        }),

        // Общее количество просмотров
        prisma.post.aggregate({
          where: { authorId: dbUser.id },
          _sum: {
            viewCount: true,
          },
        }),
        // Общее количество оценок
        prisma.post.aggregate({
          where: { authorId: dbUser.id },
          _sum: {
            ratingCount: true,
          },
        }),
        // Средний рейтинг
        prisma.post.aggregate({
          where: {
            authorId: dbUser.id,
            averageRating: { not: null },
          },
          _avg: {
            averageRating: true,
          },
        }),
      ]);

    // Форматируем данные
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      published: post.published,
      categoryId: post.categoryId,
      category: post.category,
      tags: post.tags,
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        likes: comment._count.likes,
        dislikes: comment._count.dislikes,
      })),
      viewCount: post.viewCount,
      averageRating: post.averageRating,
      ratingCount: post.ratingCount,
      createdAt: post.createdAt ? new Date(post.createdAt).getTime() : null,
      updatedAt: post.updatedAt ? new Date(post.updatedAt).getTime() : null,
      publishedAt: post.publishedAt
        ? new Date(post.publishedAt).getTime()
        : null,
    }));

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      stats: {
        totalPosts: posts.length,
        publishedPosts,
        totalViews: viewStats._sum.viewCount || 0,
        averageRating: averageRating._avg.averageRating || 0,
        totalRatings: ratingStats._sum.ratingCount || 0,
      },
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
