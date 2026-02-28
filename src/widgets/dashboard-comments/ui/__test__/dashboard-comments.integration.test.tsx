import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { useCommentsManagement } from '../../hooks';
import type { DashboardComment } from '../../model';
import { DashboardComments } from '../dashboard-comments';

// Моки UI-компонентов (без изменений)
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
    itemsPerPage,
    pageSizeOptions,
    onPageChange,
    onItemsPerPageChange,
    'data-testid': testId,
  }: any) => (
    <div data-testid={testId}>
      <span data-testid={`${testId}-current-page`}>{currentPage}</span>
      <span data-testid={`${testId}-total-pages`}>{totalPages}</span>
      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        data-testid={`${testId}-items-per-page`} // Уникальный testId
      >
        {pageSizeOptions.map((opt: number) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        data-testid={`${testId}-prev-button`}
      >
        Prev
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        data-testid={`${testId}-next-button`}
      >
        Next
      </button>
    </div>
  ),
  UniversalEmpty: ({ searchQuery, title, 'data-testid': testId }: any) => (
    <div data-testid={testId}>
      <h3 data-testid={`${testId}-title`}>{title}</h3>
      {searchQuery && (
        <p data-testid={`${testId}-search-query`}>
          No results for {searchQuery}
        </p>
      )}
    </div>
  ),
  UniversalError: ({ error, onRetry, title, 'data-testid': testId }: any) => (
    <div data-testid={testId}>
      <h3 data-testid={`${testId}-title`}>{title}</h3>
      <p data-testid={`${testId}-message`}>{error?.message}</p>
      <button onClick={onRetry} data-testid={`${testId}-retry-button`}>
        Retry
      </button>
    </div>
  ),
}));

jest.mock('@/shared/ui/button', () => ({
  Button: ({ children, onClick, disabled, 'data-testid': testId }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid={testId}>
      {children}
    </button>
  ),
}));

jest.mock('../comment-row', () => ({
  CommentRow: ({ comment, onDelete, isDeleting }: any) => (
    <div data-testid={`comment-row-${comment.id}`}>
      <span data-testid={`comment-content-${comment.id}`}>
        {comment.content}
      </span>
      <button
        onClick={() => onDelete(comment.id, comment.content)}
        disabled={isDeleting}
        data-testid={`delete-button-${comment.id}`}
      >
        Delete
      </button>
      {isDeleting && (
        <span data-testid={`loading-${comment.id}`}>Loading...</span>
      )}
    </div>
  ),
}));

jest.mock('../comments-filters', () => ({
  CommentsFiltersComponent: ({ filters, onFiltersChange }: any) => (
    <div data-testid="comments-filters">
      <input
        value={filters.search || ''}
        onChange={(e) =>
          onFiltersChange({ ...filters, search: e.target.value, page: 1 })
        }
        data-testid="comment-search-input"
      />
    </div>
  ),
}));

// Мок хука (без изменений)
const mockComments: DashboardComment[] = [
  {
    id: 'c1',
    content: 'First comment',
    author: {
      id: 'u1',
      email: 'user1@test.com',
      firstName: 'User',
      lastName: 'One',
      role: 'user',
      imageUrl: '',
      createdAt: null,
      lastSignInAt: null,
    },
    post: { id: 'p1', title: 'Post 1', slug: 'post-1', published: true },
    stats: { likesCount: 1, dislikesCount: 0 },
    createdAt: 1670000000000,
    updatedAt: null,
  },
  {
    id: 'c2',
    content: 'Second comment',
    author: {
      id: 'u2',
      email: 'user2@test.com',
      firstName: 'User',
      lastName: 'Two',
      role: 'user',
      imageUrl: '',
      createdAt: null,
      lastSignInAt: null,
    },
    post: { id: 'p2', title: 'Post 2', slug: 'post-2', published: false },
    stats: { likesCount: 0, dislikesCount: 1 },
    createdAt: 1670000000000,
    updatedAt: null,
  },
];

