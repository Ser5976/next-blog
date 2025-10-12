'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { ERROR_CONFIGS, ErrorType } from '../lib/error-config';

/**
 * Хук анализирует searchParams и возвращает соответствующую конфигурацию ошибки.
 * Поддерживаемые типы ошибок: 'sync_failed', 'default'
 */
export const useSyncError = () => {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  const errorData = useMemo(() => {
    // Определяем тип ошибки на основе параметра URL
    const errorType: ErrorType =
      errorParam === 'sync_failed' ? errorParam : 'default';

    // Получаем конфигурацию для данного типа ошибки
    const config = ERROR_CONFIGS[errorType];

    return {
      errorTitle: config.title,
      errorMessage: config.message,
      errorActions: config.actions,
    };
  }, [errorParam]);

  return errorData;
};
