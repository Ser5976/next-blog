import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { getUserPosts } from '../../api';
import type { UserPostsResponse } from '../../model';
import { useUserPosts } from '../use-user-posts';

// Мокаем API функцию для тестирования
jest.mock('../../api', () => ({
  getUserPosts: jest.fn(),
}));

const mockedGetUserPosts = getUserPosts as jest.MockedFunction<
  typeof getUserPosts
>;

// Вспомогательная функция для создания обертки с QueryClientProvider
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Важно для тестов, чтобы не было задержек
        retryDelay: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useUserPosts', () => {
  // Подготавливаем тестовые данные
  const userId = 'user-123';

  const mockResponse: UserPostsResponse = {
    success: true,
    posts: [
      {
        id: 'post-1',
        title: 'Test Post 1',
        slug: 'test-post-1',
        content: 'Test content 1',
        excerpt: 'This is a test post',
        coverImage: 'https://example.com/image.jpg',
        published: true,
        authorId: 'user-123',
        author: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'author',
          imageUrl: 'https://example.com/avatar.jpg',
          createdAt: Date.now(),
          lastSignInAt: Date.now(),
        },
        categoryId: 'cat-1',
        category: {
          id: 'cat-1',
          name: 'Technology',
          slug: 'technology',
        },
        tags: [
          { id: 'tag-1', name: 'React', slug: 'react' },
          { id: 'tag-2', name: 'TypeScript', slug: 'typescript' },
        ],
        comments: [
          {
            id: 'comment-1',
            content: 'Great post!',
            likes: 10,
            dislikes: 0,
          },
        ],
        viewCount: 100,
        averageRating: 4.5,
        ratingCount: 10,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        publishedAt: Date.now(),
      },
      {
        id: 'post-2',
        title: 'Test Post 2',
        slug: 'test-post-2',
        content: 'Test content 2',
        excerpt: 'Another test post',
        coverImage: null,
        published: false,
        authorId: 'user-123',
        author: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'author',
          imageUrl: 'https://example.com/avatar.jpg',
          createdAt: Date.now(),
          lastSignInAt: Date.now(),
        },
        categoryId: null,
        category: null,
        tags: [{ id: 'tag-3', name: 'JavaScript', slug: 'javascript' }],
        comments: [
          {
            id: 'comment-2',
            content: 'Nice article!',
            likes: 5,
            dislikes: 1,
          },
        ],
        viewCount: 50,
        averageRating: 3.8,
        ratingCount: 5,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        publishedAt: null,
      },
    ],
    stats: {
      totalPosts: 2,
      publishedPosts: 1,
      totalViews: 150,
      averageRating: 4.15,
      totalRatings: 15,
    },
  };

  // Очищаем моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Тест 1: Успешное получение постов пользователя
  it('fetches user posts successfully', async () => {
    // Настраиваем мок для успешного ответа
    mockedGetUserPosts.mockResolvedValueOnce(mockResponse);

    // Рендерим хук с оберткой
    const { result } = renderHook(() => useUserPosts(userId), {
      wrapper: createWrapper(),
    });

    // Проверяем начальное состояние загрузки
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Ждем завершения запроса
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    // Проверяем, что API функция была вызвана с правильными аргументами
    expect(getUserPosts).toHaveBeenCalledTimes(1);
    expect(getUserPosts).toHaveBeenCalledWith(userId);

    // Проверяем, что данные правильно установлены
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.posts).toHaveLength(2);
    expect(result.current.data?.stats.totalPosts).toBe(2);
  });

  // Тест 2: Возвращает ошибку при неудачном запросе
  it('returns error when request fails', async () => {
    const errorMessage = 'Failed to fetch user posts';

    // Настраиваем мок для ошибки
    mockedGetUserPosts.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUserPosts(userId), {
      wrapper: createWrapper(),
    });

    // Ждем пока запрос не завершится с ошибкой
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );

    // Проверяем, что хук вернул ошибку
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(errorMessage);

    // Проверяем, что данные не установлены
    expect(result.current.data).toBeUndefined();
  });

  // Тест 3: Хук не выполняет запрос если userId не передан
  it('does not fetch when userId is empty', async () => {
    const { result } = renderHook(() => useUserPosts(''), {
      wrapper: createWrapper(),
    });

    // Хук должен быть отключен (enabled: false)
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);

    // API не должен быть вызван
    expect(getUserPosts).not.toHaveBeenCalled();
  });

  // Тест 4: Хук использует правильные настройки кэширования
  it('uses correct query keys for caching', async () => {
    mockedGetUserPosts.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUserPosts(userId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем, что хук использует правильный queryKey
    // (хотя мы не можем напрямую проверить queryKey внутри хука,
    // но можем убедиться что запрос выполнен)
    expect(getUserPosts).toHaveBeenCalledWith(userId);
  });

  // Тест 5: Хук правильно обрабатывает рефетч данных
  it('refetches data when refetch is called', async () => {
    mockedGetUserPosts.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUserPosts(userId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Вызываем рефетч
    result.current.refetch();

    // Проверяем, что API был вызван второй раз
    await waitFor(() => {
      expect(getUserPosts).toHaveBeenCalledTimes(2);
    });

    expect(result.current.isRefetching).toBe(false);
  });

  // Тест 6: Хук корректно работает с повторными запросами при ошибке
  it('retries on error according to retry settings', async () => {
    const errorMessage = 'Temporary error';
    mockedGetUserPosts.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUserPosts(userId), {
      wrapper: createWrapper(),
    });

    // Ждем завершения всех попыток (retry: 1 означает одна повторная попытка)
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 5000 }
    );

    // API должен быть вызван 2 раза (1 основной + 1 повторный)
    expect(getUserPosts).toHaveBeenCalledTimes(2);
  });

  // Тест 7: Проверяем, что хук возвращает правильную структуру данных
  it('returns data with correct structure', async () => {
    mockedGetUserPosts.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUserPosts(userId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем структуру возвращаемых данных
    expect(result.current.data).toHaveProperty('success');
    expect(result.current.data).toHaveProperty('posts');
    expect(result.current.data).toHaveProperty('stats');
    expect(Array.isArray(result.current.data?.posts)).toBe(true);

    // Проверяем структуру отдельного поста согласно типу Article
    if (result.current.data?.posts?.[0]) {
      const post = result.current.data.posts[0];
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('slug');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('published');
      expect(post).toHaveProperty('authorId');
      expect(post).toHaveProperty('category');
      expect(post).toHaveProperty('tags');
      expect(post).toHaveProperty('comments');
      expect(post).toHaveProperty('viewCount');
      expect(post).toHaveProperty('averageRating');
      expect(post).toHaveProperty('ratingCount');
      expect(post).toHaveProperty('createdAt');
      expect(post).toHaveProperty('updatedAt');
      expect(post).toHaveProperty('publishedAt');

      // Проверяем структуру автора (UserClerk)
      if (post.author) {
        expect(post.author).toHaveProperty('id');
        expect(post.author).toHaveProperty('email');
        expect(post.author).toHaveProperty('firstName');
        expect(post.author).toHaveProperty('lastName');
        expect(post.author).toHaveProperty('role');
        expect(post.author).toHaveProperty('imageUrl');
        expect(post.author).toHaveProperty('createdAt');
        expect(post.author).toHaveProperty('lastSignInAt');
      }

      // Проверяем вложенные структуры
      expect(Array.isArray(post.tags)).toBe(true);
      expect(Array.isArray(post.comments)).toBe(true);

      if (post.comments[0]) {
        expect(post.comments[0]).toHaveProperty('id');
        expect(post.comments[0]).toHaveProperty('content');
        expect(post.comments[0]).toHaveProperty('likes');
        expect(post.comments[0]).toHaveProperty('dislikes');
      }
    }
  });
});
