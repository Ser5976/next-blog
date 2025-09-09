'use client';

import { ThemeContext, useThemeInit } from '../model';
import type { ThemeProviderProps } from '../model';
import { DEFAULT_THEME, STORAGE_KEY, THEME_ATTRIBUTE } from './constants';

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = STORAGE_KEY,
  attribute = THEME_ATTRIBUTE,
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const { theme, setTheme } = useThemeInit({
    defaultTheme,
    storageKey,
    attribute,
    enableSystem,
    disableTransitionOnChange,
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
