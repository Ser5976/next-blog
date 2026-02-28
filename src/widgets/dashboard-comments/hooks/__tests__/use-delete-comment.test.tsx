import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'sonner';

import { deleteComment } from '../../api';
import { commentsQueryKeys } from '../use-comments';
import { useDeleteComment } from '../use-delete-comment';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../api', () => ({
  deleteComment: jest.fn(),
}));

const mockedDeleteComment = deleteComment as jest.MockedFunction<
  typeof deleteComment
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('useDeleteComment', () => {
  const mockCommentId = 'comment_1';
  const mockCommentsData = {
    success: true,
    comments: [
      {
        id: 'comment_1',
        content: 'Test comment 1',
        author: null,
        post: { id: 'post1', title: 'Post 1', slug: 'post-1', published: true },
        stats: { likesCount: 0, dislikesCount: 0 },
        createdAt: null,
        updatedAt: null,
      },
      {
        id: 'comment_2',
        content: 'Test comment 2',
        author: null,
        post: { id: 'post2', title: 'Post 2', slug: 'post-2', published: true },
        stats: { likesCount: 0, dislikesCount: 0 },
        createdAt: null,
        updatedAt: null,
      },
    ],
    total: 2,
    page: 1,
    totalPages: 1,
  };
  const mockApiResponse = {
    success: true,
    message: 'Comment deleted successfully',
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    jest.clearAllMocks();
    queryClient.setQueryData(commentsQueryKeys.lists(), mockCommentsData);
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

  it('should call API with correct userId and return success response', async () => {
    mockedDeleteComment.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(),
    });

    let response: typeof mockApiResponse;

    await act(async () => {
      response = await result.current.mutateAsync(mockCommentId);
    });

    expect(mockedDeleteComment).toHaveBeenCalledTimes(1);

    const [receivedUserId] = mockedDeleteComment.mock.calls[0];
    expect(receivedUserId).toBe(mockCommentId);

    expect(response!).toEqual(mockApiResponse);

    // ✅ ждём обновления состояния мутации
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should optimistically remove comment from cache before API resolves', async () => {
    let resolvePromise!: (value: typeof mockApiResponse) => void;
    const promise = new Promise<typeof mockApiResponse>((resolve) => {
      resolvePromise = resolve;
    });
    mockedDeleteComment.mockImplementation(() => promise);

    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(mockCommentId);
      await new Promise((r) => setTimeout(r, 0));
    });

    const cachedData = queryClient.getQueryData<typeof mockCommentsData>(
      commentsQueryKeys.lists()
    );
    expect(cachedData?.comments).toHaveLength(1);
    expect(
      cachedData?.comments.find((c) => c.id === mockCommentId)
    ).toBeUndefined();
    expect(cachedData?.total).toBe(1);

    await act(async () => {
      resolvePromise(mockApiResponse);
      await new Promise((r) => setTimeout(r, 0));
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('should show success toast on successful deletion', async () => {
    mockedDeleteComment.mockResolvedValue(mockApiResponse);
    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(mockCommentId);
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
    mockedDeleteComment.mockImplementation(() => promise);

    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(mockCommentId);
      await new Promise((r) => setTimeout(r, 0));
    });

    // optimistic removal
    let cachedData = queryClient.getQueryData<typeof mockCommentsData>(
      commentsQueryKeys.lists()
    );
    expect(cachedData?.comments).toHaveLength(1);

    await act(async () => {
      rejectPromise(mockError);
      await new Promise((r) => setTimeout(r, 0));
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    // rollback
    cachedData = queryClient.getQueryData<typeof mockCommentsData>(
      commentsQueryKeys.lists()
    );
    expect(cachedData?.comments).toHaveLength(2);
    expect(cachedData?.total).toBe(2);
    expect(mockedToast.error).toHaveBeenCalledWith(mockError.message);
  });
});
