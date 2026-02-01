import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { getUsers } from '../../api';
import type { UsersFilters, UsersResponse } from '../../model';
import { useUsers } from '../use-users';

jest.mock('../../api', () => ({
  getUsers: jest.fn(),
}));

const mockedGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, //  важно для тестов
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

describe('useUsers', () => {
  const filters: UsersFilters = {
    page: 1,
    limit: 10,
    emailSearch: 'test',
  };

  const response: UsersResponse = {
    success: true,
    users: [
      {
        id: '1',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        imageUrl: '',
        createdAt: null,
        lastSignInAt: null,
      },
    ],
    total: 1,
    page: 1,
    totalPages: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches users successfully', async () => {
    mockedGetUsers.mockResolvedValueOnce(response);

    const { result } = renderHook(() => useUsers(filters), {
      wrapper: createWrapper(),
    });

    // loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getUsers).toHaveBeenCalledTimes(1);
    expect(getUsers).toHaveBeenCalledWith(filters);

    expect(result.current.data).toEqual(response);
  });

  it('returns error when request fails', async () => {
    const errorMessage = 'Something went wrong, the user was not received';
    mockedGetUsers.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUsers(filters), {
      wrapper: createWrapper(),
    });

    // Ждем пока запрос не завершится (перестанет быть loading)
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );

    // Теперь проверяем, что есть ошибка
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(errorMessage);
  });
  it('uses filters in queryKey', async () => {
    mockedGetUsers.mockResolvedValueOnce(response);

    const { result } = renderHook(() => useUsers(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getUsers).toHaveBeenCalledWith(filters);
  });
});
