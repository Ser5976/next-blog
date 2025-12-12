import { getViewsStats } from '@/features/view-stats/api/get-views-stats';

describe('getViewsStats', () => {
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

  it('should return views stats on successful fetch', async () => {
    // Arrange: Подготавливаем мок-данные
    const mockStats = {
      totalViews: { current: 10000, change: 25 },
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
    const result = await getViewsStats(timeRange);

    // Assert: Проверяем результаты
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/dashboard/total-views?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

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
    const result = await getViewsStats(timeRange);

    // Assert: Проверяем
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/dashboard/total-views?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

    expect(result).toBeNull();
  });

  it('should handle network errors gracefully', async () => {
    // Arrange: Симулируем ошибку сети
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    // Act & Assert: Проверяем, что функция возвращает null при ошибке
    const timeRange = 'week';
    const result = await getViewsStats(timeRange);

    expect(result).toBeNull();
  });

  it('should use different timeRange values correctly', async () => {
    // Arrange: Настраиваем мок
    const mockStats = { totalViews: { current: 5000, change: 10 } };
    const mockResponse = {
      ok: true,
      json: async () => mockStats,
    } as Response;

    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    // Act: Тестируем с разными значениями timeRange
    const testCases = ['week', 'month', 'year'] as const;

    for (const timeRange of testCases) {
      await getViewsStats(timeRange);

      // Assert: Проверяем, что каждый раз вызывается с правильным timeRange
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/api/dashboard/total-views?timeRange=${timeRange}`,
        {
          next: { revalidate: 60 },
        }
      );

      (global.fetch as jest.Mock).mockClear();
    }
  });
});
