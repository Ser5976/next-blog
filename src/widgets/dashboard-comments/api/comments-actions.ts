'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

import { User } from '@/features/user-profile-info';
import { prisma } from '@/shared/api';
import { CommentsFilters, CommentsResponse, DashboardComment } from '../model';

export async function getCommentsAction(
  filters: CommentsFilters
): Promise<CommentsResponse> {
  try {
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (sessionClaims?.metadata?.role !== 'admin') {
      throw new Error('Insufficient rights to view comments');
    }

    const { page = 1, limit = 10, search } = filters;

    // 1. Сначала получаем найденых пользователей из Clerk
    let authorIdsForSearch: string[] | undefined;
    const hasSearch = search && search.trim();
    const searchTerm = hasSearch ? search.trim().toLowerCase() : undefined;

    // Ищем пользователей в Clerk по email или имени
    if (hasSearch && searchTerm) {
      const client = await clerkClient();

      // Получаем  пользователей с поиском по email или имени
      const matchingClerkUsers = await client.users
        .getUserList({
          query: searchTerm,
        })
        .then((response) => response.data);

      // Получаем clerkId подходящих пользователей
      const matchingClerkIds = matchingClerkUsers.map((user) => user.id);

      // Находим соответствующие ID в нашей БД
      if (matchingClerkIds.length > 0) {
        const dbUsers = await prisma.user.findMany({
          where: {
            clerkId: {
              in: matchingClerkIds,
            },
          },
          select: {
            id: true,
          },
        });
        authorIdsForSearch = dbUsers.map((u) => u.id);
      } else {
        authorIdsForSearch = []; // Нет подходящих пользователей
      }
    }

    // 2. Строим условие WHERE для Prisma
    const whereClause: any = {};

    if (hasSearch && searchTerm) {
      whereClause.OR = [];

      // Поиск по содержимому комментария
      whereClause.OR.push({
        content: { contains: searchTerm, mode: 'insensitive' },
      });

      // Поиск по заголовку поста
      whereClause.OR.push({
        post: {
          title: { contains: searchTerm, mode: 'insensitive' },
        },
      });

      // Поиск по автору (если нашли подходящих пользователей)
      if (authorIdsForSearch && authorIdsForSearch.length > 0) {
        whereClause.OR.push({
          authorId: {
            in: authorIdsForSearch,
          },
        });
      }
    }

    // 3. Получаем общее количество комментариев, соответствующих условиям
    const total = await prisma.comment.count({
      where: whereClause,
    });

    // 4. Получаем комментарии с пагинацией
    const comments = await prisma.comment.findMany({
      where: whereClause,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
            published: true,
          },
        },
        _count: {
          select: {
            likes: true,
            dislikes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // 5. Получаем информацию об авторах из Clerk
    // .filter() - оставляем только не-null значения
    // (id): id is string - type guard, говорим TypeScript что id теперь точно string
    const userIds = comments
      .map((c) => c.authorId)
      .filter((id): id is string => id !== null);

    // Set - специальная структура данных, хранит только уникальные значения
    // new Set(userIds) - создаем Set из массива userIds (дубликаты удаляются)
    // [...set] - оператор spread, превращает Set обратно в массив
    // В итоге получаем массив уникальных ID
    const uniqueUserIds = [...new Set(userIds)];

    // Создаем маппинг для пользователей
    // Map - структура данных для хранения пар ключ-значение
    // <string, User> - ключ будет строкой, значение - объектом User
    const dbIdToUserMap = new Map<string, User>();

    if (uniqueUserIds.length > 0) {
      // Получаем пользователей из БД чтобы найти clerkId
      const dbUsers = await prisma.user.findMany({
        where: { id: { in: uniqueUserIds } },
        select: { id: true, clerkId: true },
      });

      // Создаем новую Map для связи БД ID с clerkId
      const dbIdToClerkId = new Map<string, string>();
      dbUsers.forEach((user) => {
        dbIdToClerkId.set(user.id, user.clerkId);
        // .set(key, value) - добавляет пару ключ-значение в Map
        // Теперь по БД ID можно быстро получить clerkId
      });

      // Получаем информацию из Clerk
      const client = await clerkClient();

      const clerkIds = dbUsers.map((u) => u.clerkId).filter(Boolean);
      // .filter(Boolean) - удаляет все falsy значения (null, undefined, false, 0, '')
      // Оставляем только существующие clerkId

      if (clerkIds.length > 0) {
        const clerkUsersPromises = clerkIds.map(async (clerkId) => {
          // .map() создает массив промисов (обещаний)
          // async - функция возвращает Promise
          try {
            // Получаем данные пользователя из Clerk по его clerkId
            const clerkUser = await client.users.getUser(clerkId);

            const user: User = {
              id: clerkUser.id,
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
              firstName: clerkUser.firstName || null,
              lastName: clerkUser.lastName || null,
              role: (clerkUser.publicMetadata?.role as string) || 'user',
              imageUrl: clerkUser.imageUrl,
              createdAt: clerkUser.createdAt,
              lastSignInAt: clerkUser.lastSignInAt,
            };
            return { clerkId, user }; // Возвращаем объект с clerkId и данными пользователя
          } catch {
            return null;
          }
        });
        // Создаем Map для быстрого доступа к пользователям по clerkId
        const clerkUsersResults = await Promise.all(clerkUsersPromises);

        // Создаем временную мапу clerkId -> User
        const clerkUsersMap = new Map<string, User>();
        clerkUsersResults.forEach((result) => {
          if (result) {
            clerkUsersMap.set(result.clerkId, result.user);
            // Сохраняем пользователя в Map по clerkId
          }
        });

        // Создаем маппинг БД ID -> User
        dbUsers.forEach((dbUser) => {
          // Для каждого пользователя из нашей БД
          const clerkUser = clerkUsersMap.get(dbUser.clerkId);
          // .get(key) - получаем значение из Map по ключу (clerkId)
          if (clerkUser) {
            dbIdToUserMap.set(dbUser.id, clerkUser);
            // Сохраняем пользователя в Map по БД ID
          }
        });
      }
    }

    // 6. Форматируем комментарии
    const formattedComments: DashboardComment[] = comments.map((comment) => {
      const author = comment.authorId
        ? dbIdToUserMap.get(comment.authorId) || null
        : null;

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt
          ? new Date(comment.createdAt).getTime()
          : null,
        updatedAt: comment.updatedAt
          ? new Date(comment.updatedAt).getTime()
          : null,
        author,
        post: {
          id: comment.post.id,
          title: comment.post.title,
          slug: comment.post.slug,
          published: comment.post.published,
        },
        stats: {
          likesCount: comment._count.likes,
          dislikesCount: comment._count.dislikes,
        },
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      comments: formattedComments,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error('Error getting comments:', error);
    return {
      success: false,
      comments: [],
      total: 0,
      page: 1,
      totalPages: 0,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}
