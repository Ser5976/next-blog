import React, { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { UserProfile } from '../user-profile';

// Мокаем Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: ReactNode;
    href: string;
  }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Мокаем дочерние компоненты
jest.mock('@/features/user-profile-info', () => ({
  UserProfileInfo: ({ userId }: { userId: string }) => (
    <div data-testid="user-profile-info" data-user-id={userId}>
      Mock UserProfileInfo
    </div>
  ),
}));

jest.mock('../user-content', () => ({
  UserContent: ({ userId }: { userId: string }) => (
    <div data-testid="user-content" data-user-id={userId}>
      Mock UserContent
    </div>
  ),
}));

// Мокаем UI компоненты
jest.mock('@/shared/ui', () => ({
  Button: ({
    children,
    variant,
    size,
    className,
  }: {
    children: ReactNode;
    variant: string;
    size: string;
    className: string;
  }) => (
    <button
      data-testid="button"
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {children}
    </button>
  ),
  Title: ({ children }: { children: ReactNode }) => (
    <h1 data-testid="title">{children}</h1>
  ),
  Subtitle: ({ children }: { children: ReactNode }) => (
    <h2 data-testid="subtitle">{children}</h2>
  ),
}));

// Мокаем константы
jest.mock('../../lib', () => ({
  DASHBOARD_HEADER: {
    title: 'Users Dashboard',
    subtitle: 'Manage your users and their content',
  },
}));

// Мокаем иконки
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft Icon</div>,
}));

describe('UserProfile', () => {
  const userId = 'test-user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Рендеринг компонента с правильным userId
  it('renders component with correct userId', () => {
    render(<UserProfile userId={userId} />);

    expect(screen.getByTestId('user-profile-info')).toHaveAttribute(
      'data-user-id',
      userId
    );
    expect(screen.getByTestId('user-content')).toHaveAttribute(
      'data-user-id',
      userId
    );
  });

  // Test 2: Рендеринг заголовка с кнопкой назад
  it('renders header with back button and correct title/subtitle', () => {
    render(<UserProfile userId={userId} />);

    const backButton = screen.getByTestId('button');
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('data-variant', 'ghost');
    expect(backButton).toHaveAttribute('data-size', 'sm');
    expect(backButton).toHaveClass(
      'h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer'
    );

    expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();

    const link = screen.getByTestId('next-link');
    expect(link).toHaveAttribute('href', '/dashboard/users');

    expect(screen.getByTestId('title')).toHaveTextContent('Users Dashboard');
    expect(screen.getByTestId('subtitle')).toHaveTextContent(
      'Manage your users and their content'
    );
  });

  // Test 3: Проверка структуры сетки (grid layout)
  it('renders correct grid layout structure', () => {
    const { container } = render(<UserProfile userId={userId} />);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('space-y-6');

    // Ищем контейнер с заголовком (первый div после mainContainer)
    const headerWrapper = container.firstChild?.firstChild;
    expect(headerWrapper).toHaveClass(
      'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'
    );

    const gridContainer = screen.getByTestId('user-profile-info').parentElement;
    expect(gridContainer).toHaveClass('grid grid-cols-1 lg:grid-cols-3 gap-6');
  });

  // Test 4: Проверка что заголовок содержит правильную структуру
  it('has correct header structure with back button and title section', () => {
    render(<UserProfile userId={userId} />);

    const headerContainer = screen
      .getByText('Users Dashboard')
      .closest('.flex');
    expect(headerContainer).toBeInTheDocument();
    expect(
      headerContainer?.querySelector('[data-testid="button"]')
    ).toBeInTheDocument();
    expect(
      headerContainer?.querySelector('[data-testid="title"]')
    ).toBeInTheDocument();
    expect(
      headerContainer?.querySelector('[data-testid="subtitle"]')
    ).toBeInTheDocument();
  });

  // Test 5: Проверка что кнопка назад действительно является ссылкой
  it('back button is wrapped in Next.js Link component', () => {
    render(<UserProfile userId={userId} />);

    const link = screen.getByTestId('next-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard/users');
    expect(link.querySelector('[data-testid="button"]')).toBeInTheDocument();
  });

  // Test 6: Проверка что компонент рендерится с пропсом userId
  it('passes userId prop correctly to child components', () => {
    const customUserId = 'custom-user-789';
    render(<UserProfile userId={customUserId} />);

    expect(screen.getByTestId('user-profile-info')).toHaveAttribute(
      'data-user-id',
      customUserId
    );
    expect(screen.getByTestId('user-content')).toHaveAttribute(
      'data-user-id',
      customUserId
    );
  });

  // Test 7: Интеграционный тест
  it('renders all main components together', () => {
    render(<UserProfile userId={userId} />);

    expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('user-profile-info')).toBeInTheDocument();
    expect(screen.getByTestId('user-content')).toBeInTheDocument();

    expect(screen.getByText('Users Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('Manage your users and their content')
    ).toBeInTheDocument();
    expect(screen.getByText('Mock UserProfileInfo')).toBeInTheDocument();
    expect(screen.getByText('Mock UserContent')).toBeInTheDocument();
  });

  // Test 8: Проверка порядка элементов в заголовке
  it('has correct order of elements in header', () => {
    render(<UserProfile userId={userId} />);

    const headerContainer = screen
      .getByText('Users Dashboard')
      .closest('.flex');
    expect(headerContainer).toBeInTheDocument();

    // Проверяем что внутри заголовка есть кнопка и текст
    expect(
      headerContainer?.querySelector('[data-testid="button"]')
    ).toBeInTheDocument();
    expect(
      headerContainer?.querySelector('[data-testid="title"]')
    ).toBeInTheDocument();
  });
});
