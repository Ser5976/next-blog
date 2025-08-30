import { Theme } from '../model/types';
import { getInitialTheme } from './get-initial-theme';

// Создаем мок для localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

// Подменяем глобальный localStorage на наш мок
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Мок для window.matchMedia
const matchMediaMock = jest.fn().mockImplementation((query) => ({
  matches: query === '(prefers-color-scheme: dark)',
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
});

describe('getInitialTheme', () => {
  const storageKey = 'theme-preference';
  const defaultTheme: Theme = 'light';

  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
    // Сбрасываем состояние matchMedia
    matchMediaMock.mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  test('should return stored theme from localStorage when available', () => {
    // Мокируем что в localStorage есть сохраненная тема
    const storedTheme: Theme = 'dark';
    localStorageMock.getItem.mockReturnValue(storedTheme);

    // Вызываем функцию
    const result = getInitialTheme(storageKey, true, defaultTheme);

    // Проверяем что функция обратилась к localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith(storageKey);

    // Проверяем что вернулась сохраненная тема
    expect(result).toBe(storedTheme);
  });

  test('should return system dark theme when enableSystem is true and no stored theme', () => {
    // Мокируем что в localStorage нет темы
    localStorageMock.getItem.mockReturnValue(null);

    // Мокируем систему с темной темой
    matchMediaMock.mockImplementation((query) => ({
      matches: true, // Темная тема
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Вызываем функцию с enableSystem = true
    const result = getInitialTheme(storageKey, true, defaultTheme);

    // Проверяем что функция обратилась к localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith(storageKey);

    // Проверяем что функция проверила системные настройки
    expect(window.matchMedia).toHaveBeenCalledWith(
      '(prefers-color-scheme: dark)'
    );

    // Проверяем что вернулась системная темная тема
    expect(result).toBe('dark');
  });

  test('should return system light theme when enableSystem is true and no stored theme', () => {
    // Мокируем что в localStorage нет темы
    localStorageMock.getItem.mockReturnValue(null);

    // Мокируем систему со светлой темой
    matchMediaMock.mockImplementation((query) => ({
      matches: false, // Светлая тема
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Вызываем функцию с enableSystem = true
    const result = getInitialTheme(storageKey, true, defaultTheme);

    // Проверяем что вернулась системная светлая тема
    expect(result).toBe('light');
  });

  test('should return default theme when enableSystem is false and no stored theme', () => {
    // Мокируем что в localStorage нет темы
    localStorageMock.getItem.mockReturnValue(null);

    // Вызываем функцию с enableSystem = false
    const result = getInitialTheme(storageKey, false, defaultTheme);

    // Проверяем что функция обратилась к localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith(storageKey);

    // Проверяем что вернулась тема по умолчанию
    expect(result).toBe(defaultTheme);
  });

  test('should return default theme when localStorage throws error', () => {
    // Мокируем ошибку в localStorage
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage unavailable');
    });

    // Спионим на console.warn чтобы проверить что ошибка логируется
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    // Вызываем функцию
    const result = getInitialTheme(storageKey, true, defaultTheme);

    // Проверяем что ошибка была залогирована
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Theme initialization error:',
      expect.any(Error)
    );

    // Проверяем что вернулась тема по умолчанию при ошибке
    expect(result).toBe(defaultTheme);

    // Восстанавливаем console.warn
    consoleWarnSpy.mockRestore();
  });

  test('should return default theme when localStorage returns empty string', () => {
    // Мокируем пустую строку в localStorage
    localStorageMock.getItem.mockReturnValue('');

    // Отключаем системную тему чтобы гарантированно получить default
    const result = getInitialTheme(storageKey, false, defaultTheme);

    // Проверяем что пустая строка обрабатывается как отсутствие темы
    expect(result).toBe(defaultTheme);
  });

  test('should return invalid theme as-is when from localStorage', () => {
    // Мокируем невалидное значение темы
    const invalidTheme = 'invalid-theme';
    localStorageMock.getItem.mockReturnValue(invalidTheme);

    // Вызываем функцию
    const result = getInitialTheme(storageKey, true, defaultTheme);

    // Проверяем что невалидное значение возвращается как есть
    // (текущее поведение функции)
    expect(result).toBe(invalidTheme);
  });

  test('should use system theme when localStorage returns empty string and system enabled', () => {
    // Мокируем пустую строку в localStorage
    localStorageMock.getItem.mockReturnValue('');

    // Мокируем систему с темной темой
    matchMediaMock.mockImplementation((query) => ({
      matches: true, // Темная тема
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Включаем системную тему
    const result = getInitialTheme(storageKey, true, defaultTheme);

    // Проверяем что используется системная тема
    expect(result).toBe('dark');
  });
});
