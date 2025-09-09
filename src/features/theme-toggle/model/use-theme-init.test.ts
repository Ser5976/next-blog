import { act, renderHook, waitFor } from '@testing-library/react';

import { applyTheme } from '../lib/apply-theme';
import { getInitialTheme } from '../lib/get-initial-theme';
import { useThemeInit } from './use-theme-init';

jest.mock('../lib/get-initial-theme');
jest.mock('../lib/apply-theme');

describe('useThemeInit', () => {
  const defaultOptions = {
    defaultTheme: 'light' as const,
    storageKey: 'theme',
    attribute: 'class',
    enableSystem: true,
    disableTransitionOnChange: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getInitialTheme as jest.Mock).mockReturnValue('light'); // базовое значение
  });

  it('should set initial theme from getInitialTheme', () => {
    (getInitialTheme as jest.Mock).mockReturnValue('dark');

    const { result } = renderHook(() => useThemeInit(defaultOptions));

    expect(result.current.theme).toBe('dark');
  });

  it('should call applyTheme when theme changes', () => {
    const { result } = renderHook(() => useThemeInit(defaultOptions));

    act(() => {
      result.current.setTheme('dark');
    });

    expect(applyTheme).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'dark',
        storageKey: 'theme',
      })
    );
  });

  it('should update theme state when setTheme is called', async () => {
    (getInitialTheme as jest.Mock).mockReturnValue('light');

    const { result } = renderHook(() => useThemeInit(defaultOptions));

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.setTheme('dark');
    });

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
  });
});
