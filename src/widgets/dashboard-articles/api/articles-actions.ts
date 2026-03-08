'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import slugify from 'slugify';

import { prisma } from '@/shared/api';
import { Article, UserClerk } from '@/shared/types';
import {
  ApiResponse,
  ArticleFormValues,
  ArticlesFilters,
  ArticlesResponse,
} from '../model';

export async function getArticlesAction(
  filters: ArticlesFilters
): Promise<ArticlesResponse> {
  try {
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to view articles');
    }

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

    return {
      success: true,
      articles,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error('Error getting articles:', error);
    return {
      success: false,
      articles: [],
      total: 0,
      page: 1,
      totalPages: 0,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

export async function createArticleAction(
  data: ArticleFormValues
): Promise<ApiResponse> {
  try {
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (
      sessionClaims?.metadata?.role !== 'admin' &&
      sessionClaims?.metadata?.role !== 'author'
    ) {
      throw new Error('Insufficient rights to create articles');
    }

    // Находим пользователя в БД
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: currentUserId },
    });

    if (!dbUser) {
      throw new Error('User not found in database');
    }

    // Генерируем slug из title, если не указан
    const slug =
      data.slug || slugify(data.title, { lower: true, strict: true });

    // Создаем статью
    await prisma.post.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        published: data.published,
        authorId: dbUser.id,
        categoryId: data.categoryId,
        tags: {
          connect: data.tags.map((tagId) => ({ id: tagId })),
        },
        publishedAt: data.published ? new Date() : null,
      },
      include: {
        category: true,
        tags: true,
      },
    });

    return {
      success: true,
      message: 'the article has been created',
    };
  } catch (error) {
    console.error('Error creating article:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to create article',
    };
  }
}

export async function updateArticleAction(
  id: string,
  data: ArticleFormValues
): Promise<ApiResponse> {
  try {
    const { sessionClaims } = await auth();

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to update articles');
    }

    const slug =
      data.slug || slugify(data.title, { lower: true, strict: true });

    await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        published: data.published,
        categoryId: data.categoryId,
        tags: {
          set: data.tags.map((tagId) => ({ id: tagId })),
        },
        publishedAt: data.published ? new Date() : null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating article:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to update article',
    };
  }
}

export async function deleteArticleAction(id: string): Promise<ApiResponse> {
  try {
    const { sessionClaims } = await auth();

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to delete articles');
    }

    await prisma.post.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting article:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to delete article',
    };
  }
}

export async function togglePublishArticleAction(
  id: string,
  published: boolean
): Promise<ApiResponse> {
  try {
    const { sessionClaims } = await auth();

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to publish articles');
    }

    await prisma.post.update({
      where: { id },
      data: {
        published,
        publishedAt: published ? new Date() : null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error toggling article publish status:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to update article',
    };
  }
}

export async function getCategoriesAction() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    console.log('работает getCategoriesAction: ', categories);
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export async function getTagsAction() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
    return tags;
  } catch (error) {
    console.error('Error getting tags:', error);
    return [];
  }
}
