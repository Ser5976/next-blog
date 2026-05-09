import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthButton } from '../auth-button';

// Создаем мок-компоненты для Clerk
const MockSignedIn = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="signed-in">{children}</div>
);
const MockSignedOut = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="signed-out">{children}</div>
);

const MockSignInButton = ({ children }: { children: React.ReactNode }) => (
  <div
    data-testid="sign-in-button"
    onClick={() => {
      /* mock implementation */
    }}
  >
    {children}
  </div>
);

const MockUserButton = () => (
  <div
    data-testid="user-button"
    onClick={() => {
      /* mock implementation */
    }}
  >
    User Profile
  </div>
);

jest.mock('@clerk/nextjs', () => ({
  SignedIn: jest.fn(),
  SignedOut: jest.fn(),
  SignInButton: jest.fn(),
  UserButton: jest.fn(),
  useAuth: jest.fn(),
}));

// Создаем мок для других компонентов
jest.mock('lucide-react', () => ({
  User: ({
    className,
    'aria-hidden': ariaHidden,
  }: {
    className?: string;
    'aria-hidden'?: boolean;
  }) => (
    <svg data-testid="user-icon" className={className} aria-hidden={ariaHidden}>
      User Icon
    </svg>
  ),
}));

jest.mock('@/shared/ui', () => ({
  Button: ({
    children,
    variant,
    size,
    'aria-label': ariaLabel,
    className,
    onClick,
  }: {
    children: React.ReactNode;
    variant: string;
    size: string;
    'aria-label': string;
    className?: string;
    onClick?: () => void;
  }) => (
    <button
      data-testid="custom-button"
      data-variant={variant}
      data-size={size}
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

jest.mock('../client-user-button', () => ({
  __esModule: true,
  default: () => <div data-testid="client-user-button">User Profile</div>,
}));

describe('AuthButton', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();

    (SignedIn as unknown as jest.Mock).mockImplementation(MockSignedIn);
    (SignedOut as unknown as jest.Mock).mockImplementation(MockSignedOut);
    (SignInButton as unknown as jest.Mock).mockImplementation(MockSignInButton);
    (UserButton as unknown as jest.Mock).mockImplementation(MockUserButton);
  });

  // Неавторизованный пользователь
  it('should render sign in button when user is signed out', () => {
    (SignedOut as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => (
        <div data-testid="signed-out">{children}</div>
      )
    );

    (SignedIn as unknown as jest.Mock).mockImplementation(() => null);

    render(<AuthButton />);

    const signInButton = screen.getByTestId('sign-in-button');
    expect(signInButton).toBeInTheDocument();

    const userIcon = screen.getByTestId('user-icon');
    expect(userIcon).toBeInTheDocument();
    expect(userIcon).toHaveAttribute('aria-hidden', 'true');

    const userButton = screen.queryByTestId('user-button');
    expect(userButton).not.toBeInTheDocument();

    const customButton = screen.getByTestId('custom-button');
    expect(customButton).toHaveAttribute('aria-label', 'User account');
    // Исправлено: ожидаем 'outline' вместо 'secondary'
    expect(customButton).toHaveAttribute('data-variant', 'outline');
    expect(customButton).toHaveAttribute('data-size', 'icon');
    expect(customButton).toHaveClass('cursor-pointer');
  });

  // Авторизированные пользователь
  it('should render user profile button when user is signed in', () => {
    (SignedIn as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => (
        <div data-testid="signed-in">{children}</div>
      )
    );

    (SignedOut as unknown as jest.Mock).mockImplementation(() => null);

    render(<AuthButton />);

    const clientUserButton = screen.getByTestId('client-user-button');
    expect(clientUserButton).toBeInTheDocument();

    const signInButton = screen.queryByTestId('sign-in-button');
    expect(signInButton).not.toBeInTheDocument();

    const userIcon = screen.queryByTestId('user-icon');
    expect(userIcon).not.toBeInTheDocument();

    const customButton = screen.getByTestId('custom-button');
    expect(customButton).toHaveAttribute('aria-label', 'User account');
    // Исправлено: ожидаем 'outline' вместо 'ghost'
    expect(customButton).toHaveAttribute('data-variant', 'outline');
    expect(customButton).toHaveAttribute('data-size', 'icon');
    expect(customButton).toHaveClass('cursor-pointer');
  });

  // Клик по кнопке входа
  it('should call SignInButton when sign in button is clicked', async () => {
    const mockClickHandler = jest.fn();

    (SignInButton as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => (
        <div data-testid="sign-in-button" onClick={mockClickHandler}>
          {children}
        </div>
      )
    );

    (SignedOut as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => (
        <div data-testid="signed-out">{children}</div>
      )
    );

    (SignedIn as unknown as jest.Mock).mockImplementation(() => null);

    render(<AuthButton />);

    const signInButton = screen.getByTestId('sign-in-button');
    await user.click(signInButton);

    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });

  // Тест доступности
  it('should have proper accessibility attributes', () => {
    (SignedOut as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => (
        <div data-testid="signed-out">{children}</div>
      )
    );

    (SignedIn as unknown as jest.Mock).mockImplementation(() => null);

    render(<AuthButton />);

    const button = screen.getByRole('button', { name: 'User account' });
    expect(button).toBeInTheDocument();

    const userIcon = screen.getByTestId('user-icon');
    expect(userIcon).toHaveAttribute('aria-hidden', 'true');
  });

  // Тест переключения между состояниями
  it('should correctly switch between signed in and signed out states', () => {
    (SignedOut as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => (
        <div data-testid="signed-out">{children}</div>
      )
    );
    (SignedIn as unknown as jest.Mock).mockImplementation(() => null);

    const { rerender } = render(<AuthButton />);

    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.queryByTestId('client-user-button')).not.toBeInTheDocument();

    (SignedIn as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => (
        <div data-testid="signed-in">{children}</div>
      )
    );
    (SignedOut as unknown as jest.Mock).mockImplementation(() => null);

    rerender(<AuthButton />);

    expect(screen.getByTestId('client-user-button')).toBeInTheDocument();
    expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument();
  });
});
