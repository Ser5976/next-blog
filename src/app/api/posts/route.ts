import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';
import { articleFormSchema } from '@/shared/schemas';
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

/**
 * Создание новой статьи
 * Требует прав администратора или автора
 */

export async function POST(request: NextRequest) {
  try {
    // Получаем ID текущего пользователя и его claims из Clerk
    const { userId: currentUserId, sessionClaims } = await auth();

    // Парсим тело запроса
    const body = await request.json();

    // Проверка авторизации
    if (!currentUserId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    // Проверка прав (только admin или author могут создавать статьи)
    if (
      sessionClaims?.metadata?.role !== 'admin' &&
      sessionClaims?.metadata?.role !== 'author'
    ) {
      return NextResponse.json(
        { error: 'Insufficient rights to create articles' },
        { status: 403 }
      );
    }

    // валидация body при помощи zod
    const { data, success, error } = articleFormSchema.safeParse(body.data);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error,
        },
        { status: 400 }
      );
    }

    // Находим пользователя в нашей базе данных по clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: currentUserId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Проверка уникальности slug
    const existingPost = await prisma.post.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'SLUG_ALREADY_EXISTS',
          message: `An article with the slug "${data.slug}" already exists. Please choose a different slug.`,
          field: 'slug',
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Создаем статью в базе данных
    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        published: false, // Всегда создаем как черновик
        authorId: dbUser.id,
        categoryId: data.categoryId || null,
        // Связываем с тегами (connect - потому что теги уже существуют)
        tags: {
          connect: data.tags.map((tagId: string) => ({ id: tagId })),
        },
      },
      include: {
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

    // Возвращаем успешный ответ с созданной статьей
    return NextResponse.json({
      success: true,
      message: 'The article has been created successfully',
      data: newPost,
    });
  } catch (error) {
    console.error('Error creating article:', error);

    // Проверка на ошибку уникальности slug (на случай, если проверка пропустила)
    if (error instanceof Error && error.message.includes('slug')) {
      return NextResponse.json(
        {
          success: false,
          error: 'SLUG_ALREADY_EXISTS',
          message:
            'An article with this slug already exists. Please choose a different slug.',
          field: 'slug',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message:
          error instanceof Error ? error.message : 'Failed to create article',
      },
      { status: 500 }
    );
  }
}
