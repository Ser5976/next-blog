'use client';

import { useContext } from 'react';

import { ThemeContext } from './theme-context';

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    // Возвращаем значения по умолчанию вместо ошибки
    return {
      theme: 'light' as const,
      setTheme: () => {},
    };
  }

  return context;
}
