import { act, renderHook } from '@testing-library/react';

import { useCustomDebounce } from '../use-custom-debounce';

describe('useCustomDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useCustomDebounce('test', 500));

    expect(result.current).toBe('test');
  });

  it('should update value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useCustomDebounce(value, 500),
      { initialProps: { value: 'test' } }
    );

    rerender({ value: 'updated' });

    // сразу не обновляется
    expect(result.current).toBe('test');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('should debounce multiple fast updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useCustomDebounce(value, 500),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    rerender({ value: 'c' });

    act(() => {
      jest.advanceTimersByTime(499);
    });

    // значение всё ещё старое
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    // берётся последнее значение
    expect(result.current).toBe('c');
  });

  it('should handle undefined value', () => {
    const { result } = renderHook(() => useCustomDebounce(undefined, 300));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBeUndefined();
  });
});
