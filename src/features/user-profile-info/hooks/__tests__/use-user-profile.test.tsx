import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { getUserProfile } from '../../api';
import type { User } from '../../model';
import { useUserProfile } from '../use-user-profile';

// Мокаем API функцию
jest.mock('../../api', () => ({
  getUserProfile: jest.fn(),
}));

const mockedGetUserProfile = getUserProfile as jest.MockedFunction<
  typeof getUserProfile
>;

// Вспомогательная функция для создания обертки с QueryClientProvider
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Отключаем retry для тестов
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useUserProfile', () => {
  // Тестовые данные
  const userId = 'user-123';

  const mockUser: User = {
    id: userId,
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'author',
    imageUrl: 'https://example.com/avatar.jpg',
    createdAt: 1704067200000, // 2024-01-01
    lastSignInAt: 1704153600000, // 2024-01-02
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Тест 1: Успешное получение профиля пользователя
  it('fetches user profile successfully', async () => {
    // Настраиваем мок для успешного ответа
    mockedGetUserProfile.mockResolvedValueOnce(mockUser);

    // Рендерим хук с оберткой
    const { result } = renderHook(() => useUserProfile(userId), {
      wrapper: createWrapper(),
    });

    // Проверяем начальное состояние загрузки
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Ждем завершения запроса
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем, что API функция была вызвана с правильными аргументами
    expect(getUserProfile).toHaveBeenCalledTimes(1);
    expect(getUserProfile).toHaveBeenCalledWith(userId);

    // Проверяем, что данные правильно установлены
    expect(result.current.data).toEqual(mockUser);
    expect(result.current.data?.id).toBe(userId);
    expect(result.current.data?.email).toBe('john.doe@example.com');
    expect(result.current.data?.firstName).toBe('John');
    expect(result.current.data?.lastName).toBe('Doe');
  });

  // Тест 2: Возвращает ошибку при неудачном запросе
  it('returns error when request fails', async () => {
    const errorMessage = 'Failed to fetch user profile';

    // Настраиваем мок для ошибки
    mockedGetUserProfile.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUserProfile(userId), {
      wrapper: createWrapper(),
    });

    // Ждем пока isLoading станет false (запрос завершится)
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );

    // Проверяем что это ошибка
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.data).toBeUndefined();
  });

  // Тест 3: Хук не выполняет запрос если userId не передан
  it('does not fetch when userId is empty', async () => {
    const { result } = renderHook(() => useUserProfile(''), {
      wrapper: createWrapper(),
    });

    // Хук должен быть отключен (enabled: !!userId)
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');

    // API не должен быть вызван
    expect(getUserProfile).not.toHaveBeenCalled();
  });

  // Тест 4: Хук использует правильные query keys для кэширования
  it('uses correct query keys for caching', async () => {
    mockedGetUserProfile.mockResolvedValueOnce(mockUser);

    const { result, rerender } = renderHook(
      (id: string) => useUserProfile(id),
      {
        initialProps: userId,
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Меняем userId и проверяем что запрос выполняется с новым id
    const newUserId = 'user-456';
    const newMockUser = {
      ...mockUser,
      id: newUserId,
      email: 'jane.doe@example.com',
    };
    mockedGetUserProfile.mockResolvedValueOnce(newMockUser);

    rerender(newUserId);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем что API был вызван с новым userId
    expect(getUserProfile).toHaveBeenCalledWith(newUserId);

    // Проверяем что данные обновились
    expect(result.current.data?.id).toBe(newUserId);
    expect(result.current.data?.email).toBe('jane.doe@example.com');
  });

  // Тест 5: Хук правильно обрабатывает refetch
  it('refetches data when refetch is called', async () => {
    mockedGetUserProfile.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUserProfile(userId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Сбрасываем счетчик вызовов
    jest.clearAllMocks();

    // Настраиваем мок для повторного запроса
    mockedGetUserProfile.mockResolvedValueOnce(mockUser);

    // Вызываем refetch
    result.current.refetch();

    // Проверяем, что API был вызван
    await waitFor(() => {
      expect(getUserProfile).toHaveBeenCalledTimes(1);
      expect(getUserProfile).toHaveBeenCalledWith(userId);
    });

    // Проверяем состояние refetching
    expect(result.current.isRefetching).toBe(false);
  });

  // Тест 6: Проверяем настройки staleTime и gcTime через поведение кэша
  it('maintains cache between hook instances', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    mockedGetUserProfile.mockResolvedValueOnce(mockUser);

    // Первый экземпляр хука
    const { result: result1, unmount } = renderHook(
      () => useUserProfile(userId),
      { wrapper }
    );

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
    });

    // Размонтируем первый хук
    unmount();

    // Очищаем мок чтобы убедиться что нового запроса не будет
    jest.clearAllMocks();

    // Второй экземпляр хука с тем же userId
    const { result: result2 } = renderHook(() => useUserProfile(userId), {
      wrapper,
    });

    // Данные должны быть сразу доступны из кэша (без загрузки)
    expect(result2.current.isLoading).toBe(false);
    expect(result2.current.data).toEqual(mockUser);

    // API не должен вызываться снова
    expect(getUserProfile).not.toHaveBeenCalled();
  });

  // Тест 7: Хук корректно обрабатывает retry при ошибке
  it('retries on error according to retry settings', async () => {
    // Создаем QueryClient с включенными retry для этого теста
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1, // Одна повторная попытка
          retryDelay: 0, // Без задержки для тестов
        },
      },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const errorMessage = 'Temporary error';
    mockedGetUserProfile.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUserProfile(userId), { wrapper });

    // Ждем завершения всех попыток (1 основная + 1 повторная)
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 2000 }
    );

    // API должен быть вызван 2 раза (основной запрос + retry)
    expect(getUserProfile).toHaveBeenCalledTimes(2);
    expect(result.current.isError).toBe(true);
    expect(result.current.failureCount).toBe(2);
  });

  // Тест 8: Проверяем что хук не обновляется при фокусе окна
  it('does not refetch on window focus', async () => {
    mockedGetUserProfile.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUserProfile(userId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Сбрасываем счетчик вызовов
    jest.clearAllMocks();

    // Эмулируем фокус окна
    window.dispatchEvent(new Event('focus'));

    // Небольшая задержка чтобы убедиться что запрос не произошел
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Проверяем что API не был вызван повторно
    expect(getUserProfile).not.toHaveBeenCalled();
  });

  // Тест 9: Проверяем что хук не использует placeholder data
  it('does not use placeholder data', async () => {
    mockedGetUserProfile.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUserProfile(userId), {
      wrapper: createWrapper(),
    });

    // В начале запроса данных нет (нет placeholder)
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // После успешного запроса данные появляются
    expect(result.current.data).toBeDefined();
  });

  // Тест 10: Проверяем работу с null значениями в данных
  it('handles null values in user data correctly', async () => {
    const userWithNulls: User = {
      id: userId,
      email: 'test@example.com',
      firstName: null,
      lastName: null,
      role: 'user',
      imageUrl: '',
      createdAt: null,
      lastSignInAt: null,
    };

    mockedGetUserProfile.mockResolvedValueOnce(userWithNulls);

    const { result } = renderHook(() => useUserProfile(userId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем что null значения корректно передаются
    expect(result.current.data?.firstName).toBeNull();
    expect(result.current.data?.lastName).toBeNull();
    expect(result.current.data?.createdAt).toBeNull();
    expect(result.current.data?.lastSignInAt).toBeNull();
    expect(result.current.data?.email).toBe('test@example.com');
  });
});
