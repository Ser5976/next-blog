import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'sonner';

import { User } from '@/features/user-profile-info';
import { deleteUser } from '../../api';
import { useDeleteUser } from '../use-delete-user';
import { usersQueryKeys } from '../use-users';

// mocks

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../api', () => ({
  deleteUser: jest.fn(),
}));

const mockedDeleteUser = deleteUser as jest.MockedFunction<typeof deleteUser>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('useDeleteUser', () => {
  const mockUserId = 'user_1';

  const mockUsers: User[] = [
    {
      id: 'user_1',
      email: 'test1@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      imageUrl: '',
      createdAt: Date.now(),
      lastSignInAt: Date.now(),
    },
    {
      id: 'user_2',
      email: 'test2@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'admin',
      imageUrl: '',
      createdAt: Date.now(),
      lastSignInAt: Date.now(),
    },
  ];

  const mockApiResponse = {
    success: true,
    message: 'User deleted successfully',
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    jest.clearAllMocks();

    queryClient.setQueryData(usersQueryKeys.all, {
      users: mockUsers,
    });
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

  // 1. базовый тест

  it('should call API with correct userId and return success response', async () => {
    mockedDeleteUser.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    let response: typeof mockApiResponse;

    await act(async () => {
      response = await result.current.mutateAsync(mockUserId);
    });

    expect(mockedDeleteUser).toHaveBeenCalledTimes(1);

    const [receivedUserId] = mockedDeleteUser.mock.calls[0];
    expect(receivedUserId).toBe(mockUserId);

    expect(response!).toEqual(mockApiResponse);

    // ✅ ждём обновления состояния мутации
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  // 2. optimistic update

  it('should optimistically remove user from cache before API resolves', async () => {
    let resolvePromise!: (value: typeof mockApiResponse) => void;

    const promise = new Promise<typeof mockApiResponse>((resolve) => {
      resolvePromise = resolve;
    });

    mockedDeleteUser.mockImplementation(() => promise);

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(mockUserId);
      await new Promise((r) => setTimeout(r, 0));
    });

    const cachedData = queryClient.getQueryData<{ users: User[] }>(
      usersQueryKeys.all
    );

    expect(cachedData?.users).toHaveLength(1);
    expect(cachedData?.users.find((u) => u.id === mockUserId)).toBeUndefined();

    await act(async () => {
      resolvePromise(mockApiResponse);
      await new Promise((r) => setTimeout(r, 0));
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  // 3. success side effects

  it('should show success toast on successful deletion', async () => {
    mockedDeleteUser.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(mockUserId);
    });

    expect(mockedToast.success).toHaveBeenCalledWith(
      'User deleted successfully'
    );
  });

  // 4. rollback on error

  it('should rollback optimistic update and show error toast when API fails', async () => {
    const mockError = new Error('Failed to delete user');

    let rejectPromise!: (reason?: unknown) => void;

    const promise = new Promise<never>((_, reject) => {
      rejectPromise = reject;
    });

    mockedDeleteUser.mockImplementation(() => promise);

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(mockUserId);
      await new Promise((r) => setTimeout(r, 0));
    });

    // optimistic removal
    let cachedData = queryClient.getQueryData<{ users: User[] }>(
      usersQueryKeys.all
    );
    expect(cachedData?.users).toHaveLength(1);

    await act(async () => {
      rejectPromise(mockError);
      await new Promise((r) => setTimeout(r, 0));
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // rollback
    cachedData = queryClient.getQueryData<{ users: User[] }>(
      usersQueryKeys.all
    );
    expect(cachedData?.users).toHaveLength(2);

    expect(mockedToast.error).toHaveBeenCalledWith(mockError.message);
  });

  // 5. mutation states

  it('should correctly update mutation states', async () => {
    let resolvePromise!: (value: typeof mockApiResponse) => void;

    const promise = new Promise<typeof mockApiResponse>((resolve) => {
      resolvePromise = resolve;
    });

    mockedDeleteUser.mockImplementation(() => promise);

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    act(() => {
      result.current.mutate(mockUserId);
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

  // 6. empty cache safety

  it('should not crash when cache is empty', async () => {
    queryClient.clear();
    mockedDeleteUser.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(result.current.mutateAsync(mockUserId)).resolves.toEqual(
        mockApiResponse
      );
    });

    expect(mockedToast.success).toHaveBeenCalled();
  });
});
