'use client';

import { useEffect, useState } from 'react';

import { applyTheme } from '../lib/apply-theme';
import { getInitialTheme } from '../lib/get-initial-theme';
import { Theme, UseThemeInitOptions } from './types';

export function useThemeInit({
  defaultTheme,
  storageKey,
  attribute,
  enableSystem,
  disableTransitionOnChange,
}: UseThemeInitOptions) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const initialTheme = getInitialTheme(
      storageKey,
      enableSystem,
      defaultTheme
    );
    setTheme(initialTheme);
  }, [defaultTheme, enableSystem, storageKey]);

  useEffect(() => {
    applyTheme({
      theme,
      storageKey,
      attribute,
      enableSystem,
      disableTransitionOnChange,
    });
  }, [theme, storageKey, attribute, enableSystem, disableTransitionOnChange]);

  return { theme, setTheme };
}
