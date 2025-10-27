import { render, screen } from '@testing-library/react';

import { useClientSearchParams } from '../../model';
import { SignUpComponent } from '../sign-up-component';

// Мокируем хук useClientSearchParams
jest.mock('../../model', () => ({
  useClientSearchParams: jest.fn(),
}));

// Мокируем Clerk компоненты
jest.mock('@clerk/nextjs', () => ({
  SignUp: ({ forceRedirectUrl }: { forceRedirectUrl: string }) => (
    <div data-testid="clerk-signup" data-redirect-url={forceRedirectUrl}>
      Sign Up Component
    </div>
  ),
}));

// Мокируем ClientOnly
jest.mock('../client-only', () => ({
  ClientOnly: ({
    children,
    fallback,
  }: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) => (
    <div data-testid="client-only">
      {fallback && <div data-testid="fallback">{fallback}</div>}
      {children}
    </div>
  ),
}));

// Мокируем HomeLink
jest.mock('../home-link', () => ({
  HomeLink: ({ className }: { className: string }) => (
    <div data-testid="home-link" className={className}>
      Home Link
    </div>
  ),
}));

// Мокируем LoadingSpinner
jest.mock('@/shared/ui', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

const mockUseClientSearchParams = useClientSearchParams as jest.MockedFunction<
  typeof useClientSearchParams
>;

describe('SignUpComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default redirect URL', () => {
    // Arrange
    mockUseClientSearchParams.mockReturnValue({
      isReady: true,
      searchParams: new URLSearchParams(),
      get: jest.fn().mockReturnValue(null),
    });

    // Act
    render(<SignUpComponent />);

    // Assert
    expect(screen.getByTestId('home-link')).toBeInTheDocument();
    expect(screen.getByTestId('client-only')).toBeInTheDocument();
    expect(screen.getByTestId('clerk-signup')).toBeInTheDocument();
    expect(screen.getByTestId('clerk-signup')).toHaveAttribute(
      'data-redirect-url',
      '/api/sync-user?redirect_url=%2F'
    );
  });

  it('should render with custom redirect URL', () => {
    // Arrange
    const mockGet = jest.fn().mockReturnValue('/dashboard');
    mockUseClientSearchParams.mockReturnValue({
      isReady: true,
      searchParams: new URLSearchParams(),
      get: mockGet,
    });

    // Act
    render(<SignUpComponent />);

    // Assert
    expect(mockGet).toHaveBeenCalledWith('redirect_url');
    expect(screen.getByTestId('clerk-signup')).toHaveAttribute(
      'data-redirect-url',
      '/api/sync-user?redirect_url=%2Fdashboard'
    );
  });

  it('should have proper accessibility attributes', () => {
    // Arrange
    mockUseClientSearchParams.mockReturnValue({
      isReady: true,
      searchParams: new URLSearchParams(),
      get: jest.fn().mockReturnValue(null),
    });

    // Act
    render(<SignUpComponent />);

    // Assert
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveAttribute('aria-label', 'Registration page');
  });

  it('should pass correct props to Clerk SignUp', () => {
    // Arrange
    const mockGet = jest.fn().mockReturnValue('/profile');
    mockUseClientSearchParams.mockReturnValue({
      isReady: true,
      searchParams: new URLSearchParams(),
      get: mockGet,
    });

    // Act
    render(<SignUpComponent />);

    // Assert
    const clerkSignUp = screen.getByTestId('clerk-signup');
    expect(clerkSignUp).toHaveAttribute(
      'data-redirect-url',
      '/api/sync-user?redirect_url=%2Fprofile'
    );
  });

  it('should render fallback loading spinner', () => {
    // Arrange
    mockUseClientSearchParams.mockReturnValue({
      isReady: true,
      searchParams: new URLSearchParams(),
      get: jest.fn().mockReturnValue(null),
    });

    // Act
    render(<SignUpComponent />);

    // Assert
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should handle empty redirect URL gracefully', () => {
    // Arrange
    const mockGet = jest.fn().mockReturnValue('');
    mockUseClientSearchParams.mockReturnValue({
      isReady: true,
      searchParams: new URLSearchParams(),
      get: mockGet,
    });

    // Act
    render(<SignUpComponent />);

    // Assert
    expect(screen.getByTestId('clerk-signup')).toHaveAttribute(
      'data-redirect-url',
      '/api/sync-user?redirect_url=%2F'
    );
  });

  it('should handle special characters in redirect URL', () => {
    // Arrange
    const mockGet = jest
      .fn()
      .mockReturnValue('/dashboard?tab=settings&view=list');
    mockUseClientSearchParams.mockReturnValue({
      isReady: true,
      searchParams: new URLSearchParams(),
      get: mockGet,
    });

    // Act
    render(<SignUpComponent />);

    // Assert
    expect(screen.getByTestId('clerk-signup')).toHaveAttribute(
      'data-redirect-url',
      '/api/sync-user?redirect_url=%2Fdashboard%3Ftab%3Dsettings%26view%3Dlist'
    );
  });

  it('should have proper CSS classes', () => {
    // Arrange
    mockUseClientSearchParams.mockReturnValue({
      isReady: true,
      searchParams: new URLSearchParams(),
      get: jest.fn().mockReturnValue(null),
    });

    // Act
    render(<SignUpComponent />);

    // Assert
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'min-h-screen'
    );

    const homeLink = screen.getByTestId('home-link');
    expect(homeLink).toHaveClass('m-4');
  });
});
