import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'sonner';

import { deleteUserPost } from '../../api';
import { useUserPostDelete } from '../use-user-post-delete';
import { userPostsQueryKeys } from '../use-user-posts';

// Мокаем зависимости
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Правильно мокаем API функцию удаления поста
jest.mock('../../api', () => ({
  deleteUserPost: jest.fn(),
}));

const mockedDeleteUserPost = deleteUserPost as jest.MockedFunction<
  typeof deleteUserPost
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('useUserPostDelete', () => {
  const mockPostId = 'post_1';

  // Мок данных для постов в кэше - правильная структура
  const mockPostsData = {
    success: true,
    posts: [
      {
        id: 'post_1',
        title: 'First Post',
        slug: 'first-post',
        excerpt: 'This is the first post',
        coverImage: 'image1.jpg',
        published: true,
        viewCount: 100,
        averageRating: 4.5,
        ratingCount: 10,
        createdAt: '2023-01-01',
        publishedAt: '2023-01-02',
        category: {
          id: 'cat_1',
          name: 'Technology',
        },
        tags: [
          { id: 'tag_1', name: 'React' },
          { id: 'tag_2', name: 'TypeScript' },
        ],
        stats: {
          commentsCount: 5,
        },
      },
      {
        id: 'post_2',
        title: 'Second Post',
        slug: 'second-post',
        excerpt: 'This is the second post',
        coverImage: 'image2.jpg',
        published: false,
        viewCount: 50,
        averageRating: 4.0,
        ratingCount: 5,
        createdAt: '2023-01-03',
        publishedAt: null,
        category: null,
        tags: [{ id: 'tag_3', name: 'JavaScript' }],
        stats: {
          commentsCount: 2,
        },
      },
    ],
    stats: {
      totalPosts: 2,
      publishedPosts: 1,
      totalViews: 150,
      averageRating: 4.3,
      totalRatings: 15,
    },
    message: undefined,
  };

  // Мок ответа от API при успешном удалении
  const mockApiResponse = {
    message: 'Post deleted successfully',
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    // Создаем новый QueryClient перед каждым тестом
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false }, // Отключаем повторные попытки для тестов
      },
    });

    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();

    // Устанавливаем тестовые данные в кэш QueryClient
    queryClient.setQueryData(userPostsQueryKeys.all, mockPostsData);
  });

  // Создаем обертку для провайдеров
  const createWrapper = () => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };
  };

  // Test 1: Basic API call
  it('should call API with correct postId and return success response', async () => {
    // Проверяем базовый сценарий работы хука - успешный вызов API с правильными параметрами
    mockedDeleteUserPost.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserPostDelete(), {
      wrapper: createWrapper(),
    });

    let response: typeof mockApiResponse;

    await act(async () => {
      response = await result.current.mutateAsync(mockPostId);
    });

    expect(mockedDeleteUserPost).toHaveBeenCalledTimes(1);
    const [receivedPostId] = mockedDeleteUserPost.mock.calls[0];
    expect(receivedPostId).toBe(mockPostId);
    expect(response!).toEqual(mockApiResponse);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  // Test 2: Optimistic update
  it('should optimistically remove post from cache before API resolves', async () => {
    //  Проверяем оптимистичное обновление - пост должен удалиться из UI до получения ответа от сервера
    let resolvePromise!: (value: typeof mockApiResponse) => void;

    const promise = new Promise<typeof mockApiResponse>((resolve) => {
      resolvePromise = resolve;
    });

    mockedDeleteUserPost.mockImplementation(() => promise);

    const { result } = renderHook(() => useUserPostDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(mockPostId);
      await new Promise((r) => setTimeout(r, 0));
    });

    // Проверяем оптимистичное обновление
    const cachedData = queryClient.getQueryData<{ posts: any[] }>(
      userPostsQueryKeys.all
    );

    // Должно остаться 1 пост (было 2, удалили 1)
    expect(cachedData?.posts).toHaveLength(1);
    // Удаленный пост не должен находиться в кэше
    expect(cachedData?.posts.find((p) => p.id === mockPostId)).toBeUndefined();

    // Разрешаем промис (имитируем успешный ответ от API)
    await act(async () => {
      resolvePromise(mockApiResponse);
      await new Promise((r) => setTimeout(r, 0));
    });

    // Ждем завершения мутации
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  // Test 3: Success side effects
  it('should show success toast on successful deletion', async () => {
    // Комментарий: Проверяем side effects при успешном удалении - должен показаться toast с сообщением об успехе
    mockedDeleteUserPost.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserPostDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(mockPostId);
    });

    expect(mockedToast.success).toHaveBeenCalledWith(
      'User deleted successfully'
    );
  });

  // Test 4: Rollback on error
  it('should rollback optimistic update and show error toast when API fails', async () => {
    // Проверяем rollback оптимистичного обновления при ошибке API и показ toast с ошибкой
    const mockError = new Error('Failed to delete post');

    let rejectPromise!: (reason?: unknown) => void;

    const promise = new Promise<never>((_, reject) => {
      rejectPromise = reject;
    });

    mockedDeleteUserPost.mockImplementation(() => promise);

    const { result } = renderHook(() => useUserPostDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(mockPostId);
      await new Promise((r) => setTimeout(r, 0));
    });

    // Проверяем оптимистичное удаление - должен остаться 1 пост
    let cachedData = queryClient.getQueryData<{ posts: any[] }>(
      userPostsQueryKeys.all
    );
    expect(cachedData?.posts).toHaveLength(1);

    // Отклоняем промис (имитируем ошибку API)
    await act(async () => {
      rejectPromise(mockError);
      await new Promise((r) => setTimeout(r, 0));
    });

    // Ждем ошибки
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Проверяем, что данные были восстановлены (откат оптимистичного обновления)
    // Должно быть 2 поста снова
    cachedData = queryClient.getQueryData<{ posts: any[] }>(
      userPostsQueryKeys.all
    );
    expect(cachedData?.posts).toHaveLength(2);

    // Проверяем, что был показан toast с ошибкой
    expect(mockedToast.error).toHaveBeenCalledWith(mockError.message);
  });

  // Test 5: Mutation states
  it('should correctly update mutation states', async () => {
    //  Проверяем корректное обновление состояний мутации (pending, success)
    let resolvePromise!: (value: typeof mockApiResponse) => void;

    const promise = new Promise<typeof mockApiResponse>((resolve) => {
      resolvePromise = resolve;
    });

    mockedDeleteUserPost.mockImplementation(() => promise);

    const { result } = renderHook(() => useUserPostDelete(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    act(() => {
      result.current.mutate(mockPostId);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await act(async () => {
      resolvePromise(mockApiResponse);
      await new Promise((r) => setTimeout(r, 0));
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isPending).toBe(false);
    });
  });

  // Test 6: Empty cache safety
  it('should not crash when cache is empty', async () => {
    //  Проверяем что хук не падает при пустом кэше (граничный случай)
    queryClient.clear();
    mockedDeleteUserPost.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserPostDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(result.current.mutateAsync(mockPostId)).resolves.toEqual(
        mockApiResponse
      );
    });

    expect(mockedToast.success).toHaveBeenCalled();
  });

  // Test 7: Toast messages verification
  it('should show correct toast message on success', async () => {
    // Проверяем корректность сообщения в toast при успешном удалении
    mockedDeleteUserPost.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserPostDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(mockPostId);
    });

    expect(mockedToast.success).toHaveBeenCalledTimes(1);
    expect(mockedToast.success).toHaveBeenCalledWith(
      'User deleted successfully'
    );
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  // Test 8: Error toast verification
  it('should show correct toast message on error', async () => {
    //  Проверяем корректность сообщения в toast при ошибке удаления
    const errorMessage = 'Failed to delete post';
    mockedDeleteUserPost.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUserPostDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(mockPostId);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockedToast.error).toHaveBeenCalledTimes(1);
    expect(mockedToast.error).toHaveBeenCalledWith(errorMessage);
    expect(mockedToast.success).not.toHaveBeenCalled();
  });

  // Test 9: Verify cache structure
  it('should have correct cache structure', async () => {
    //  Проверяем структуру данных в кэше перед тестами
    const cachedData = queryClient.getQueryData(userPostsQueryKeys.all);
    expect(cachedData).toHaveProperty('success');
    expect(cachedData).toHaveProperty('posts');
    expect(cachedData).toHaveProperty('stats');
    expect(Array.isArray((cachedData as any).posts)).toBe(true);
  });
});
