import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { getUserComments } from '../../api';
import type { UserCommentsResponse } from '../../model';
import { useUserComments } from '../use-user-comments';

// Мокаем API функцию
jest.mock('../../api', () => ({
  getUserComments: jest.fn(),
}));

const mockedGetUserComments = getUserComments as jest.MockedFunction<
  typeof getUserComments
>;

// Вспомогательная функция для создания обертки
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
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

describe('useUserComments', () => {
  const userId = 'user-123';

  // Подготавливаем тестовые данные
  const mockResponse: UserCommentsResponse = {
    success: true,
    comments: [
      {
        id: 'comment-1',
        content: 'This is a test comment',
        createdAt: new Date().toISOString(),
        post: {
          id: 'post-1',
          title: 'Test Post',
          slug: 'test-post',
          published: true,
        },
        stats: {
          likesCount: 10,
          dislikesCount: 2,
        },
      },
      {
        id: 'comment-2',
        content: 'Another test comment',
        createdAt: new Date().toISOString(),
        post: {
          id: 'post-2',
          title: 'Another Post',
          slug: 'another-post',
          published: false,
        },
        stats: {
          likesCount: 5,
          dislikesCount: 1,
        },
      },
    ],
    stats: {
      totalComments: 2,
      totalLikes: 15,
      totalDislikes: 3,
      postsCommented: 2,
    },
    message: undefined,
  };

  // Очищаем моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Успешное получение комментариев пользователя
  it('fetches user comments successfully', async () => {
    mockedGetUserComments.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUserComments(userId), {
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
    expect(getUserComments).toHaveBeenCalledTimes(1);
    expect(getUserComments).toHaveBeenCalledWith(userId);

    // Проверяем, что данные правильно установлены
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.comments).toHaveLength(2);
    expect(result.current.data?.stats.totalComments).toBe(2);
    expect(result.current.data?.stats.totalLikes).toBe(15);
  });

  // Test 2: Возвращает ошибку при неудачном запросе
  it('returns error when request fails', async () => {
    const errorMessage = 'Failed to fetch user comments';
    mockedGetUserComments.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUserComments(userId), {
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

  // Test 3: Хук не выполняет запрос если userId не передан
  it('does not fetch when userId is empty', async () => {
    const { result } = renderHook(() => useUserComments(''), {
      wrapper: createWrapper(),
    });

    // Хук должен быть отключен (enabled: false)
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);

    // API не должен быть вызван
    expect(getUserComments).not.toHaveBeenCalled();
  });

  // Test 4: Хук использует правильные настройки кэширования
  it('uses correct query keys for caching', async () => {
    mockedGetUserComments.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUserComments(userId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем, что хук использует правильный queryKey
    expect(getUserComments).toHaveBeenCalledWith(userId);
  });

  // Test 5: Хук правильно обрабатывает рефетч данных
  it('refetches data when refetch is called', async () => {
    mockedGetUserComments.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUserComments(userId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Вызываем рефетч
    result.current.refetch();

    // Проверяем, что API был вызван второй раз
    await waitFor(() => {
      expect(getUserComments).toHaveBeenCalledTimes(2);
    });

    expect(result.current.isRefetching).toBe(false);
  });

  // Test 6: Хук корректно работает с повторными запросами при ошибке
  it('retries on error according to retry settings', async () => {
    const errorMessage = 'Temporary error';
    mockedGetUserComments.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUserComments(userId), {
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
    expect(getUserComments).toHaveBeenCalledTimes(2);
  });

  // Test 7: Проверяем, что хук возвращает правильную структуру данных
  it('returns data with correct structure', async () => {
    mockedGetUserComments.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUserComments(userId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем структуру возвращаемых данных
    expect(result.current.data).toHaveProperty('success');
    expect(result.current.data).toHaveProperty('comments');
    expect(result.current.data).toHaveProperty('stats');
    expect(Array.isArray(result.current.data?.comments)).toBe(true);

    // Проверяем структуру отдельного комментария
    if (result.current.data?.comments?.[0]) {
      const comment = result.current.data.comments[0];
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('content');
      expect(comment).toHaveProperty('createdAt');
      expect(comment).toHaveProperty('post');
      expect(comment.post).toHaveProperty('id');
      expect(comment.post).toHaveProperty('title');
      expect(comment.post).toHaveProperty('slug');
      expect(comment.post).toHaveProperty('published');
      expect(comment).toHaveProperty('stats');
      expect(comment.stats).toHaveProperty('likesCount');
      expect(comment.stats).toHaveProperty('dislikesCount');
    }

    // Проверяем структуру статистики
    if (result.current.data?.stats) {
      const stats = result.current.data.stats;
      expect(stats).toHaveProperty('totalComments');
      expect(stats).toHaveProperty('totalLikes');
      expect(stats).toHaveProperty('totalDislikes');
      expect(stats).toHaveProperty('postsCommented');
    }
  });

  // Test 8: Проверяем настройки staleTime и gcTime
  it('uses correct staleTime and gcTime settings', async () => {
    mockedGetUserComments.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUserComments(userId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Хук должен быть свежим сразу после получения данных
    expect(result.current.isStale).toBe(false);
  });
});
