'use client';

import { useSearchParams } from 'next/navigation';
import { renderHook } from '@testing-library/react';

import { ERROR_CONFIGS } from '../../lib';
import { useSyncError } from '../use-sync-error';

// Мокируем next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

const mockUseSearchParams = useSearchParams as jest.Mock;

describe('useSyncError', () => {
  it('should return sync_failed config when error param is "sync_failed"', () => {
    // Arrange
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('?error=sync_failed')
    );

    // Act
    const { result } = renderHook(() => useSyncError());

    // Assert
    expect(result.current.errorTitle).toBe(ERROR_CONFIGS.sync_failed.title);
    expect(result.current.errorMessage).toBe(ERROR_CONFIGS.sync_failed.message);
    expect(result.current.errorActions).toBe(ERROR_CONFIGS.sync_failed.actions);
  });

  it('should return default config when error param is not present', () => {
    // Arrange
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));

    // Act
    const { result } = renderHook(() => useSyncError());

    // Assert
    expect(result.current.errorTitle).toBe(ERROR_CONFIGS.default.title);
    expect(result.current.errorMessage).toBe(ERROR_CONFIGS.default.message);
    expect(result.current.errorActions).toBe(ERROR_CONFIGS.default.actions);
  });

  it('should return default config for any other error param', () => {
    // Arrange
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('?error=some_other_error')
    );

    // Act
    const { result } = renderHook(() => useSyncError());

    // Assert
    expect(result.current.errorTitle).toBe(ERROR_CONFIGS.default.title);
    expect(result.current.errorMessage).toBe(ERROR_CONFIGS.default.message);
    expect(result.current.errorActions).toBe(ERROR_CONFIGS.default.actions);
  });
});
