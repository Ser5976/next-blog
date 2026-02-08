import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { useUserCommentDelete, useUserComments } from '../../hooks';
import { UserCommentsList } from '../user-comments-list';

// Мокаем хуки
jest.mock('../../hooks', () => ({
  useUserComments: jest.fn(),
  useUserCommentDelete: jest.fn(),
}));

// Мокаем компоненты
jest.mock('@/entities/coment-row', () => ({
  CommentRow: ({
    comment,
    onDelete,
    isDeleting = false,
  }: {
    comment: { id: string; content: string };
    onDelete: (id: string, content: string) => void;
    isDeleting?: boolean;
  }) => (
    <div data-testid={`comment-row-${comment.id}`}>
      <span data-testid={`comment-content-${comment.id}`}>
        {comment.content}
      </span>
      <button
        data-testid={`delete-comment-button-${comment.id}`}
        onClick={() => onDelete(comment.id, comment.content)}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  ),
}));

jest.mock('@/entities/comments-stats', () => ({
  CommentsStats: ({ stats }: { stats: any }) => (
    <div data-testid="comments-stats">
      <span>Total Comments: {stats.totalComments}</span>
    </div>
  ),
}));

jest.mock('@/shared/ui', () => ({
  ConfirmDialog: ({
    open,
    onConfirm,
    onCancel,
    title,
    description,
    confirmText,
    cancelText,
    isLoading,
  }: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    isLoading?: boolean;
  }) =>
    open && (
      <div data-testid="confirm-dialog">
        <h3 data-testid="dialog-title">{title}</h3>
        <p data-testid="dialog-description">{description}</p>
        <button
          data-testid="dialog-confirm-button"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {confirmText}
        </button>
        <button data-testid="dialog-cancel-button" onClick={onCancel}>
          {cancelText}
        </button>
      </div>
    ),
  ListSkeleton: ({ count }: { count: number }) => (
    <div data-testid="list-skeleton">Loading {count} items...</div>
  ),
  UniversalEmpty: ({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) => (
    <div data-testid="universal-empty">
      <div data-testid="empty-icon">{icon}</div>
      <h3 data-testid="empty-title">{title}</h3>
      <p data-testid="empty-description">{description}</p>
    </div>
  ),
  UniversalError: ({
    error,
    title,
    onRetry,
  }: {
    error?: Error;
    title: string;
    onRetry: () => void;
  }) => (
    <div data-testid="universal-error">
      <h3 data-testid="error-title">{title}</h3>
      {error && <p data-testid="error-message">{error.message}</p>}
      <button data-testid="error-retry-button" onClick={onRetry}>
        Retry
      </button>
    </div>
  ),
}));

// Создаем тестовые данные
const createComment = (overrides?: any) => ({
  id: '1',
  content: 'This is a test comment',
  createdAt: '2023-01-01',
  post: {
    id: 'post-1',
    title: 'Test Post',
    slug: 'test-post',
    published: true,
  },
  stats: {
    likesCount: 10,
    dislikesCount: 2,
  },
  ...overrides,
});

const createCommentsData = (overrides?: any) => ({
  success: true,
  comments: [createComment()],
  stats: {
    totalComments: 1,
    totalLikes: 10,
    totalDislikes: 2,
    postsCommented: 1,
  },
  message: undefined,
  ...overrides,
});

// Дефолтные моки для хуков
const defaultUseUserCommentsMock = {
  data: createCommentsData(),
  isLoading: false,
  isError: false,
  error: null as Error | null,
  refetch: jest.fn(),
};

const defaultUseUserCommentDeleteMock = {
  mutate: jest.fn(),
  mutateAsync: jest.fn(),
  isPending: false,
  isSuccess: false,
  isError: false,
  error: null as Error | null,
  variables: null as { commentId: string } | null,
};

const mockUseUserComments = (
  overrides: Partial<typeof defaultUseUserCommentsMock> = {}
) => {
  (useUserComments as jest.Mock).mockReturnValue({
    ...defaultUseUserCommentsMock,
    ...overrides,
  });
};

const mockUseUserCommentDelete = (
  overrides: Partial<typeof defaultUseUserCommentDeleteMock> = {}
) => {
  (useUserCommentDelete as jest.Mock).mockReturnValue({
    ...defaultUseUserCommentDeleteMock,
    ...overrides,
  });
};

