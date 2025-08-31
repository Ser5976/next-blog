/**
 * @jest-environment jsdom
 */
import { getInitThemeScript } from './get-init-theme-script';

describe('getInitThemeScript', () => {
  it('returns a non-empty string', () => {
    // Генерируем скрипт с настройками по умолчанию
    const script = getInitThemeScript({});

    // Проверяем, что это строка
    expect(typeof script).toBe('string');

    // Проверяем, что строка не пустая
    expect(script.length).toBeGreaterThan(0);
  });

  it('substitutes a custom storageKey', () => {
    const script = getInitThemeScript({ storageKey: 'custom-key' });

    // В итоговой строке должен быть storageKey, который мы передали
    expect(script).toContain('custom-key');
  });

  it('substitutes custom defaultTheme', () => {
    const script = getInitThemeScript({ defaultTheme: 'dark' });

    // Проверяем, что внутри JS-строки есть наш defaultTheme
    expect(script).toContain('dark');
  });

  it('generates code correctly for attribute=class', () => {
    const script = getInitThemeScript({ attribute: 'class' });

    // Для class атрибута мы ожидаем вызовы работы с classList
    expect(script).toContain('classList.add');
    expect(script).toContain('classList.remove');
  });

  it('correctly generates code for custom attribute', () => {
    const script = getInitThemeScript({ attribute: 'data-theme' });

    // Для data-theme мы ожидаем, что используется setAttribute
    expect(script).toContain('setAttribute(attribute, theme)');
  });

  it('substitutes enableSystem=false', () => {
    const script = getInitThemeScript({ enableSystem: false });

    // Проверяем, что сгенерированная строка содержит наш флаг
    expect(script).toContain('var enableSystem = false;');
  });
});
