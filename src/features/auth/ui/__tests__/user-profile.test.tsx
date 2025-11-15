import { useUser } from '@clerk/nextjs';
import { render, screen } from '@testing-library/react';

import { UserProfile } from '../user-profile';

// Создаем полные типы для моков Clerk
type ClerkUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  primaryEmailAddress: {
    id: string;
    emailAddress: string;
  } | null;
};

type UseUserReturnType = {
  isLoaded: boolean;
  user: ClerkUser | null;
  isSignedIn: boolean;
};

// Типизированный мок useUser
const mockUseUser = useUser as jest.MockedFunction<() => UseUserReturnType>;

// Мокаем Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

// Мокаем AuthButton
jest.mock('@/features/auth', () => ({
  AuthButton: () => <button data-testid="auth-button">Auth</button>,
}));

// Функция для создания мокового пользователя с полными типами
const createMockUser = (overrides: Partial<ClerkUser> = {}): ClerkUser => ({
  id: 'user_123',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  primaryEmailAddress: {
    id: 'email_123',
    emailAddress: 'john@example.com',
  },
  ...overrides,
});

describe('UserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading skeleton when data is loading', () => {
    mockUseUser.mockReturnValue({
      isLoaded: false,
      user: null,
      isSignedIn: false,
    });

    render(<UserProfile />);

    // Проверяем что отображается индикатор загрузки
    expect(screen.getByTestId('user-profile-loading')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading user profile')).toBeInTheDocument();

    // Проверяем наличие анимации загрузки
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('displays full user information when complete data is available', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: createMockUser(),
      isSignedIn: true,
    });

    render(<UserProfile />);

    // Проверяем что отображается основной контейнер профиля
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByLabelText('User profile')).toBeInTheDocument();

    // Проверяем что AuthButton отображается
    expect(screen.getByTestId('auth-button')).toBeInTheDocument();

    // Проверяем данные пользователя
    expect(screen.getByTestId('user-display-name')).toHaveTextContent(
      'John Doe'
    );
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'john@example.com'
    );
  });

  it('displays only first name when last name is missing', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: createMockUser({ lastName: null }),
      isSignedIn: true,
    });

    render(<UserProfile />);

    expect(screen.getByTestId('user-display-name')).toHaveTextContent('John');
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'john@example.com'
    );
  });

  it('displays username when both first and last name are missing', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: createMockUser({
        firstName: null,
        lastName: null,
      }),
      isSignedIn: true,
    });

    render(<UserProfile />);

    expect(screen.getByTestId('user-display-name')).toHaveTextContent(
      'johndoe'
    );
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'john@example.com'
    );
  });

  it('displays fallback text when user has minimal data', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: createMockUser({
        firstName: null,
        lastName: null,
        username: null,
        primaryEmailAddress: null,
      }),
      isSignedIn: true,
    });

    render(<UserProfile />);

    expect(screen.getByTestId('user-display-name')).toHaveTextContent('User');
    expect(screen.getByTestId('user-email')).toHaveTextContent('No email');
  });

  it('displays "No email" when email address is missing', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: createMockUser({ primaryEmailAddress: null }),
      isSignedIn: true,
    });

    render(<UserProfile />);

    expect(screen.getByTestId('user-display-name')).toHaveTextContent(
      'John Doe'
    );
    expect(screen.getByTestId('user-email')).toHaveTextContent('No email');
  });

  it('handles null user when loaded', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: null,
      isSignedIn: false,
    });

    render(<UserProfile />);

    expect(screen.getByTestId('user-display-name')).toHaveTextContent('User');
    expect(screen.getByTestId('user-email')).toHaveTextContent('No email');
  });

  it('correctly displays AuthButton component when loaded', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: createMockUser(),
      isSignedIn: true,
    });

    render(<UserProfile />);

    expect(screen.getByTestId('auth-button')).toBeInTheDocument();
  });

  it('has proper accessibility attributes in loading state', () => {
    mockUseUser.mockReturnValue({
      isLoaded: false,
      user: null,
      isSignedIn: false,
    });

    render(<UserProfile />);

    const loadingContainer = screen.getByTestId('user-profile-loading');
    expect(loadingContainer).toHaveAttribute('role', 'status');
    expect(loadingContainer).toHaveAttribute(
      'aria-label',
      'Loading user profile'
    );

    // Проверяем что декоративные элементы скрыты от screen readers с помощью querySelector
    const decorativeElements = document.querySelectorAll(
      '[aria-hidden="true"]'
    );
    expect(decorativeElements.length).toBeGreaterThan(0);
  });

  it('has proper accessibility attributes in loaded state', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: createMockUser(),
      isSignedIn: true,
    });

    render(<UserProfile />);

    const profileContainer = screen.getByTestId('user-profile');
    expect(profileContainer).toHaveAttribute('role', 'region');
    expect(profileContainer).toHaveAttribute('aria-label', 'User profile');

    // Проверяем элементы с aria-label
    expect(screen.getByLabelText('User display name')).toBeInTheDocument();
    expect(screen.getByLabelText('User email')).toBeInTheDocument();
  });

  it('does not display user data during loading state', () => {
    mockUseUser.mockReturnValue({
      isLoaded: false,
      user: null,
      isSignedIn: false,
    });

    render(<UserProfile />);

    // Проверяем что элементы с пользовательскими данными не отображаются во время загрузки
    expect(screen.queryByTestId('user-display-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-email')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-profile')).not.toBeInTheDocument();
  });
});