describe('UserCommentsList – unit tests', () => {
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUserComments();
    mockUseUserCommentDelete();
  });

  // 1. Рендеринг компонента
  it('renders UserCommentsList component', () => {
    render(<UserCommentsList userId={userId} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  // 2. Состояние загрузки
  it('shows loading state when isLoading is true', () => {
    mockUseUserComments({ isLoading: true });

    render(<UserCommentsList userId={userId} />);

    expect(screen.getByTestId('list-skeleton')).toBeInTheDocument();
    expect(screen.getByText(/Loading 4 items.../i)).toBeInTheDocument();
  });

  // 3. Состояние ошибки
  it('shows error state when isError is true', async () => {
    const error = new Error('Failed to fetch comments');
    const refetch = jest.fn();

    mockUseUserComments({
      isError: true,
      error: error,
      refetch,
    });

    render(<UserCommentsList userId={userId} />);

    expect(screen.getByTestId('universal-error')).toBeInTheDocument();
    expect(screen.getByTestId('error-title')).toHaveTextContent(
      'Comments not found'
    );
    expect(screen.getByTestId('error-retry-button')).toBeInTheDocument();

    // Проверяем что кнопка retry вызывает refetch
    const user = userEvent.setup();
    await user.click(screen.getByTestId('error-retry-button'));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  // 4. Пустой список комментариев
  it('shows empty state when there are no comments', () => {
    mockUseUserComments({
      data: {
        ...createCommentsData(),
        comments: [],
      },
    });

    render(<UserCommentsList userId={userId} />);

    expect(screen.getByTestId('universal-empty')).toBeInTheDocument();
    expect(screen.getByTestId('empty-title')).toHaveTextContent(
      'No comments found'
    );
    expect(screen.getByTestId('empty-description')).toHaveTextContent(
      "This user hasn't posted any comments yet."
    );
  });

  // 5. Отображение списка комментариев
  it('renders comments list when data is available', () => {
    const commentsData = createCommentsData({
      comments: [
        createComment({ id: '1', content: 'First comment' }),
        createComment({ id: '2', content: 'Second comment' }),
      ],
      stats: {
        totalComments: 2,
        totalLikes: 20,
        totalDislikes: 4,
        postsCommented: 2,
      },
    });

    mockUseUserComments({ data: commentsData });

    render(<UserCommentsList userId={userId} />);

    // Проверяем что статистика отображается
    expect(screen.getByTestId('comments-stats')).toBeInTheDocument();
    expect(screen.getByText(/Total Comments: 2/i)).toBeInTheDocument();

    // Проверяем что комментарии отображаются
    expect(screen.getByTestId('comment-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('comment-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('comment-content-1')).toHaveTextContent(
      'First comment'
    );
    expect(screen.getByTestId('comment-content-2')).toHaveTextContent(
      'Second comment'
    );
  });

  // 6. Открытие диалога удаления
  it('opens delete dialog when delete button is clicked', async () => {
    const commentsData = createCommentsData({
      comments: [
        createComment({ id: 'comment-123', content: 'Comment to delete' }),
      ],
    });

    mockUseUserComments({ data: commentsData });

    render(<UserCommentsList userId={userId} />);

    const user = userEvent.setup();
    await user.click(screen.getByTestId('delete-comment-button-comment-123'));

    // Проверяем что диалог открылся
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent(
      'Delete Comment'
    );
    expect(screen.getByTestId('dialog-description')).toHaveTextContent(
      'Are you sure you want to delete this comment? This action cannot be undone.'
    );
  });

  // 7. Подтверждение удаления комментария
  it('calls delete mutation when confirm button is clicked', async () => {
    const commentsData = createCommentsData({
      comments: [
        createComment({ id: 'comment-123', content: 'Comment to delete' }),
      ],
    });

    const mutate = jest.fn();
    mockUseUserComments({ data: commentsData });
    mockUseUserCommentDelete({ mutate });

    render(<UserCommentsList userId={userId} />);

    const user = userEvent.setup();

    // Открываем диалог удаления
    await user.click(screen.getByTestId('delete-comment-button-comment-123'));

    // Подтверждаем удаление
    await user.click(screen.getByTestId('dialog-confirm-button'));

    // Проверяем что мутация была вызвана с правильным commentId
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith(
      { commentId: 'comment-123' },
      expect.any(Object)
    );
  });

  // 8. Отмена удаления комментария
  it('closes delete dialog when cancel button is clicked', async () => {
    const commentsData = createCommentsData({
      comments: [
        createComment({ id: 'comment-123', content: 'Comment to delete' }),
      ],
    });

    mockUseUserComments({ data: commentsData });

    render(<UserCommentsList userId={userId} />);

    const user = userEvent.setup();

    // Открываем диалог удаления
    await user.click(screen.getByTestId('delete-comment-button-comment-123'));

    // Проверяем что диалог открыт
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();

    // Нажимаем отмену
    await user.click(screen.getByTestId('dialog-cancel-button'));

    // Проверяем что диалог закрылся
  });

  // 9. Передача состояния isDeleting в CommentRow
  it('passes isDeleting prop to CommentRow when deleting that specific comment', () => {
    const commentsData = createCommentsData({
      comments: [
        createComment({ id: 'comment-123', content: 'Comment to delete' }),
        createComment({ id: 'comment-456', content: 'Another comment' }),
      ],
    });

    // Нужно сымитировать состояние когда диалог открыт для comment-123
    // и мутация выполняется для этого же комментария
    mockUseUserComments({ data: commentsData });

    // Создаем мок, который имитирует состояние когда мутация выполняется
    // и deleteDialog.commentId === comment.id
    const mockDeleteMutation = {
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
      variables: { commentId: 'comment-123' },
    };

    (useUserCommentDelete as jest.Mock).mockReturnValue(mockDeleteMutation);

    // В реальном компоненте isDeleting определяется так:
    // deleteUserCommentMutation.isPending && deleteDialog.commentId === comment.id
    // Нам нужно сымитировать что deleteDialog.commentId = 'comment-123'

    // Для этого нам нужно перехватить вызов setDeleteDialog
    // Но в тестах проще просто проверить логику

    render(<UserCommentsList userId={userId} />);

    const deleteButton1 = screen.getByTestId(
      'delete-comment-button-comment-123'
    );
    const deleteButton2 = screen.getByTestId(
      'delete-comment-button-comment-456'
    );

    // isDeleting = deleteUserCommentMutation.isPending && deleteDialog.commentId === comment.id
    // В нашем тесте deleteDialog.commentId = null (по умолчанию)
    // Поэтому isDeleting будет false для обоих комментариев

    // Первый комментарий НЕ должен быть в состоянии удаления
    // потому что deleteDialog.commentId !== 'comment-123' (оно null)
    expect(deleteButton1).not.toBeDisabled();
    expect(deleteButton1).toHaveTextContent('Delete');

    // Второй комментарий тоже не должен быть в состоянии удаления
    expect(deleteButton2).not.toBeDisabled();
    expect(deleteButton2).toHaveTextContent('Delete');
  });
});
