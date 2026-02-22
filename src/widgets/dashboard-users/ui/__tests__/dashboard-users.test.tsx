import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import type { User } from '../../../../features/user-profile-info';
import { useUsersManagement } from '../../hooks';
import type { UsersFilters } from '../../model';
import { DashboardUsers } from '../dashboard-users';

jest.mock('../../hooks', () => ({
  useUsersManagement: jest.fn(),
}));
jest.mock('../user-row', () => ({
  UserRow: ({
    user,
    onDelete,
    onRoleChange,
  }: {
    user: { id: string; email: string; role: string };
    onDelete: (id: string, email: string) => void;
    onRoleChange: (id: string, role: string) => void;
  }) => (
    <div data-testid={`user-row-${user.id}`}>
      <span>{user.email}</span>

      <button
        data-testid={`delete-user-button-${user.id}`}
        onClick={() => onDelete(user.id, user.email)}
      >
        Delete
      </button>

      <button
        data-testid={`change-role-button-${user.id}`}
        onClick={() => onRoleChange(user.id, 'admin')}
      >
        Make admin
      </button>
    </div>
  ),
}));

const createUser = (overrides?: Partial<User>): User => ({
  id: '1',
  email: 'test@example.com',
  firstName: null,
  lastName: null,
  role: 'USER',
  imageUrl: '',
  createdAt: null,
  lastSignInAt: null,
  ...overrides,
});

const defaultMock = {
  filters: {
    page: 1,
    limit: 10,
    emailSearch: '',
  } satisfies UsersFilters,

  deleteDialog: {
    open: false,
    userId: null as string | null,
    userEmail: null as string | null,
  },

  users: [] as User[],
  total: 0,
  page: 1,
  totalPages: 1,

  isLoading: false,
  isError: false,
  error: undefined as undefined | null,
  isFetching: false,
  debouncedEmailSearch: '',

  updateRoleMutation: {
    isPending: false,
    mutate: jest.fn(),
  },

  deleteUserMutation: {
    isPending: false,
    variables: null as string | null,
    mutate: jest.fn(),
  },

  handleRoleChange: jest.fn(),
  handleDeleteClick: jest.fn(),
  handleConfirmDelete: jest.fn(),
  handleCancelDelete: jest.fn(),
  handlePageChange: jest.fn(),
  handleItemsPerPageChange: jest.fn(),
  handleFiltersChange: jest.fn(),
  handleRefresh: jest.fn(),
  handlePrefetchNextPage: jest.fn(),

  isUserUpdatingRole: jest.fn().mockReturnValue(false),
  isUserDeleting: jest.fn().mockReturnValue(false),

  setFilters: jest.fn(),
  setDeleteDialog: jest.fn(),
};

const mockUseUsersManagement = (
  overrides: Partial<typeof defaultMock> = {}
) => {
  (useUsersManagement as jest.Mock).mockReturnValue({
    ...defaultMock,
    ...overrides,
  });
};

describe('DashboardUsers – unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUsersManagement();
  });

  it('renders DashboardUsers', () => {
    render(<DashboardUsers />);
    expect(screen.getByText(/user management/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseUsersManagement({ isLoading: true });
    render(<DashboardUsers />);
    expect(screen.getByTestId('users-loading')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseUsersManagement({ isError: true });
    render(<DashboardUsers />);
    expect(screen.getByText(/error loading users/i)).toBeInTheDocument();
  });

  it('renders users list', () => {
    mockUseUsersManagement({
      users: [createUser()],
      total: 1,
    });

    render(<DashboardUsers />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('calls handleFiltersChange on search', async () => {
    const user = userEvent.setup();
    const handleFiltersChange = jest.fn();

    mockUseUsersManagement({ handleFiltersChange });

    render(<DashboardUsers />);
    await user.type(screen.getByTestId('user-search-input'), 'a');

    expect(handleFiltersChange).toHaveBeenCalled();
  });
  it('calls handleRoleChange when role is changed', async () => {
    const user = userEvent.setup();
    const handleRoleChange = jest.fn();

    mockUseUsersManagement({
      users: [
        {
          id: '42',
          email: 'role@test.com',
          firstName: null,
          lastName: null,
          role: 'user',
          imageUrl: '',
          createdAt: null,
          lastSignInAt: null,
        },
      ],
      handleRoleChange,
    });

    render(<DashboardUsers />);

    await user.click(screen.getByTestId('change-role-button-42'));

    expect(handleRoleChange).toHaveBeenCalledWith('42', 'admin');
  });

  it('calls handleDeleteClick', async () => {
    const user = userEvent.setup();
    const handleDeleteClick = jest.fn();

    mockUseUsersManagement({
      users: [createUser({ id: '42', email: 'delete@test.com' })],
      handleDeleteClick,
    });

    render(<DashboardUsers />);
    await user.click(screen.getByTestId('delete-user-button-42'));

    expect(handleDeleteClick).toHaveBeenCalledWith('42', 'delete@test.com');
  });
});


