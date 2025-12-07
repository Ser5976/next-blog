import { getCommentsStats } from '@/features/comments-stats/api/get-comments-stats';

describe('getCommentsStats', () => {
  const originalFetch = global.fetch;
  const originalNextPublicDomain = process.env.NEXT_PUBLIC_DOMAIN;

  beforeAll(() => {
    process.env.NEXT_PUBLIC_DOMAIN = 'http://localhost:3000';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_DOMAIN = originalNextPublicDomain;
  });

  it('should return comments stats on successful fetch', async () => {
    // Arrange: Подготавливаем мок-данные
    const mockStats = {
      totalComments: { current: 250, change: 15 },
    };

    // Мок ответа от сервера
    const mockResponse = {
      ok: true,
      json: async () => mockStats,
    } as Response;

    // Подменяем глобальный fetch
    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    // Act: Вызываем тестируемую функцию
    const timeRange = 'week';
    const result = await getCommentsStats(timeRange);

    // Assert: Проверяем результаты
    // 1. Проверяем, что fetch вызван с правильными аргументами
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/dashboard/comments?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

    // 2. Проверяем, что функция вернула правильные данные
    expect(result).toEqual(mockStats);
  });

  it('should return null when fetch is not successful', async () => {
    // Arrange: Мок неудачного ответа
    const mockResponse = {
      ok: false,
    } as Response;

    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    // Act: Вызываем функцию
    const timeRange = 'month';
    const result = await getCommentsStats(timeRange);

    // Assert: Проверяем
    // 1. Проверяем правильность URL
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/dashboard/comments?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

    // 2. Проверяем, что при ошибке возвращается null
    expect(result).toBeNull();
  });

  it('should handle network errors gracefully', async () => {
    // Arrange: Симулируем ошибку сети
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    // Act & Assert: Проверяем, что функция не падает
    const timeRange = 'week';

    // Можно проверить двумя способами:
    // Способ 1: Ожидаем, что вернется null (если функция так обрабатывает)
    // const result = await getCommentsStats(timeRange);
    // expect(result).toBeNull();

    // Способ 2: Ожидаем, что будет выброшено исключение (если функция не обрабатывает)
    await expect(getCommentsStats(timeRange)).rejects.toThrow('Network error');
  });

  it('should use different timeRange values correctly', async () => {
    // Arrange: Настраиваем мок
    const mockStats = { totalComments: { current: 100, change: 5 } };
    const mockResponse = {
      ok: true,
      json: async () => mockStats,
    } as Response;

    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    // Act: Тестируем с разными значениями timeRange
    const testCases = ['week', 'month', 'year'] as const;

    for (const timeRange of testCases) {
      await getCommentsStats(timeRange);

      // Assert: Проверяем, что каждый раз вызывается с правильным timeRange
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/api/dashboard/comments?timeRange=${timeRange}`,
        {
          next: { revalidate: 60 },
        }
      );

      // Очищаем мок между вызовами
      (global.fetch as jest.Mock).mockClear();
    }
  });
});
