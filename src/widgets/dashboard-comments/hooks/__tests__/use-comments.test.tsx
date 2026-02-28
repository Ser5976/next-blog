import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { getComments } from '../../api';
import type { CommentsFilters, CommentsResponse } from '../../model';
import { useComments } from '../use-comments';

jest.mock('../../api', () => ({ getComments: jest.fn() }));

const mockedGetComments = getComments as jest.MockedFunction<
  typeof getComments
>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, retryDelay: 0 } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useComments', () => {
  const filters: CommentsFilters = { page: 1, limit: 10, search: 'test' };
  const response: CommentsResponse = {
    success: true,
    comments: [
      {
        id: '1',
        content: 'Test comment',
        author: null,
        post: { id: 'post1', title: 'Post', slug: 'post', published: true },
        stats: { likesCount: 0, dislikesCount: 0 },
        createdAt: null,
        updatedAt: null,
      },
    ],
    total: 1,
    page: 1,
    totalPages: 1,
  };

  beforeEach(() => jest.clearAllMocks());

  it('fetches comments successfully', async () => {
    mockedGetComments.mockResolvedValueOnce(response);
    const { result } = renderHook(() => useComments(filters), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getComments).toHaveBeenCalledTimes(1);
    expect(getComments).toHaveBeenCalledWith(filters);
    expect(result.current.data).toEqual(response);
  });

  it('returns error when request fails', async () => {
    const errorMessage = 'Something went wrong, comments were not received';
    mockedGetComments.mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useComments(filters), {
      wrapper: createWrapper(),
    });

    // Log the state to debug
    console.log('Initial state:', result.current);

    await waitFor(() => expect(result.current.isLoading).toBe(false), {
      timeout: 3000,
    });

    console.log('After wait:', result.current);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(errorMessage);
  });
});
