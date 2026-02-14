// user-profile-info.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { useUserProfile } from '../../hooks';
import { UserProfileInfo } from '../user-profile-info';

// Мокаем хук
jest.mock('../../hooks', () => ({
  useUserProfile: jest.fn(),
}));

// Мокаем функции форматирования
jest.mock('@/shared/lib', () => ({
  formatDate: jest.fn((date) => {
    if (!date) return 'Not available';
    return 'January 1, 2024';
  }),
}));

// Мокаем UI компоненты
jest.mock('@/shared/ui', () => ({
  ListSkeleton: ({
    count,
    itemClassName,
  }: {
    count: number;
    itemClassName: string;
  }) => (
    <div data-testid="list-skeleton">
      <div data-testid="skeleton-item" className={itemClassName}>
        Loading {count} items...
      </div>
    </div>
  ),
  UniversalError: ({
    error,
    title,
    icon,
  }: {
    error: Error | null;
    title: string;
    icon: React.ReactNode;
  }) => (
    <div data-testid="universal-error">
      <div data-testid="error-icon">{icon}</div>
      <h3 data-testid="error-title">{title}</h3>
      {error && <p data-testid="error-message">{error.message}</p>}
    </div>
  ),
}));

jest.mock('@/shared/ui/badge', () => ({
  Badge: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) => (
    <div data-testid="badge" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('@/shared/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) => (
    <h2 data-testid="card-title" className={className}>
      {children}
    </h2>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('@/shared/ui/separator', () => ({
  Separator: ({
    'aria-orientation': orientation,
  }: {
    'aria-orientation': 'horizontal' | 'vertical';
  }) => <hr data-testid="separator" aria-orientation={orientation} />,
}));

// Создаем тестовые данные
const createMockUser = (overrides?: any) => ({
  id: 'user-123',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'author',
  imageUrl: 'https://example.com/avatar.jpg',
  createdAt: 1704067200000, // 2024-01-01
  lastSignInAt: 1704153600000, // 2024-01-02
  ...overrides,
});

// Дефолтный мок для хука
const defaultUseUserProfileMock = {
  data: undefined,
  isLoading: false,
  isError: false,
  error: null as Error | null,
  refetch: jest.fn(),
};

const mockUseUserProfile = (
  overrides: Partial<typeof defaultUseUserProfileMock> = {}
) => {
  (useUserProfile as jest.Mock).mockReturnValue({
    ...defaultUseUserProfileMock,
    ...overrides,
  });
};

describe('UserProfileInfo', () => {
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUserProfile();
  });

  // Тест 1: Рендеринг компонента с данными пользователя
  it('renders user profile information correctly', () => {
    const mockUser = createMockUser();
    mockUseUserProfile({ data: mockUser });

    render(<UserProfileInfo userId={userId} />);

    // Проверяем что компонент отрендерился
    expect(screen.getByTestId('user-profile-info')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toBeInTheDocument();

    // Проверяем заголовок
    expect(screen.getByTestId('card-title')).toHaveTextContent(
      'Profile Information'
    );

    // Проверяем аватар и имя
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('user-full-name')).toHaveTextContent('John Doe');

    // Проверяем бейдж роли
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-blue-100 text-blue-800 border-blue-200');
    expect(screen.getByText('Author')).toBeInTheDocument();

    // Проверяем контактную информацию
    expect(screen.getByTestId('contact-info-section')).toBeInTheDocument();
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'john.doe@example.com'
    );
    expect(screen.getByTestId('user-id')).toHaveTextContent('user-123');

    // Проверяем даты
    expect(screen.getByTestId('joined-date-value')).toHaveTextContent(
      'January 1, 2024'
    );
    expect(screen.getByTestId('last-signin-date-value')).toBeInTheDocument();
  });

  // Тест 2: Рендеринг состояния загрузки
  it('shows loading state when isLoading is true', () => {
    mockUseUserProfile({ isLoading: true });

    render(<UserProfileInfo userId={userId} />);

    expect(screen.getByTestId('user-profile-info-loading')).toBeInTheDocument();
    expect(screen.getByTestId('list-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-item')).toHaveClass('h-[550px]');
    expect(screen.getByLabelText('Loading user profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading user profile')).toHaveAttribute(
      'aria-busy',
      'true'
    );
  });

  // Тест 3: Рендеринг состояния ошибки
  it('shows error state when isError is true', () => {
    const error = new Error('Failed to fetch user profile');
    mockUseUserProfile({
      isError: true,
      error,
    });

    render(<UserProfileInfo userId={userId} />);

    expect(screen.getByTestId('user-profile-info-error')).toBeInTheDocument();
    expect(screen.getByTestId('universal-error')).toBeInTheDocument();
    expect(screen.getByTestId('error-title')).toHaveTextContent(
      'User not found'
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByLabelText('User profile error')).toBeInTheDocument();
  });

  // Тест 4: Рендеринг с пользователем у которого нет firstName/lastName
  it('renders correctly when user has no firstName and lastName', () => {
    const mockUser = createMockUser({
      firstName: null,
      lastName: null,
      email: 'test@example.com',
    });
    mockUseUserProfile({ data: mockUser });

    render(<UserProfileInfo userId={userId} />);

    expect(screen.getByTestId('user-full-name')).toHaveTextContent('test');
    expect(screen.getByLabelText(/Avatar of test/)).toBeInTheDocument();
  });

  // Тест 5: Рендеринг с пользователем у которого только firstName
  it('renders correctly when user has only firstName', () => {
    const mockUser = createMockUser({
      firstName: 'John',
      lastName: null,
    });
    mockUseUserProfile({ data: mockUser });

    render(<UserProfileInfo userId={userId} />);

    expect(screen.getByTestId('user-full-name')).toHaveTextContent('John');
  });

  // Тест 6: Рендеринг с пользователем у которого только lastName
  it('renders correctly when user has only lastName', () => {
    const mockUser = createMockUser({
      firstName: null,
      lastName: 'Doe',
    });
    mockUseUserProfile({ data: mockUser });

    render(<UserProfileInfo userId={userId} />);

    expect(screen.getByTestId('user-full-name')).toHaveTextContent('Doe');
  });

  // Тест 7: Рендеринг с пользователем у которого нет email (fallback на 'User')
  it('renders correctly when user has no email', () => {
    const mockUser = createMockUser({
      firstName: null,
      lastName: null,
      email: '',
    });
    mockUseUserProfile({ data: mockUser });

    render(<UserProfileInfo userId={userId} />);

    expect(screen.getByTestId('user-full-name')).toHaveTextContent('User');
  });

  // Тест 8: Рендеринг аватара-плейсхолдера когда нет imageUrl
  it('shows avatar placeholder when imageUrl is empty', () => {
    const mockUser = createMockUser({
      imageUrl: '',
    });
    mockUseUserProfile({ data: mockUser });

    render(<UserProfileInfo userId={userId} />);

    expect(screen.queryByTestId('user-avatar')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-avatar-placeholder')).toBeInTheDocument();
  });

  // Тест 9: Не показывает lastSignIn если его нет
  it('does not show last sign in date when lastSignInAt is null', () => {
    const mockUser = createMockUser({
      lastSignInAt: null,
    });
    mockUseUserProfile({ data: mockUser });

    render(<UserProfileInfo userId={userId} />);

    expect(screen.queryByTestId('last-signin-date')).not.toBeInTheDocument();
  });

  // Тест 10: Проверяем наличие всех необходимых aria-меток
  it('has proper accessibility attributes', () => {
    const mockUser = createMockUser();
    mockUseUserProfile({ data: mockUser });

    render(<UserProfileInfo userId={userId} />);

    expect(
      screen.getByLabelText('User profile information')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Avatar and name')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact information')).toBeInTheDocument();
    expect(screen.getByLabelText('Account dates')).toBeInTheDocument();
    expect(
      screen.getByLabelText(`Email: ${mockUser.email}`)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`User ID: ${mockUser.id}`)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`Joined date: January 1, 2024`)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`Last sign in date: January 1, 2024`)
    ).toBeInTheDocument();
  });

  // Тест 11: Проверяем наличие разделителей
  it('renders separators correctly', () => {
    const mockUser = createMockUser();
    mockUseUserProfile({ data: mockUser });

    render(<UserProfileInfo userId={userId} />);

    const separators = screen.getAllByTestId('separator');
    expect(separators).toHaveLength(2);
    expect(separators[0]).toHaveAttribute('aria-orientation', 'horizontal');
    expect(separators[1]).toHaveAttribute('aria-orientation', 'horizontal');
  });

  // Тест 12: Проверяем что компонент использует правильный userId
  it('passes userId to useUserProfile hook', () => {
    const testUserId = 'test-user-456';
    mockUseUserProfile({ data: createMockUser() });

    render(<UserProfileInfo userId={testUserId} />);

    expect(useUserProfile).toHaveBeenCalledWith(testUserId);
  });

  // Тест 13: Проверяем что компонент не рендерится с undefined данными
  it('handles undefined data gracefully', () => {
    mockUseUserProfile({ data: undefined });

    render(<UserProfileInfo userId={userId} />);

    expect(screen.getByTestId('user-profile-info')).toBeInTheDocument();
    expect(screen.getByTestId('user-full-name')).toHaveTextContent('User');
  });

  // Тест 14: Проверяем разные роли
  describe('role badges', () => {
    it('shows admin badge for admin role', () => {
      const mockUser = createMockUser({ role: 'admin' });
      mockUseUserProfile({ data: mockUser });

      render(<UserProfileInfo userId={userId} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-red-100 text-red-800 border-red-200');
      expect(screen.getByText('Administrator')).toBeInTheDocument();
    });

    it('shows author badge for author role', () => {
      const mockUser = createMockUser({ role: 'author' });
      mockUseUserProfile({ data: mockUser });

      render(<UserProfileInfo userId={userId} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-blue-100 text-blue-800 border-blue-200');
      expect(screen.getByText('Author')).toBeInTheDocument();
    });

    it('shows user badge for other roles', () => {
      const mockUser = createMockUser({ role: 'editor' });
      mockUseUserProfile({ data: mockUser });

      render(<UserProfileInfo userId={userId} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-gray-100 text-gray-800 border-gray-200');
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });
});
