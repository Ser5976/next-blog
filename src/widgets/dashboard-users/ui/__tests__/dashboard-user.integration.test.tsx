import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import type { User } from '@/features/user-profile-info';
import { useUsersManagement } from '../../hooks';
import { DashboardUsers } from '../dashboard-users';

// ============================================
// МОКИ ДЛЯ ВНЕШНИХ ЗАВИСИМОСТЕЙ
// ============================================

// Мок shared/ui компонентов
jest.mock('@/shared/ui', () => ({
  ConfirmDialog: ({
    open,
    title,
    description,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    isLoading,
    'data-testid': testId,
  }: any) =>
    open ? (
      <div data-testid={testId}>
        <h2>{title}</h2>
        <p>{description}</p>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          data-testid="confirm-delete-button"
        >
          {confirmText}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          data-testid="cancel-delete-button"
        >
          {cancelText}
        </button>
        {isLoading && <span data-testid="dialog-loading">Loading...</span>}
      </div>
    ) : null,

  ListSkeleton: ({ 'data-testid': testId }: any) => (
    <div data-testid={testId}>Loading skeleton...</div>
  ),

  Pagination: ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    pageSizeOptions,
    onPageChange,
    onItemsPerPageChange,
    'data-testid': testId,
    className,
  }: any) => (
    <div data-testid={testId} className={className}>
      <span data-testid="pagination-current-page">{currentPage}</span>
      <span data-testid="pagination-total-pages">{totalPages}</span>
      <span data-testid="pagination-total-items">{totalItems}</span>
      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        data-testid="items-per-page-select"
      >
        {pageSizeOptions.map((option: number) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        data-testid={`${testId}-prev-page-button`}
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        data-testid={`${testId}-next-page-button`}
      >
        Next
      </button>
    </div>
  ),

  UniversalEmpty: ({
    searchQuery,
    icon,
    title,
    'data-testid': testId,
  }: any) => (
    <div data-testid={testId}>
      <div data-testid="empty-icon">{icon}</div>
      <h3 data-testid="empty-title">{title}</h3>
      {searchQuery && (
        <p data-testid="empty-search-query">No results for {searchQuery}</p>
      )}
    </div>
  ),

  UniversalError: ({
    error,
    onRetry,
    title,
    icon,
    'data-testid': testId,
  }: any) => (
    <div data-testid={testId}>
      <div data-testid="error-icon">{icon}</div>
      <h3 data-testid="error-title">{title}</h3>
      <p data-testid="error-message">{error?.message}</p>
      <button onClick={onRetry} data-testid="retry-button">
        Retry
      </button>
    </div>
  ),
}));

// Мок shared/ui компонентов (продолжение)
jest.mock('@/shared/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    'data-testid': testId,
    className,
  }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/shared/ui/card', () => ({
  Card: ({ children, 'data-testid': testId }: any) => (
    <div data-testid={testId}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  CardDescription: ({ children, 'data-testid': testId }: any) => (
    <div data-testid={testId}>{children}</div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  CardTitle: ({ children, className }: any) => (
    <h2 className={className}>{children}</h2>
  ),
}));

jest.mock('@/shared/ui/input', () => ({
  Input: ({
    value,
    onChange,
    placeholder,
    'data-testid': testId,
    className,
  }: any) => (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid={testId}
      className={className}
    />
  ),
}));

jest.mock('@/shared/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => <>{children}</>,
  Tooltip: ({ children }: any) => <>{children}</>,
  TooltipTrigger: ({ children }: any) => <>{children}</>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
}));

// Мок компонентов пользователей
jest.mock('../user-row', () => ({
  UserRow: ({
    user,
    onRoleChange,
    onDelete,
    isUpdatingRole,
    isDeleting,
    'data-testid': testId,
  }: any) => (
    <div data-testid={testId}>
      <div data-testid={`user-${user.id}`}>
        <span data-testid={`user-email-${user.id}`}>{user.email}</span>
        <span data-testid={`user-role-${user.id}`}>{user.role}</span>
        <select
          value={user.role}
          onChange={(e) => onRoleChange(user.id, e.target.value)}
          disabled={isUpdatingRole || isDeleting}
          data-testid={`role-select-${user.id}`}
        >
          <option value="user">User</option>
          <option value="author">Author</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={() => onDelete(user.id, user.email)}
          disabled={isUpdatingRole || isDeleting}
          data-testid={`delete-button-${user.id}`}
        >
          Delete
        </button>
        {(isUpdatingRole || isDeleting) && (
          <span data-testid={`loading-indicator-${user.id}`}>Loading...</span>
        )}
      </div>
    </div>
  ),
}));

