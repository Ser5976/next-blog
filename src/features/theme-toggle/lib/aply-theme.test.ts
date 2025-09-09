import { applyTheme } from './apply-theme';

// Мокаем matchMedia, так как JSDOM его не реализует
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(), // старый API
      removeListener: jest.fn(),
      addEventListener: jest.fn(), // новый API
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

// Очищаем DOM и localStorage перед каждым тестом
beforeEach(() => {
  document.documentElement.className = '';
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
  jest.useFakeTimers(); // для теста с setTimeout
});

// После тестов возвращаемся к обычным таймерам
afterEach(() => {
  jest.useRealTimers();
});

describe('applyTheme', () => {
  it('applies light theme as class', () => {
    applyTheme({
      theme: 'light',
      storageKey: 'theme',
      attribute: 'class',
      enableSystem: true,
      disableTransitionOnChange: false,
    });

    // Проверяем, что <html> получил класс light
    expect(document.documentElement.classList.contains('light')).toBe(true);

    // Проверяем, что localStorage сохранил "light"
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('applies dark theme as attribute', () => {
    applyTheme({
      theme: 'dark',
      storageKey: 'theme',
      attribute: 'data-theme',
      enableSystem: true,
      disableTransitionOnChange: false,
    });

    // Проверяем, что у <html> появился data-theme="dark"
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('resolves to dark if theme=system and system prefers dark', () => {
    // matchMedia мок всегда возвращает matches=true для dark
    applyTheme({
      theme: 'system',
      storageKey: 'theme',
      attribute: 'class',
      enableSystem: true,
      disableTransitionOnChange: false,
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('system'); // сохраняется именно "system"
  });

  it('resolves to light if theme=system and system prefers light', () => {
    // Перемокаем matchMedia → matches=false
    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    applyTheme({
      theme: 'system',
      storageKey: 'theme',
      attribute: 'class',
      enableSystem: true,
      disableTransitionOnChange: false,
    });

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('system');
  });

  it('adds and removes disable-transitions class when disableTransitionOnChange=true', () => {
    applyTheme({
      theme: 'dark',
      storageKey: 'theme',
      attribute: 'class',
      enableSystem: true,
      disableTransitionOnChange: true,
    });

    // Сначала disable-transitions должен появиться
    expect(
      document.documentElement.classList.contains('disable-transitions')
    ).toBe(true);

    // Прокручиваем setTimeout (10 мс)
    jest.runAllTimers();

    // Потом disable-transitions должен удалиться
    expect(
      document.documentElement.classList.contains('disable-transitions')
    ).toBe(false);
  });

  it('does not crash when localStorage throws', () => {
    const setItemSpy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Storage failed');
      });

    expect(() =>
      applyTheme({
        theme: 'dark',
        storageKey: 'theme',
        attribute: 'class',
        enableSystem: true,
        disableTransitionOnChange: false,
      })
    ).not.toThrow();

    setItemSpy.mockRestore();
  });
});
