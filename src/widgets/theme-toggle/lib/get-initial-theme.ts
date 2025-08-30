import { Theme } from '../model/types';

export function getInitialTheme(
  storageKey: string,
  enableSystem: boolean,
  defaultTheme: Theme
): Theme {
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  try {
    const stored = localStorage.getItem(storageKey) as Theme;
    if (stored) return stored;

    if (enableSystem) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
  } catch (error) {
    console.warn('Theme initialization error:', error);
  }

  return defaultTheme;
}