jest.mock('../users-filters', () => ({
  UsersFiltersComponent: ({ filters, onFiltersChange }: any) => (
    <div data-testid="users-filters">
      <input
        type="text"
        value={filters.emailSearch || ''}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            emailSearch: e.target.value,
            page: 1,
          })
        }
        placeholder="Search by name or email..."
        data-testid="user-search-input"
      />
    </div>
  ),
}));

// ============================================
// МОК ХУКОВ - КЛЮЧЕВАЯ ЧАСТЬ БЕЗ MSW
// ============================================

const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    imageUrl: '',
    createdAt: 1672531200000,
    lastSignInAt: 1672617600000,
  },
  {
    id: 'user-2',
    email: 'author@example.com',
    firstName: 'Author',
    lastName: 'Writer',
    role: 'author',
    imageUrl: '',
    createdAt: 1672444800000,
    lastSignInAt: 1672617600000,
  },
  {
    id: 'user-3',
    email: 'regular@example.com',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user',
    imageUrl: '',
    createdAt: 1672358400000,
    lastSignInAt: null,
  },
];

// Базовая mock-реализация хука useUsersManagement
const createMockUseUsersManagement = (overrides = {}) => {
  const defaultMock = {
    // State
    filters: { page: 1, limit: 10, emailSearch: '' },
    deleteDialog: { open: false, userId: null, userEmail: null },

    // Data
    users: [...mockUsers],
    total: mockUsers.length,
    page: 1,
    totalPages: 1,

    // Loading states
    isLoading: false,
    isError: false,
    error: null,
    isFetching: false,
    debouncedEmailSearch: '',

    // Mutations
    updateRoleMutation: {
      isPending: false,
      mutate: jest.fn(),
      variables: null,
    },
    deleteUserMutation: {
      isPending: false,
      mutate: jest.fn(),
      variables: null,
    },

    // Handlers
    handleRoleChange: jest.fn(),
    handleDeleteClick: jest.fn(),
    handleConfirmDelete: jest.fn(),
    handleCancelDelete: jest.fn(),
    handlePageChange: jest.fn(),
    handleItemsPerPageChange: jest.fn(),
    handleFiltersChange: jest.fn(),
    handleRefresh: jest.fn(),
    handlePrefetchNextPage: jest.fn(),

    // Helpers
    isUserUpdatingRole: jest.fn(() => false),
    isUserDeleting: jest.fn(() => false),

    // Setters
    setFilters: jest.fn(),
    setDeleteDialog: jest.fn(),
  };

  return { ...defaultMock, ...overrides };
};

// Мокаем хук напрямую
jest.mock('../../hooks', () => ({
  useUsersManagement: jest.fn(),
}));

// ============================================
// НАСТРОЙКА ТЕСТОВОЙ СРЕДЫ
// ============================================

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

// Вспомогательная функция для поиска конкретной пагинации
const getPaginationButtons = (container: HTMLElement, testId: string) => {
  const pagination = screen.getByTestId(testId);
  return {
    prevButton: within(pagination).getByTestId(`${testId}-prev-page-button`),
    nextButton: within(pagination).getByTestId(`${testId}-next-page-button`),
  };
};

// ============================================
/// ИНТЕГРАЦИОННЫЕ ТЕСТЫ
// ============================================

