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

const mockedDeleteUserComment = deleteUserComment as jest.MockedFunction<
  typeof deleteUserComment
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('useUserCommentDelete', () => {
  const mockUserId = 'user-1';
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

    queryClient.setQueryData(
      userCommentsQueryKeys.list(mockUserId),
      JSON.parse(JSON.stringify(mockPreviousData)) // Deep copy to avoid mutations
    );
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

  it('should call API with correct commentId and return success response', async () => {
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserCommentDelete(mockUserId), {
      wrapper: createWrapper(),
    });

    let response: typeof mockApiResponse;

    await act(async () => {
      response = await result.current.mutateAsync({ commentId: mockCommentId });
    });

    expect(mockedDeleteUserComment).toHaveBeenCalledTimes(1);
    expect(mockedDeleteUserComment).toHaveBeenCalledWith(mockCommentId);

    expect(response!).toEqual(mockApiResponse);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should optimistically remove comment from cache before API resolves', async () => {
    let resolvePromise!: (value: typeof mockApiResponse) => void;

    const promise = new Promise<typeof mockApiResponse>((resolve) => {
      resolvePromise = resolve;
    });

    mockedDeleteUserComment.mockImplementation(() => promise);

    const { result } = renderHook(() => useUserCommentDelete(mockUserId), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ commentId: mockCommentId });
      await new Promise((r) => setTimeout(r, 0));
    });

    const cachedData = queryClient.getQueryData<{ comments: any[] }>(
      userCommentsQueryKeys.list(mockUserId)
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

  it('should show success toast on successful deletion', async () => {
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserCommentDelete(mockUserId), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ commentId: mockCommentId });
    });

    expect(mockedToast.success).toHaveBeenCalledWith(
      'Comment deleted successfully'
    );
  });

  it('should rollback optimistic update and show error toast when API fails', async () => {
    const mockError = new Error('Failed to delete comment');

    let rejectPromise!: (reason?: unknown) => void;

    const promise = new Promise<never>((_, reject) => {
      rejectPromise = reject;
    });

    mockedDeleteUserComment.mockImplementation(() => promise);

    const { result } = renderHook(() => useUserCommentDelete(mockUserId), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ commentId: mockCommentId });
      await new Promise((r) => setTimeout(r, 0));
    });

    let cachedData = queryClient.getQueryData<{ comments: any[] }>(
      userCommentsQueryKeys.list(mockUserId)
    );
    expect(cachedData?.comments).toHaveLength(1);

    await act(async () => {
      rejectPromise(mockError);
      await new Promise((r) => setTimeout(r, 0));
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    cachedData = queryClient.getQueryData<{ comments: any[] }>(
      userCommentsQueryKeys.list(mockUserId)
    );
    expect(cachedData?.comments).toHaveLength(2);

    expect(mockedToast.error).toHaveBeenCalledWith(mockError.message);
  });

  it('should correctly update mutation states', async () => {
    let resolvePromise!: (value: typeof mockApiResponse) => void;

    const promise = new Promise<typeof mockApiResponse>((resolve) => {
      resolvePromise = resolve;
    });

    mockedDeleteUserComment.mockImplementation(() => promise);

    const { result } = renderHook(() => useUserCommentDelete(mockUserId), {
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

  it('should not crash when cache is empty', async () => {
    queryClient.clear();
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserCommentDelete(mockUserId), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ commentId: mockCommentId })
      ).resolves.toEqual(mockApiResponse);
    });

    expect(mockedToast.success).toHaveBeenCalled();
  });

  it('should accept object with commentId as parameter', async () => {
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserCommentDelete(mockUserId), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ commentId: 'test-comment-id' });
    });

    expect(mockedDeleteUserComment).toHaveBeenCalledWith('test-comment-id');
  });

  it('should invalidate queries on settled', async () => {
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUserCommentDelete(mockUserId), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ commentId: mockCommentId });
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: userCommentsQueryKeys.list(mockUserId),
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: userCommentsQueryKeys.stats(mockUserId),
    });
  });

  it('should show correct toast message on success', async () => {
    mockedDeleteUserComment.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useUserCommentDelete(mockUserId), {
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

    const { result } = renderHook(() => useUserCommentDelete(mockUserId), {
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

  // Обновленный тест для проверки статистики
  it('should update stats optimistically', async () => {
    let resolvePromise!: (value: typeof mockApiResponse) => void;

    const promise = new Promise<typeof mockApiResponse>((resolve) => {
      resolvePromise = resolve;
    });

    mockedDeleteUserComment.mockImplementation(() => promise);

    const { result } = renderHook(() => useUserCommentDelete(mockUserId), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ commentId: mockCommentId });
      // Ждем немного, чтобы optimistic update применился
      await new Promise((r) => setTimeout(r, 100));
    });

    const cachedData = queryClient.getQueryData<{ stats: any }>(
      userCommentsQueryKeys.list(mockUserId)
    );

    console.log(
      'Cached data after optimistic update:',
      JSON.stringify(cachedData, null, 2)
    );

    // Проверяем, что статистика обновилась
    expect(cachedData?.stats.totalComments).toBe(1); // было 2, стало 1
    expect(cachedData?.stats.totalLikes).toBe(3); // было 8, вычли 5
    expect(cachedData?.stats.totalDislikes).toBe(0); // было 1, вычли 1
    expect(cachedData?.stats.postsCommented).toBe(1); // было 2, стало 1

    await act(async () => {
      resolvePromise(mockApiResponse);
      await new Promise((r) => setTimeout(r, 0));
    });
  });
});
