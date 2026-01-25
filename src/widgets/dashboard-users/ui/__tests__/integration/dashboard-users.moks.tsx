// ============================================
// МОКИ ДЛЯ ВНЕШНИХ ЗАВИСИМОСТЕЙ
// ============================================

import { User } from '@/features/user-profile-info';

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
jest.mock('../../user-row', () => ({
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

jest.mock('../../users-filters', () => ({
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
export const createMockUseUsersManagement = (overrides = {}) => {
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

// Экспортируем мок-функцию для использования в тестах
export const mockUseUsersManagement = jest.fn();

// Экспортируем тип для TypeScript
export type MockUseUsersManagement = ReturnType<
  typeof createMockUseUsersManagement
>;

// ============================================
// ВАЖНО: Это должно быть в КОНЦЕ файла
// ============================================

// Мокаем хук напрямую, используя нашу экспортированную функцию
jest.mock('../../../hooks', () => ({
  useUsersManagement: mockUseUsersManagement, // Используем экспортированную функцию
}));

// пустой тест , чтобы  не ругался jest
describe('Mocks setup', () => {
  it.todo('should setup mocks correctly');
});
