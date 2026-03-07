import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'sonner';

import { userProfileQueryKeys } from '@/features/user-profile-info';
import { UserClerk } from '@/shared/types';
import { updateUserRole } from '../../api';
import type { UsersResponse } from '../../model';
import { useUpdateRole } from '../use-update-role';
import { usersQueryKeys } from '../use-users';

// Мокаем зависимости
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../api', () => ({
  updateUserRole: jest.fn(),
}));

const mockedUpdateUserRole = updateUserRole as jest.MockedFunction<
  typeof updateUserRole
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('useUpdateRole', () => {
  // Моковые данные
  const mockUserId = 'user_34v5G5X6symiUW6oxIqDrt3d0Df';
  const mockNewRole = 'admin';
  const mockParams = { userId: mockUserId, newRole: mockNewRole };

  const mockUser: UserClerk = {
    id: mockUserId,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    imageUrl: '',
    createdAt: Date.now(),
    lastSignInAt: Date.now(),
  };

  const mockUsersResponse: UsersResponse = {
    success: true,
    users: [mockUser],
    total: 1,
    page: 1,
    totalPages: 1,
  };

  // Новый формат ApiResponse
  const mockSuccessApiResponse = {
    message: 'Role updated successfully',
    success: true,
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    jest.clearAllMocks();

    // Предварительно устанавливаем данные в кэш для оптимистичных обновлений
    queryClient.setQueryData(usersQueryKeys.all, mockUsersResponse);
    queryClient.setQueryData(
      userProfileQueryKeys.profile(mockUserId),
      mockUser
    );
  });

  // Создаем wrapper функцию
  const createWrapper = () => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };
  };

  // 1. БАЗОВЫЙ ТЕСТ
  it('should call API with correct parameters and handle success response', async () => {
    mockedUpdateUserRole.mockResolvedValue(mockSuccessApiResponse);

    const { result } = renderHook(() => useUpdateRole(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(mockParams);
    });

    // Давайте просто проверим вызов и аргументы

    expect(mockedUpdateUserRole).toHaveBeenCalledTimes(1);

    // Получаем аргументы первого вызова
    const receivedArgs = mockedUpdateUserRole.mock.calls[0][0];

    // Просто проверяем что в аргументах есть нужные поля с правильными значениями
    // Это более гибкая проверка
    expect(receivedArgs).toMatchObject(mockParams);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSuccessApiResponse);
    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.message).toBe('Role updated successfully');
  });
  // 2. КРИТИЧЕСКИЙ ТЕСТ - оптимистичное обновление
  it('should optimistically update cache before API response', async () => {
    // Имитируем медленный запрос
    let resolvePromise: (value: typeof mockSuccessApiResponse) => void;
    const promise = new Promise<typeof mockSuccessApiResponse>((resolve) => {
      resolvePromise = resolve;
    });

    mockedUpdateUserRole.mockImplementation(() => promise);

    const { result } = renderHook(() => useUpdateRole(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(mockParams);
      // Даем время на выполнение onMutate
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // Проверяем оптимистичное обновление
    const updatedProfile = queryClient.getQueryData<UserClerk>(
      userProfileQueryKeys.profile(mockUserId)
    );
    expect(updatedProfile?.role).toBe(mockNewRole);

    // Разрешаем промис
    await act(async () => {
      resolvePromise!(mockSuccessApiResponse);
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // Ждем завершения
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  // 3. ТЕСТ УСПЕШНОЙ ОПЕРАЦИИ
  it('should show success toast and invalidate cache on success', async () => {
    mockedUpdateUserRole.mockResolvedValue(mockSuccessApiResponse);

    const { result } = renderHook(() => useUpdateRole(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(mockParams);
    });

    // Проверяем уведомление
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Role updated successfully'
    );

    // Проверяем состояние
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSuccessApiResponse);
    expect(result.current.data?.success).toBe(true);
  });

  // 4. ТЕСТ ОШИБКИ (важный негативный сценарий) - ИСПРАВЛЕННЫЙ
  it('should rollback optimistic update and show error when API throws exception', async () => {
    const mockError = new Error('Failed to update role');

    let rejectPromise!: (reason?: unknown) => void;
    const promise = new Promise<never>((_, reject) => {
      rejectPromise = reject;
    });

    mockedUpdateUserRole.mockImplementation(() => promise);

    const originalRole = mockUser.role;

    const { result } = renderHook(() => useUpdateRole(), {
      wrapper: createWrapper(),
    });

    // запускаем мутацию
    await act(async () => {
      result.current.mutate(mockParams);
      await new Promise((r) => setTimeout(r, 0));
    });

    // ✅ optimistic update УСПЕВАЕТ примениться
    const optimisticData = queryClient.getQueryData<UserClerk>(
      userProfileQueryKeys.profile(mockUserId)
    );
    expect(optimisticData?.role).toBe(mockNewRole);

    // ❌ теперь роняем запрос
    await act(async () => {
      rejectPromise(mockError);
      await new Promise((r) => setTimeout(r, 0));
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // 🔁 rollback
    const rolledBackData = queryClient.getQueryData<UserClerk>(
      userProfileQueryKeys.profile(mockUserId)
    );
    expect(rolledBackData?.role).toBe(originalRole);

    expect(mockedToast.error).toHaveBeenCalledWith(mockError.message);
  });

  // 5. ТЕСТ СОСТОЯНИЙ МУТАЦИИ
  it('should correctly update mutation states', async () => {
    let resolvePromise!: (value: typeof mockSuccessApiResponse) => void;
    const promise = new Promise<typeof mockSuccessApiResponse>((resolve) => {
      resolvePromise = resolve;
    });

    mockedUpdateUserRole.mockImplementation(() => promise);

    const { result } = renderHook(() => useUpdateRole(), {
      wrapper: createWrapper(),
    });

    // начальное состояние
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    // запускаем мутацию
    act(() => {
      result.current.mutate(mockParams);
    });

    // ✅ ЖДЁМ pending
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // завершаем запрос
    await act(async () => {
      resolvePromise(mockSuccessApiResponse);
      await new Promise((r) => setTimeout(r, 0));
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toEqual(mockSuccessApiResponse);
    });
  });

  // 6. ТЕСТ С ПУСТЫМИ ДАННЫМИ В КЭШЕ
  it('should handle mutation when cache is empty', async () => {
    // Очищаем кэш
    queryClient.clear();
    mockedUpdateUserRole.mockResolvedValue(mockSuccessApiResponse);

    const { result } = renderHook(() => useUpdateRole(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(result.current.mutateAsync(mockParams)).resolves.toEqual(
        mockSuccessApiResponse
      );
    });

    expect(mockedToast.success).toHaveBeenCalled();
  });
});
