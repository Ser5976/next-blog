import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { getFullName } from '@/features/user-profile-info';
/* ======================================================
   IMPORTS AFTER MOCKS
   ====================================================== */

import { formatDate } from '@/shared/lib';
import { ROLE_DISPLAY_NAMES } from '../../lib';
import { UserRow } from '../user-row';

/* ======================================================
   MOCKS — UI (shadcn / radix полностью вырезаем)
   ====================================================== */

jest.mock('@/shared/ui/select', () => ({
  Select: ({ children, onValueChange, disabled }: any) => (
    <div data-testid="role-select">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, {
              onValueChange,
              disabled,
            })
          : child
      )}
    </div>
  ),

  SelectTrigger: ({ children, disabled, ...props }: any) => (
    <button data-testid="role-select-trigger" disabled={disabled} {...props}>
      {children}
    </button>
  ),

  SelectContent: ({ children, onValueChange }: any) => (
    <div>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, { onValueChange })
          : child
      )}
    </div>
  ),

  SelectItem: ({ children, value, onValueChange }: any) => (
    <div
      data-testid={`role-option-${value}`}
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </div>
  ),

  SelectValue: ({ children }: any) => <>{children}</>,
}));

jest.mock('@/shared/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <>{children}</>,
  DropdownMenuContent: ({ children }: any) => (
    <div data-testid="user-actions-menu">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/shared/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

/* ======================================================
   MOCKS — icons, next
   ====================================================== */

jest.mock('lucide-react', () => {
  const Icon = (props: any) => <svg {...props} />;
  return {
    Calendar: Icon,
    Loader2: Icon,
    LogIn: Icon,
    Mail: Icon,
    MoreVertical: Icon,
    PenTool: Icon,
    Shield: Icon,
    User: Icon,
    UserIcon: Icon,
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

/* ======================================================
   MOCKS — shared/lib (ВАЖНО: requireActual)
   ====================================================== */

jest.mock('@/shared/lib', () => {
  const actual = jest.requireActual('@/shared/lib');
  return {
    __esModule: true,
    ...actual,
    formatDate: jest.fn(),
  };
});

/* ======================================================
   MOCKS — feature helpers
   ====================================================== */

jest.mock('@/features/user-profile-info', () => ({
  __esModule: true,
  getFullName: jest.fn(),
}));

/* ======================================================
   TEST DATA
   ====================================================== */

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  imageUrl: 'https://img.test/avatar.png',
  role: 'user',
  createdAt: 1670000000000,
  lastSignInAt: 1680000000000,
};

const defaultProps = {
  user: mockUser,
  onRoleChange: jest.fn(),
  onDelete: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (getFullName as jest.Mock).mockReturnValue('John Doe');
  (formatDate as jest.Mock).mockImplementation((v) => `formatted-${v}`);
});

/* ======================================================
   TESTS
   ====================================================== */

describe('UserRow', () => {
  it('renders user information', () => {
    render(<UserRow {...defaultProps} />);

    expect(screen.getByTestId('user-fullname')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email);
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
  });

  it('renders avatar placeholder when image is missing', () => {
    render(<UserRow {...defaultProps} user={{ ...mockUser, imageUrl: '' }} />);

    expect(screen.getByTestId('user-avatar-placeholder')).toBeInTheDocument();
  });

  it('shows formatted dates', () => {
    render(<UserRow {...defaultProps} />);

    expect(formatDate).toHaveBeenCalledWith(mockUser.createdAt);
    expect(formatDate).toHaveBeenCalledWith(mockUser.lastSignInAt);
  });

  it('shows current role label', () => {
    render(<UserRow {...defaultProps} />);

    expect(screen.getByTestId('current-role')).toHaveTextContent(
      ROLE_DISPLAY_NAMES.user
    );
  });

  it('calls onRoleChange when role changes', () => {
    render(<UserRow {...defaultProps} />);

    fireEvent.click(screen.getByTestId('role-select-trigger'));
    fireEvent.click(screen.getByTestId('role-option-admin'));

    expect(defaultProps.onRoleChange).toHaveBeenCalledWith(
      mockUser.id,
      'admin'
    );
  });

  it('does not call onRoleChange when selecting same role', () => {
    render(<UserRow {...defaultProps} />);

    fireEvent.click(screen.getByTestId('role-select-trigger'));
    fireEvent.click(screen.getByTestId('role-option-user'));

    expect(defaultProps.onRoleChange).not.toHaveBeenCalled();
  });

  it('disables controls while updating', () => {
    render(<UserRow {...defaultProps} isUpdatingRole />);

    expect(screen.getByTestId('role-select-trigger')).toBeDisabled();
  });

  it('calls onDelete from actions menu', () => {
    render(<UserRow {...defaultProps} />);

    fireEvent.click(screen.getByTestId('user-actions-button'));
    fireEvent.click(screen.getByTestId('delete-user-button'));

    expect(defaultProps.onDelete).toHaveBeenCalledWith(
      mockUser.id,
      mockUser.email
    );
  });

  it('disables actions while deleting', () => {
    render(<UserRow {...defaultProps} isDeleting />);

    expect(screen.getByTestId('role-select-trigger')).toBeDisabled();
    expect(screen.getByTestId('user-actions-button')).toBeDisabled();
  });

  it('handles unknown role', () => {
    render(
      <UserRow {...defaultProps} user={{ ...mockUser, role: 'superuser' }} />
    );

    expect(screen.getByTestId('current-role')).toHaveTextContent('superuser');
  });

  it('does not render last sign-in if missing', () => {
    render(
      <UserRow {...defaultProps} user={{ ...mockUser, lastSignInAt: null }} />
    );

    expect(screen.queryByTestId('user-last-signin')).not.toBeInTheDocument();
  });
});