const createMockHookData = (overrides = {}) => ({
  filters: { page: 1, limit: 10, search: '' },
  deleteDialog: { open: false, commentId: null, commentContent: null },
  comments: mockComments,
  total: 2,
  page: 1,
  totalPages: 3,
  isLoading: false,
  isError: false,
  error: null,
  isFetching: false,
  debouncedSearch: '',
  deleteCommentMutation: {
    isPending: false,
    variables: null,
    mutate: jest.fn(),
  },
  handleDeleteClick: jest.fn(),
  handleConfirmDelete: jest.fn(),
  handleCancelDelete: jest.fn(),
  handlePageChange: jest.fn(),
  handleItemsPerPageChange: jest.fn(),
  handleFiltersChange: jest.fn(),
  handleRefresh: jest.fn(),
  handlePrefetchNextPage: jest.fn(),
  isCommentDeleting: jest.fn(() => false),
  setFilters: jest.fn(),
  setDeleteDialog: jest.fn(),
  ...overrides,
});

jest.mock('../../hooks', () => ({ useCommentsManagement: jest.fn() }));
const mockedUseCommentsManagement = useCommentsManagement as jest.Mock;

const renderWithProviders = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe('DashboardComments - Integration', () => {
  let mockHookData: ReturnType<typeof createMockHookData>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHookData = createMockHookData();
    mockedUseCommentsManagement.mockReturnValue(mockHookData);
  });

  it('should display comments list from hook data', () => {
    renderWithProviders(<DashboardComments />);
    expect(screen.getByText('Comment Management')).toBeInTheDocument();
    expect(screen.getByTestId('comment-row-c1')).toBeInTheDocument();
    expect(screen.getByTestId('comment-row-c2')).toBeInTheDocument();
    expect(screen.getByTestId('comments-count')).toHaveTextContent(
      '2 total comments'
    );
  });

  it('should show loading state', () => {
    mockedUseCommentsManagement.mockReturnValue({
      ...mockHookData,
      isLoading: true,
      comments: [],
    });
    renderWithProviders(<DashboardComments />);
    expect(screen.getByTestId('comments-loading')).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockedUseCommentsManagement.mockReturnValue({
      ...mockHookData,
      isError: true,
      error: new Error('Failed'),
      comments: [],
    });
    renderWithProviders(<DashboardComments />);
    expect(screen.getByTestId('comments-error-state')).toBeInTheDocument();
    expect(
      screen.getByTestId('comments-error-state-retry-button')
    ).toBeInTheDocument();
  });

  it('should call handleFiltersChange when searching', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DashboardComments />);

    const searchInput = screen.getByTestId('comment-search-input');
    await user.type(searchInput, 'test');

    // Вызывается по одному разу на каждый символ
    expect(mockHookData.handleFiltersChange).toHaveBeenCalledTimes(4);

    expect(mockHookData.handleFiltersChange).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ search: 't', page: 1 })
    );

    expect(mockHookData.handleFiltersChange).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ search: 'e', page: 1 })
    );

    expect(mockHookData.handleFiltersChange).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ search: 's', page: 1 })
    );

    expect(mockHookData.handleFiltersChange).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({ search: 't', page: 1 })
    );
  });

  it('should open delete dialog when delete button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DashboardComments />);
    await user.click(screen.getByTestId('delete-button-c1'));
    expect(mockHookData.handleDeleteClick).toHaveBeenCalledWith(
      'c1',
      'First comment'
    );
  });

  it('should show delete dialog when deleteDialog.open is true', () => {
    mockedUseCommentsManagement.mockReturnValue({
      ...mockHookData,
      deleteDialog: {
        open: true,
        commentId: 'c1',
        commentContent: 'First comment',
      },
    });
    renderWithProviders(<DashboardComments />);
    expect(screen.getByTestId('delete-comment-dialog')).toBeInTheDocument();
  });

  it('should call handlePageChange when navigating pages', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DashboardComments />);

    // Используем нижнюю пагинацию для навигации
    await user.click(screen.getByTestId('pagination-bottom-next-button'));
    expect(mockHookData.handlePageChange).toHaveBeenCalledWith(2);
  });

  it('should call handleItemsPerPageChange when changing page size', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DashboardComments />);

    const bottomItemsPerPageSelect = screen.getByTestId(
      'pagination-bottom-items-per-page'
    );

    await user.selectOptions(bottomItemsPerPageSelect, '20');

    expect(mockHookData.handleItemsPerPageChange).toHaveBeenCalledWith(20);
  });

  it('should call handlePrefetchNextPage on mouse enter', () => {
    renderWithProviders(<DashboardComments />);
    fireEvent.mouseEnter(screen.getByTestId('comments-list-container'));
    expect(mockHookData.handlePrefetchNextPage).toHaveBeenCalled();
  });
});
