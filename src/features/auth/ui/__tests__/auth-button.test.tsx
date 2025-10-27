import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthButton } from '../auth-button';

// Делаем моки

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
    variant: 'secondary' | 'ghost';
    size: 'icon';
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

  //  ТЕСТ СЦЕНАРИЯ 1: НЕАВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ
  it('should render sign in button when user is signed out', () => {
    /**
     * Теория: Настраиваем моки для сценария неавторизованного пользователя
     * SignedOut показывает свой контент, SignedIn скрывает
     */

    // Настраиваем поведение моков
    (SignedOut as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => (
        <div data-testid="signed-out">{children}</div>
      )
    );

    (SignedIn as unknown as jest.Mock).mockImplementation(() => null);

    render(<AuthButton />);

    // ПРОВЕРКИ для неавторизованного пользователя:

    // 1. Должна отображаться кнопка входа
    const signInButton = screen.getByTestId('sign-in-button');
    expect(signInButton).toBeInTheDocument();

    // 2. Должна отображаться иконка пользователя
    const userIcon = screen.getByTestId('user-icon');
    expect(userIcon).toBeInTheDocument();
    expect(userIcon).toHaveAttribute('aria-hidden', 'true');

    // 3. НЕ должна отображаться кнопка профиля
    const userButton = screen.queryByTestId('user-button');
    expect(userButton).not.toBeInTheDocument();

    // 4. Проверяем правильность пропсов у кастомной кнопки
    const customButton = screen.getByTestId('custom-button');
    expect(customButton).toHaveAttribute('aria-label', 'User account');
    expect(customButton).toHaveAttribute('data-variant', 'secondary');
    expect(customButton).toHaveAttribute('data-size', 'icon');
    expect(customButton).toHaveClass('cursor-pointer');
  });

  // 4. ТЕСТ СЦЕНАРИЯ 2: АВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ
  it('should render user profile button when user is signed in', () => {
    /**
     * Теория: Настраиваем моки для сценария авторизованного пользователя
     * SignedIn показывает свой контент, SignedOut скрывает
     */

    (SignedIn as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => (
        <div data-testid="signed-in">{children}</div>
      )
    );

    (SignedOut as unknown as jest.Mock).mockImplementation(() => null);

    render(<AuthButton />);

    // ПРОВЕРКИ для авторизованного пользователя:

    // 1. Должна отображаться кнопка профиля пользователя
    const clientUserButton = screen.getByTestId('client-user-button');
    expect(clientUserButton).toBeInTheDocument();

    // 2. НЕ должна отображаться кнопка входа
    const signInButton = screen.queryByTestId('sign-in-button');
    expect(signInButton).not.toBeInTheDocument();

    // 3. НЕ должна отображаться иконка пользователя для входа
    const userIcon = screen.queryByTestId('user-icon');
    expect(userIcon).not.toBeInTheDocument();

    // 4. Проверяем правильность пропсов у кастомной кнопки
    const customButton = screen.getByTestId('custom-button');
    expect(customButton).toHaveAttribute('aria-label', 'User account');
    expect(customButton).toHaveAttribute('data-variant', 'ghost');
    expect(customButton).toHaveAttribute('data-size', 'icon');
    expect(customButton).toHaveClass('cursor-pointer');
  });

  // 5. ТЕСТ ВЗАИМОДЕЙСТВИЯ: КЛИК ПО КНОПКЕ ВХОДА С USER-EVENT
  it('should call SignInButton when sign in button is clicked', async () => {
    const mockClickHandler = jest.fn();

    // Мокаем SignInButton с обработчиком
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

    // КЛИКАЕМ ПО КНОПКЕ ВХОДА С ПОМОЩЬЮ userEvent
    const signInButton = screen.getByTestId('sign-in-button');
    await user.click(signInButton);

    // ПРОВЕРЯЕМ что обработчик был вызван
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });

  // 6. ТЕСТ ДОСТУПНОСТИ (ACCESSIBILITY)
  it('should have proper accessibility attributes', () => {
    (SignedOut as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => (
        <div data-testid="signed-out">{children}</div>
      )
    );

    (SignedIn as unknown as jest.Mock).mockImplementation(() => null);

    render(<AuthButton />);

    // Проверяем accessibility атрибуты
    const button = screen.getByRole('button', { name: 'User account' });
    expect(button).toBeInTheDocument();

    const userIcon = screen.getByTestId('user-icon');
    expect(userIcon).toHaveAttribute('aria-hidden', 'true');
  });

  // 7. ТЕСТ ПЕРЕКЛЮЧЕНИЯ МЕЖДУ СОСТОЯНИЯМИ
  it('should correctly switch between signed in and signed out states', () => {
    /**
     * Теория: Проверяем что компонент правильно реагирует на изменения
     * состояния аутентификации через разные рендеры
     */

    // Первый рендер - неавторизованный
    (SignedOut as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => (
        <div data-testid="signed-out">{children}</div>
      )
    );
    (SignedIn as unknown as jest.Mock).mockImplementation(() => null);

    const { rerender } = render(<AuthButton />);

    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.queryByTestId('client-user-button')).not.toBeInTheDocument();

    // Второй рендер - авторизованный
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
