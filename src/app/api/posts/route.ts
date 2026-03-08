import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api';
import { Article, UserClerk } from '@/shared/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      tag: searchParams.get('tag') || undefined,
      published:
        searchParams.get('published') === 'true'
          ? true
          : searchParams.get('published') === 'false'
            ? false
            : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    };

    const {
      page = 1,
      limit = 10,
      search,
      category,
      tag,
      published,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // Построение where условия
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      whereClause.category = {
        slug: category,
      };
    }

    if (tag) {
      whereClause.tags = {
        some: {
          slug: tag,
        },
      };
    }

    if (published !== undefined) {
      whereClause.published = published;
    }

    // Получаем общее количество
    const total = await prisma.post.count({
      where: whereClause,
    });

    // Получаем статьи
    const posts = await prisma.post.findMany({
      where: whereClause,
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
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Получаем информацию об авторах из Clerk
    const authorIds = posts
      .map((p) => p.author?.clerkId)
      .filter((id): id is string => id !== null && id !== undefined);

    const uniqueAuthorIds = [...new Set(authorIds)];

    const authorMap = new Map<string, UserClerk>();

    if (uniqueAuthorIds.length > 0) {
      const client = await clerkClient();

      const clerkUsers = await client.users.getUserList({
        userId: uniqueAuthorIds,
      });

      clerkUsers.data.forEach((clerkUser) => {
        authorMap.set(clerkUser.id, {
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          role: (clerkUser.publicMetadata?.role as string) || 'user',
          imageUrl: clerkUser.imageUrl,
          createdAt: clerkUser.createdAt,
          lastSignInAt: clerkUser.lastSignInAt,
        });
      });
    }

    // Форматируем статьи
    const articles: Article[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      published: post.published,
      authorId: post.authorId,
      author: post.author?.clerkId ? authorMap.get(post.author.clerkId) : null,
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

    const totalPages = Math.ceil(total / limit);

    const result = {
      success: true,
      articles,
      total,
      page,
      totalPages,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/dashboard/articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
