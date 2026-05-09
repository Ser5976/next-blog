import { render, screen } from '@testing-library/react';

import { useClientSearchParams } from '../../model';
import { SignInComponent } from '../sign-in-component';

// Мокируем хук useClientSearchParams
jest.mock('../../model', () => ({
  useClientSearchParams: jest.fn(),
}));

// Мокируем Clerk компоненты
jest.mock('@clerk/nextjs', () => ({
  SignIn: ({
    signUpForceRedirectUrl,
    forceRedirectUrl,
  }: {
    signUpForceRedirectUrl?: string;
    forceRedirectUrl?: string;
  }) => (
    <div
      data-testid="clerk-signin"
      data-redirect-url={forceRedirectUrl || ''}
      data-signup-redirect-url={signUpForceRedirectUrl || ''}
    >
      Sign In Component
    </div>
  ),
}));

// Мокируем ClientOnly
jest.mock('../client-only', () => ({
  ClientOnly: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="client-only">{children}</div>
  ),
}));

const mockUseClientSearchParams = useClientSearchParams as jest.MockedFunction<
  typeof useClientSearchParams
>;

describe('SignInComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default redirect URL', () => {
    // Arrange
    mockUseClientSearchParams.mockReturnValue({
      searchParams: new URLSearchParams(),
      get: jest.fn().mockReturnValue(null),
    });

    // Act
    render(<SignInComponent />);

    // Assert - проверяем что ссылка на главную существует (она встроена, не отдельный компонент)
    const homeLink = screen.getByRole('link', {
      name: /VitaFlow Blog - Home page/i,
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');

    expect(screen.getByTestId('client-only')).toBeInTheDocument();
    expect(screen.getByTestId('clerk-signin')).toBeInTheDocument();
    expect(screen.getByTestId('clerk-signin')).toHaveAttribute(
      'data-signup-redirect-url',
      '/api/sync-user?redirect_url=%2F'
    );
  });

  it('should render with custom redirect URL', () => {
    // Arrange
    const mockGet = jest.fn().mockReturnValue('/dashboard');
    mockUseClientSearchParams.mockReturnValue({
      searchParams: new URLSearchParams(),
      get: mockGet,
    });

    // Act
    render(<SignInComponent />);

    // Assert
    expect(mockGet).toHaveBeenCalledWith('redirect_url');
    expect(screen.getByTestId('clerk-signin')).toHaveAttribute(
      'data-signup-redirect-url',
      '/api/sync-user?redirect_url=%2Fdashboard'
    );
  });

  it('should have proper accessibility attributes', () => {
    // Arrange
    mockUseClientSearchParams.mockReturnValue({
      searchParams: new URLSearchParams(),
      get: jest.fn().mockReturnValue(null),
    });

    // Act
    render(<SignInComponent />);

    // Assert
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveAttribute('aria-label', 'Sign in page');
  });

  it('should pass correct props to Clerk SignIn', () => {
    // Arrange
    const mockGet = jest.fn().mockReturnValue('/profile');
    mockUseClientSearchParams.mockReturnValue({
      searchParams: new URLSearchParams(),
      get: mockGet,
    });

    // Act
    render(<SignInComponent />);

    // Assert
    const clerkSignIn = screen.getByTestId('clerk-signin');
    expect(clerkSignIn).toHaveAttribute(
      'data-signup-redirect-url',
      '/api/sync-user?redirect_url=%2Fprofile'
    );
  });

  it('should handle empty redirect URL gracefully', () => {
    // Arrange
    const mockGet = jest.fn().mockReturnValue('');
    mockUseClientSearchParams.mockReturnValue({
      searchParams: new URLSearchParams(),
      get: mockGet,
    });

    // Act
    render(<SignInComponent />);

    // Assert
    expect(screen.getByTestId('clerk-signin')).toHaveAttribute(
      'data-signup-redirect-url',
      '/api/sync-user?redirect_url=%2F'
    );
  });

  it('should handle special characters in redirect URL', () => {
    // Arrange
    const mockGet = jest
      .fn()
      .mockReturnValue('/dashboard?tab=settings&view=list');
    mockUseClientSearchParams.mockReturnValue({
      searchParams: new URLSearchParams(),
      get: mockGet,
    });

    // Act
    render(<SignInComponent />);

    // Assert
    expect(screen.getByTestId('clerk-signin')).toHaveAttribute(
      'data-signup-redirect-url',
      '/api/sync-user?redirect_url=%2Fdashboard%3Ftab%3Dsettings%26view%3Dlist'
    );
  });
});
