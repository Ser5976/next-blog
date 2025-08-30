import { Theme } from '../model/types';

interface ApplyThemeOptions {
  theme: Theme;
  storageKey: string;
  attribute: string;
  enableSystem: boolean;
  disableTransitionOnChange: boolean;
}

export function applyTheme({
  theme,
  storageKey,
  attribute,
  enableSystem,
  disableTransitionOnChange,
}: ApplyThemeOptions): void {
  if (typeof window === 'undefined') return;

  let resolvedTheme = theme;

  if (theme === 'system' && enableSystem) {
    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  if (disableTransitionOnChange) {
    document.documentElement.classList.add('disable-transitions');
  }

  if (attribute === 'class') {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);
  } else {
    document.documentElement.setAttribute(attribute, resolvedTheme);
  }

  try {
    localStorage.setItem(storageKey, theme);
  } catch (error) {
    console.warn('Failed to save theme:', error);
  }

  if (disableTransitionOnChange) {
    setTimeout(() => {
      document.documentElement.classList.remove('disable-transitions');
    }, 10);
  }
}
