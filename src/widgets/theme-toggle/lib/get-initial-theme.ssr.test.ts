/**
 * @jest-environment node
 */
// это специальная деректива тест выполняется на node
import { Theme } from '../model/types';
import { getInitialTheme } from './get-initial-theme';

describe('getInitialTheme (SSR)', () => {
  const storageKey = 'theme-preference';
  const defaultTheme: Theme = 'light';

  it('returns default theme when window is undefined (SSR)', () => {
    // Здесь реально нет window, потому что окружение node
    expect(typeof window).toBe('undefined');

    const result = getInitialTheme(storageKey, true, defaultTheme);

    expect(result).toBe(defaultTheme);
  });
});