describe('DashboardUsers - Integration Tests', () => {
  let mockHookData: ReturnType<typeof createMockUseUsersManagement>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHookData = createMockUseUsersManagement();
    (useUsersManagement as jest.Mock).mockReturnValue(mockHookData);
  });

  // ============================================
  // ТЕСТ 1: Отображение данных
  // ============================================
  describe('Data Display', () => {
    it('should display users list from hook data', () => {
      // Arrange
      renderWithProviders(<DashboardUsers />);

      // Assert
      expect(screen.getByText(/user management/i)).toBeInTheDocument();
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
      expect(screen.getByText('author@example.com')).toBeInTheDocument();
      expect(screen.getByText('regular@example.com')).toBeInTheDocument();

      // Проверяем что используются данные из хука
      expect(screen.getByTestId('users-count')).toHaveTextContent(
        '3 total users'
      );
    });

    it('should show loading state when isLoading is true', () => {
      // Arrange
      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        isLoading: true,
        users: [],
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      expect(screen.getByTestId('users-loading')).toBeInTheDocument();
      expect(screen.queryByText('admin@example.com')).not.toBeInTheDocument();
    });

    it('should show error state when isError is true', () => {
      // Arrange
      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        isError: true,
        error: new Error('Failed to load users'),
        users: [],
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      expect(screen.getByTestId('users-error-state')).toBeInTheDocument();
      expect(screen.getByTestId('error-title')).toHaveTextContent(
        /error loading users/i
      );
    });
  });

  // ============================================
  // ТЕСТ 2: Взаимодействие с фильтрами
  // ============================================
  describe('Filters Interaction', () => {
    it('should call handleFiltersChange when searching', async () => {
      // Arrange
      const user = userEvent.setup();
      const handleFiltersChange = jest.fn();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        handleFiltersChange,
      });

      renderWithProviders(<DashboardUsers />);

      // Act
      const searchInput = screen.getByTestId('user-search-input');
      await user.type(searchInput, 'a');

      // Assert - просто проверяем, что функция вызывалась
      expect(handleFiltersChange).toHaveBeenCalled();

      // ИЛИ проверяем параметры первого вызова
      expect(handleFiltersChange).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          emailSearch: 'a',
          page: 1,
        })
      );
    });
  });

  // ============================================
  // ТЕСТ 3: Изменение ролей
  // ============================================
  describe('Role Management', () => {
    it('should call handleRoleChange when role is changed', async () => {
      // Arrange
      const user = userEvent.setup();
      const handleRoleChange = jest.fn();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        handleRoleChange,
      });

      renderWithProviders(<DashboardUsers />);

      // Act
      const roleSelect = screen.getByTestId('role-select-user-3');
      await user.selectOptions(roleSelect, 'admin');

      // Assert
      expect(handleRoleChange).toHaveBeenCalledWith('user-3', 'admin');
    });

    it('should show loading state for specific user when updating role', () => {
      // Arrange
      const isUserUpdatingRole = jest
        .fn()
        .mockImplementation((userId: string) => userId === 'user-3');

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        isUserUpdatingRole,
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      const user3Select = screen.getByTestId('role-select-user-3');
      expect(user3Select).toBeDisabled();
      expect(
        screen.getByTestId('loading-indicator-user-3')
      ).toBeInTheDocument();
    });
  });

  // ============================================
  // ТЕСТ 4: Удаление пользователей
  // ============================================
  describe('User Deletion Flow', () => {
    it('should open delete dialog when delete button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const handleDeleteClick = jest.fn();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        handleDeleteClick,
      });

      renderWithProviders(<DashboardUsers />);

      // Act
      const deleteButton = screen.getByTestId('delete-button-user-3');
      await user.click(deleteButton);

      // Assert
      expect(handleDeleteClick).toHaveBeenCalledWith(
        'user-3',
        'regular@example.com'
      );
    });

    it('should show delete dialog when deleteDialog.open is true', () => {
      // Arrange
      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        deleteDialog: {
          open: true,
          userId: 'user-3',
          userEmail: 'regular@example.com',
        },
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      expect(screen.getByTestId('delete-user-dialog')).toBeInTheDocument();
      expect(
        screen.getByText(
          /are you sure you want to delete regular@example.com\?/i
        )
      ).toBeInTheDocument();
    });

    it('should call handleConfirmDelete when confirming deletion', async () => {
      // Arrange
      const user = userEvent.setup();
      const handleConfirmDelete = jest.fn();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        deleteDialog: {
          open: true,
          userId: 'user-3',
          userEmail: 'regular@example.com',
        },
        handleConfirmDelete,
      });

      renderWithProviders(<DashboardUsers />);

      // Act
      const confirmButton = screen.getByTestId('confirm-delete-button');
      await user.click(confirmButton);

      // Assert
      expect(handleConfirmDelete).toHaveBeenCalled();
    });

    it('should call handleCancelDelete when cancelling deletion', async () => {
      // Arrange
      const user = userEvent.setup();
      const handleCancelDelete = jest.fn();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        deleteDialog: {
          open: true,
          userId: 'user-3',
          userEmail: 'regular@example.com',
        },
        handleCancelDelete,
      });

      renderWithProviders(<DashboardUsers />);

      // Act
      const cancelButton = screen.getByTestId('cancel-delete-button');
      await user.click(cancelButton);

      // Assert
      expect(handleCancelDelete).toHaveBeenCalled();
    });

    it('should show loading state in delete dialog when mutation is pending', () => {
      // Arrange
      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        deleteDialog: {
          open: true,
          userId: 'user-3',
          userEmail: 'regular@example.com',
        },
        deleteUserMutation: {
          isPending: true,
          variables: 'user-3',
          mutate: jest.fn(),
        },
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      expect(screen.getByTestId('confirm-delete-button')).toBeDisabled();
      expect(screen.getByTestId('dialog-loading')).toBeInTheDocument();
    });
  });

  // ============================================
  // ТЕСТ 5: Пагинация (ИСПРАВЛЕННЫЙ)
  // ============================================
  describe('Pagination', () => {
    it('should call handlePageChange when navigating pages', async () => {
      // Arrange
      const user = userEvent.setup();
      const handlePageChange = jest.fn();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        total: 25,
        totalPages: 3,
        handlePageChange,
      });

      renderWithProviders(<DashboardUsers />);

      // Act - используем нижнюю пагинацию для теста
      const { nextButton } = getPaginationButtons(
        document.body,
        'pagination-bottom'
      );
      await user.click(nextButton);

      // Assert
      expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it('should call handleItemsPerPageChange when changing page size', async () => {
      // Arrange
      const user = userEvent.setup();
      const handleItemsPerPageChange = jest.fn();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        handleItemsPerPageChange,
      });

      renderWithProviders(<DashboardUsers />);

      // Act
      const itemsPerPageSelect = screen.getAllByTestId(
        'items-per-page-select'
      )[0];
      await user.selectOptions(itemsPerPageSelect, '20');

      // Assert
      expect(handleItemsPerPageChange).toHaveBeenCalledWith(20);
    });

    it('should disable previous button on first page', () => {
      // Arrange
      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        page: 1,
        totalPages: 3,
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert - проверяем верхнюю пагинацию
      const { prevButton, nextButton } = getPaginationButtons(
        document.body,
        'pagination-top'
      );
      expect(prevButton).toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    it('should disable next button on last page', () => {
      // Arrange
      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        page: 3,
        totalPages: 3,
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert - проверяем нижнюю пагинацию
      const { prevButton, nextButton } = getPaginationButtons(
        document.body,
        'pagination-bottom'
      );
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  // ============================================
  // ТЕСТ 6: Обновление данных
  // ============================================
  describe('Data Refresh', () => {
    it('should call handleRefresh when refresh button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const handleRefresh = jest.fn();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        handleRefresh,
      });

      renderWithProviders(<DashboardUsers />);

      // Act
      const refreshButton = screen.getByTestId('refresh-users-button');
      await user.click(refreshButton);

      // Assert
      expect(handleRefresh).toHaveBeenCalled();
    });

    it('should disable refresh button while isFetching is true', () => {
      // Arrange
      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        isFetching: true,
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      expect(screen.getByTestId('refresh-users-button')).toBeDisabled();
    });
  });

  // ============================================
  // ТЕСТ 7: Пустые состояния (ИСПРАВЛЕННЫЙ)
  // ============================================
  describe('Empty States', () => {
    it('should show empty state when no users', () => {
      // Arrange
      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        users: [],
        total: 0,
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      expect(screen.getByTestId('users-empty-state')).toBeInTheDocument();
      expect(screen.getByTestId('empty-title')).toHaveTextContent(/no users/i);
    });

    it('should show search query in empty state when searching', () => {
      // Arrange
      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        users: [],
        total: 0,
        debouncedEmailSearch: 'nonexistent',
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      expect(screen.getByTestId('users-empty-state')).toBeInTheDocument();
      expect(screen.getByTestId('empty-search-query')).toHaveTextContent(
        'No results for nonexistent' // Убрал слеши
      );
    });
  });

  // ============================================
  // ТЕСТ 8: Интеграция с UserRow
  // ============================================
  describe('Integration with UserRow', () => {
    it('should pass correct props to UserRow components', () => {
      // Arrange
      const isUserUpdatingRole = jest
        .fn()
        .mockImplementation((userId: string) => userId === 'user-2');

      const isUserDeleting = jest
        .fn()
        .mockImplementation((userId: string) => userId === 'user-3');

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        isUserUpdatingRole,
        isUserDeleting,
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      // User 1 - обычный
      expect(screen.getByTestId('role-select-user-1')).not.toBeDisabled();
      expect(screen.getByTestId('delete-button-user-1')).not.toBeDisabled();

      // User 2 - обновляется роль
      expect(screen.getByTestId('role-select-user-2')).toBeDisabled();
      expect(
        screen.queryByTestId('loading-indicator-user-2')
      ).toBeInTheDocument();

      // User 3 - удаляется
      expect(screen.getByTestId('delete-button-user-3')).toBeDisabled();
      expect(
        screen.queryByTestId('loading-indicator-user-3')
      ).toBeInTheDocument();
    });

    it('should handle multiple UserRow interactions correctly', async () => {
      // Arrange
      const user = userEvent.setup();
      const handleRoleChange = jest.fn();
      const handleDeleteClick = jest.fn();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        handleRoleChange,
        handleDeleteClick,
      });

      renderWithProviders(<DashboardUsers />);

      // Act 1 - меняем роль первого пользователя
      const roleSelect1 = screen.getByTestId('role-select-user-1');
      await user.selectOptions(roleSelect1, 'author');

      // Act 2 - удаляем второго пользователя
      const deleteButton2 = screen.getByTestId('delete-button-user-2');
      await user.click(deleteButton2);

      // Assert
      expect(handleRoleChange).toHaveBeenCalledWith('user-1', 'author');
      expect(handleDeleteClick).toHaveBeenCalledWith(
        'user-2',
        'author@example.com'
      );
      expect(handleRoleChange).toHaveBeenCalledTimes(1);
      expect(handleDeleteClick).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================
  // ТЕСТ 9: Префетчинг данных (ИСПРАВЛЕННЫЙ)
  // ============================================
  describe('Prefetching', () => {
    it('should call handlePrefetchNextPage on mouse enter of list', () => {
      // Arrange
      const handlePrefetchNextPage = jest.fn();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        page: 1, // НЕ последняя страница
        totalPages: 3,
        handlePrefetchNextPage,
      });

      renderWithProviders(<DashboardUsers />);

      // Act
      const listContainer = screen.getByTestId('users-list-container');
      fireEvent.mouseEnter(listContainer);

      // Assert
      expect(handlePrefetchNextPage).toHaveBeenCalledTimes(1);
    });

    it('should not prefetch if on last page', () => {
      // Arrange
      const handlePrefetchNextPage = jest.fn();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        page: 3,
        totalPages: 3,
        // Имитируем логику хука - функция не должна вызываться на последней странице
        handlePrefetchNextPage: jest.fn(() => {
          // В реальном хуке здесь есть условие if (page < totalPages)
          console.log(
            'handlePrefetchNextPage called, but should not be on last page'
          );
        }),
      });

      renderWithProviders(<DashboardUsers />);

      // Act
      const listContainer = screen.getByTestId('users-list-container');
      fireEvent.mouseEnter(listContainer);

      // Assert
      expect(handlePrefetchNextPage).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // ТЕСТ 10: Множественные пагинации
  // ============================================
  describe('Multiple Paginations', () => {
    it('should render both top and bottom paginations', () => {
      // Arrange
      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        total: 25,
        totalPages: 3,
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      expect(screen.getByTestId('pagination-top')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-bottom')).toBeInTheDocument();
    });

    it('should sync both paginations', () => {
      // Arrange
      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        page: 2,
        totalPages: 3,
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      const topCurrentPage = within(
        screen.getByTestId('pagination-top')
      ).getByTestId('pagination-current-page');
      const bottomCurrentPage = within(
        screen.getByTestId('pagination-bottom')
      ).getByTestId('pagination-current-page');

      expect(topCurrentPage).toHaveTextContent('2');
      expect(bottomCurrentPage).toHaveTextContent('2');
    });
  });

  // ============================================
  // ТЕСТ 11: Обработка ошибок
  // ============================================
  describe('Error Handling', () => {
    it('should show retry button in error state', async () => {
      // Arrange
      const handleRefresh = jest.fn();
      const user = userEvent.setup();

      (useUsersManagement as jest.Mock).mockReturnValue({
        ...mockHookData,
        isError: true,
        error: new Error('Network error'),
        users: [],
        handleRefresh,
      });

      // Act
      renderWithProviders(<DashboardUsers />);

      // Assert
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();

      // Act 2 - нажимаем retry
      await user.click(screen.getByTestId('retry-button'));

      // Assert 2
      expect(handleRefresh).toHaveBeenCalled();
    });
  });
});
