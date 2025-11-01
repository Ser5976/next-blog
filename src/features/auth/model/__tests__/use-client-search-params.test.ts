import { useSearchParams } from 'next/navigation';
import { renderHook } from '@testing-library/react';

import { useClientSearchParams } from '../use-client-search-params';

// Мокируем зависимость - хук useSearchParams из Next.js
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

const mockedUseSearchParams = useSearchParams as jest.Mock;

describe('useClientSearchParams', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return  search params ', () => {
    /**
     * Хук использует useEffect для захвата searchParams на клиенте.
     * `renderHook` выполняет этот эффект синхронно. Поэтому мы должны сразу
     * получить финальное состояние.
     */
    // Arrange: Настраиваем мок, чтобы он возвращал конкретные параметры
    const searchParams = new URLSearchParams('foo=bar&baz=qux');
    mockedUseSearchParams.mockReturnValue(searchParams);

    // Act: Рендерим хук
    const { result } = renderHook(() => useClientSearchParams());

    // Assert: Проверяем финальное состояние

    expect(result.current.searchParams).toBe(searchParams);

    // Assert: Проверяем работу метода get
    expect(result.current.get('foo')).toBe('bar');
    expect(result.current.get('baz')).toBe('qux');
    expect(result.current.get('nonexistent')).toBeNull();
  });

  it('should handle updates to searchParams on rerender', () => {
    /**
     *  Если searchParams из `next/navigation` изменятся (например,
     * из-за навигации), наш хук должен среагировать и обновить свое состояние.
     */
    // Arrange: Начальное состояние
    const initialParams = new URLSearchParams('page=1');
    mockedUseSearchParams.mockReturnValue(initialParams);
    const { result, rerender } = renderHook(() => useClientSearchParams());

    // Assert: Проверяем начальное состояние после монтирования
    expect(result.current.get('page')).toBe('1');

    // Act: Имитируем изменение параметров
    const updatedParams = new URLSearchParams('page=2');
    mockedUseSearchParams.mockReturnValue(updatedParams);
    rerender(); // Вызываем rerender, чтобы хук получил новые данные

    // Assert: Проверяем, что хук обновился
    expect(result.current.searchParams).toBe(updatedParams);
    expect(result.current.get('page')).toBe('2');
  });

  it('should return null for params when useSearchParams returns null', () => {
    // Arrange: Имитируем случай, когда Next.js еще не предоставил searchParams
    mockedUseSearchParams.mockReturnValue(null);

    // Act
    const { result } = renderHook(() => useClientSearchParams());

    // Assert
    expect(result.current.searchParams).toBeNull();
    expect(result.current.get('any')).toBeUndefined();
  });
});
