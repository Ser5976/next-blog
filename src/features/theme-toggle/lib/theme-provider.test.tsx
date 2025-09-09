
import { render, screen, fireEvent } from '@testing-library/react';
import { useContext } from 'react';
import { ThemeContext, useThemeInit } from '../model';
import { ThemeProvider } from './theme-provider';

// Мокируем хук useThemeInit
jest.mock('../model/use-theme-init');

const mockedUseThemeInit = useThemeInit as jest.Mock;

// Тестовый компонент для использования контекста
const TestConsumer = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useContext must be used within a ThemeProvider');
  }
  const { theme, setTheme } = context;
  return (
    <div>
      <span>Current theme: {theme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  const setThemeMock = jest.fn();

  beforeEach(() => {
    setThemeMock.mockClear();
  });

  it('should render children', () => {
    mockedUseThemeInit.mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    render(
      <ThemeProvider>
        <div>Child Component</div>
      </ThemeProvider>,
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('should provide theme and setTheme to children', () => {
    mockedUseThemeInit.mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText('Current theme: light')).toBeInTheDocument();
  });

  it('should allow children to update the theme', () => {
    mockedUseThemeInit.mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByText('Set Dark'));
    expect(setThemeMock).toHaveBeenCalledWith('dark');

    fireEvent.click(screen.getByText('Set Light'));
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it('should update the displayed theme when it changes', () => {
    // Начальное значение
    mockedUseThemeInit.mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    const { rerender } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText('Current theme: light')).toBeInTheDocument();

    // Обновляем мок, чтобы имитировать изменение темы
    mockedUseThemeInit.mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });

    // Перерисовываем компонент с новым значением контекста
    rerender(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText('Current theme: dark')).toBeInTheDocument();
  });
});
