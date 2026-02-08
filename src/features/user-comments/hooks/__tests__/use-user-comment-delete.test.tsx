import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'sonner';

import { deleteUserComment } from '../../api';
import { useUserCommentDelete } from '../use-user-comment-delete';
import { userCommentsQueryKeys } from '../use-user-comments';

// Мокаем зависимости
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../api', () => ({
  deleteUserComment: jest.fn(),
}));

jest.mock('../use-user-comments', () => ({
  userCommentsQueryKeys: {
    all: ['user-comments'],
  },
}));

const mockedDeleteUserComment = deleteUserComment as jest.MockedFunction<
  typeof deleteUserComment
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('useUserCommentDelete', () => {
  const mockCommentId = 'comment_1';

  // Подготавливаем тестовые данные для кэша
  const mockPreviousData = {
    comments: [
      {
        id: 'comment_1',
        content: 'Comment to delete',
        createdAt: '2023-01-01',
        post: {
          id: 'post-1',
          title: 'Test Post',
          slug: 'test-post',
          published: true,
        },
        stats: {
          likesCount: 5,
          dislikesCount: 1,
        },
      },
      {
        id: 'comment_2',
        content: 'Another comment',
        createdAt: '2023-01-02',
        post: {
          id: 'post-2',
          title: 'Another Post',
          slug: 'another-post',
          published: false,
        },
        stats: {
          likesCount: 3,
          dislikesCount: 0,
        },
      },
    ],
    stats: {
      totalComments: 2,
      totalLikes: 8,
      totalDislikes: 1,
      postsCommented: 2,
    },
    success: true,
  };

  const mockApiResponse = {
    success: true,
    message: 'Comment deleted successfully',
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    jest.clearAllMocks();

    queryClient.setQueryData(userCommentsQueryKeys.all, mockPreviousData);
  });

  const createWrapper = () => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };
  };

  // 1. Базовый тест
  it('should call API with correct commentId and return success response', async () => {
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserCommentDelete(), {
      wrapper: createWrapper(),
    });

    let response: typeof mockApiResponse;

    await act(async () => {
      response = await result.current.mutateAsync({ commentId: mockCommentId });
    });

    expect(mockedDeleteUserComment).toHaveBeenCalledTimes(1);
    expect(mockedDeleteUserComment).toHaveBeenCalledWith(mockCommentId);

    expect(response!).toEqual(mockApiResponse);

    // ✅ ждём обновления состояния мутации
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  // 2. Оптимистичное обновление
  it('should optimistically remove comment from cache before API resolves', async () => {
    let resolvePromise!: (value: typeof mockApiResponse) => void;

    const promise = new Promise<typeof mockApiResponse>((resolve) => {
      resolvePromise = resolve;
    });

    mockedDeleteUserComment.mockImplementation(() => promise);

    const { result } = renderHook(() => useUserCommentDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ commentId: mockCommentId });
      await new Promise((r) => setTimeout(r, 0));
    });

    const cachedData = queryClient.getQueryData<{ comments: any[] }>(
      userCommentsQueryKeys.all
    );

    expect(cachedData?.comments).toHaveLength(1);
    expect(
      cachedData?.comments.find((c) => c.id === mockCommentId)
    ).toBeUndefined();

    await act(async () => {
      resolvePromise(mockApiResponse);
      await new Promise((r) => setTimeout(r, 0));
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  // 3. Success side effects
  it('should show success toast on successful deletion', async () => {
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserCommentDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ commentId: mockCommentId });
    });

    expect(mockedToast.success).toHaveBeenCalledWith(
      'Comment deleted successfully'
    );
  });

  // 4. Rollback on error
  it('should rollback optimistic update and show error toast when API fails', async () => {
    const mockError = new Error('Failed to delete comment');

    let rejectPromise!: (reason?: unknown) => void;

    const promise = new Promise<never>((_, reject) => {
      rejectPromise = reject;
    });

    mockedDeleteUserComment.mockImplementation(() => promise);

    const { result } = renderHook(() => useUserCommentDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ commentId: mockCommentId });
      await new Promise((r) => setTimeout(r, 0));
    });

    // optimistic removal
    let cachedData = queryClient.getQueryData<{ comments: any[] }>(
      userCommentsQueryKeys.all
    );
    expect(cachedData?.comments).toHaveLength(1);

    await act(async () => {
      rejectPromise(mockError);
      await new Promise((r) => setTimeout(r, 0));
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // rollback
    cachedData = queryClient.getQueryData<{ comments: any[] }>(
      userCommentsQueryKeys.all
    );
    expect(cachedData?.comments).toHaveLength(2);

    expect(mockedToast.error).toHaveBeenCalledWith(mockError.message);
  });

  // 5. Mutation states
  it('should correctly update mutation states', async () => {
    let resolvePromise!: (value: typeof mockApiResponse) => void;

    const promise = new Promise<typeof mockApiResponse>((resolve) => {
      resolvePromise = resolve;
    });

    mockedDeleteUserComment.mockImplementation(() => promise);

    const { result } = renderHook(() => useUserCommentDelete(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    act(() => {
      result.current.mutate({ commentId: mockCommentId });
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

  // 6. Empty cache safety
  it('should not crash when cache is empty', async () => {
    queryClient.clear();
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserCommentDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ commentId: mockCommentId })
      ).resolves.toEqual(mockApiResponse);
    });

    expect(mockedToast.success).toHaveBeenCalled();
  });

  // 7. Проверка параметров мутации
  it('should accept object with commentId as parameter', async () => {
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserCommentDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ commentId: 'test-comment-id' });
    });

    expect(mockedDeleteUserComment).toHaveBeenCalledWith('test-comment-id');
  });

  // 8. Проверка onSettled инвалидации
  it('should invalidate queries on settled', async () => {
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUserCommentDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ commentId: mockCommentId });
    });

    // Проверяем что invalidateQueries был вызван
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: userCommentsQueryKeys.all,
    });
  });

  // 9. Проверка toast messages
  it('should show correct toast message on success', async () => {
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserCommentDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ commentId: mockCommentId });
    });

    expect(mockedToast.success).toHaveBeenCalledTimes(1);
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Comment deleted successfully'
    );
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  it('should show correct toast message on error', async () => {
    const errorMessage = 'Failed to delete comment';
    mockedDeleteUserComment.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUserCommentDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ commentId: mockCommentId });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockedToast.error).toHaveBeenCalledTimes(1);
    expect(mockedToast.error).toHaveBeenCalledWith(errorMessage);
    expect(mockedToast.success).not.toHaveBeenCalled();
  });
});
