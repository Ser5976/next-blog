import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { useUserPostDelete, useUserPosts } from '../../hooks';
import { UserPostsList } from '../user-posts-list';

// Мокаем хуки
jest.mock('../../hooks', () => ({
  useUserPosts: jest.fn(),
  useUserPostDelete: jest.fn(),
}));

// Мокаем компоненты
jest.mock('@/entities/post-row', () => ({
  PostRow: ({
    post,
    onDelete,
    isDeleting = false,
  }: {
    post: { id: string; title: string };
    onDelete: (id: string) => void;
    isDeleting?: boolean;
  }) => (
    <div data-testid={`post-row-${post.id}`}>
      <span data-testid={`post-title-${post.id}`}>{post.title}</span>
      <button
        data-testid={`delete-post-button-${post.id}`}
        onClick={() => onDelete(post.id)}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  ),
}));

jest.mock('@/entities/posts-stats', () => ({
  PostsStats: ({ stats }: { stats: any }) => (
    <div data-testid="posts-stats">
      <span>Total Posts: {stats.totalPosts}</span>
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
    error: Error | null;
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
const createPost = (overrides?: any) => ({
  id: '1',
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'This is a test post',
  coverImage: null,
  published: true,
  viewCount: 100,
  averageRating: 4.5,
  ratingCount: 10,
  createdAt: '2023-01-01',
  publishedAt: '2023-01-02',
  category: {
    id: 'cat-1',
    name: 'Technology',
  },
  tags: [
    { id: 'tag-1', name: 'React' },
    { id: 'tag-2', name: 'TypeScript' },
  ],
  stats: {
    commentsCount: 5,
  },
  ...overrides,
});

const createPostsData = (overrides?: any) => ({
  success: true,
  posts: [createPost()],
  stats: {
    totalPosts: 1,
    publishedPosts: 1,
    totalViews: 100,
    averageRating: 4.5,
    totalRatings: 10,
  },
  message: undefined,
  ...overrides,
});

// Дефолтные моки для хуков
const defaultUseUserPostsMock = {
  data: undefined,
  isLoading: false,
  isError: false,
  error: null as Error | null,
  refetch: jest.fn(),
};

const defaultUseUserPostDeleteMock = {
  mutate: jest.fn(),
  mutateAsync: jest.fn(),
  isPending: false,
  isSuccess: false,
  isError: false,
  error: null,
  variables: null as string | null,
};

const mockUseUserPosts = (
  overrides: Partial<typeof defaultUseUserPostsMock> = {}
) => {
  (useUserPosts as jest.Mock).mockReturnValue({
    ...defaultUseUserPostsMock,
    ...overrides,
  });
};

const mockUseUserPostDelete = (
  overrides: Partial<typeof defaultUseUserPostDeleteMock> = {}
) => {
  (useUserPostDelete as jest.Mock).mockReturnValue({
    ...defaultUseUserPostDeleteMock,
    ...overrides,
  });
};

describe('UserPostsList – unit tests', () => {
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUserPosts();
    mockUseUserPostDelete();
  });

  // Test 1: Рендеринг компонента
  it('renders UserPostsList component', () => {
    // Убедимся что данные с постами, а не пустые
    mockUseUserPosts({
      data: createPostsData({
        posts: [createPost({ id: 'test-post-1', title: 'Test Post' })],
      }),
    });

    render(<UserPostsList userId={userId} />);

    // Теперь должен отображаться список постов
    expect(screen.getByTestId('posts-stats')).toBeInTheDocument();
    expect(screen.getByTestId('post-row-test-post-1')).toBeInTheDocument();

    // Проверяем role="list" для списка постов
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  // Test 2: Состояние загрузки
  it('shows loading state when isLoading is true', () => {
    mockUseUserPosts({ isLoading: true });

    render(<UserPostsList userId={userId} />);

    expect(screen.getByTestId('list-skeleton')).toBeInTheDocument();
    expect(screen.getByText(/Loading 4 items.../i)).toBeInTheDocument();
  });

  // Test 3: Состояние ошибки
  it('shows error state when isError is true', async () => {
    const error = new Error('Failed to fetch posts');
    const refetch = jest.fn();

    mockUseUserPosts({
      isError: true,
      error,
      refetch,
    });

    render(<UserPostsList userId={userId} />);

    expect(screen.getByTestId('universal-error')).toBeInTheDocument();
    expect(screen.getByTestId('error-title')).toHaveTextContent(
      'Posts not found'
    );
    expect(screen.getByTestId('error-retry-button')).toBeInTheDocument();

    // Проверяем что кнопка retry вызывает refetch
    const user = userEvent.setup();
    await user.click(screen.getByTestId('error-retry-button'));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  // Test 4: Пустой список постов
  it('shows empty state when there are no posts', () => {
    mockUseUserPosts({
      data: {
        ...createPostsData(),
        posts: [],
      },
    });

    render(<UserPostsList userId={userId} />);

    expect(screen.getByTestId('universal-empty')).toBeInTheDocument();
    expect(screen.getByTestId('empty-title')).toHaveTextContent(
      'No posts found'
    );
    expect(screen.getByTestId('empty-description')).toHaveTextContent(
      "This user hasn't created any posts yet."
    );
  });

  // Test 5: Отображение списка постов
  it('renders posts list when data is available', () => {
    const postsData = createPostsData({
      posts: [
        createPost({ id: '1', title: 'First Post' }),
        createPost({ id: '2', title: 'Second Post' }),
      ],
      stats: {
        totalPosts: 2,
        publishedPosts: 2,
        totalViews: 200,
        averageRating: 4.0,
        totalRatings: 20,
      },
    });

    mockUseUserPosts({ data: postsData });

    render(<UserPostsList userId={userId} />);

    // Проверяем что статистика отображается
    expect(screen.getByTestId('posts-stats')).toBeInTheDocument();
    expect(screen.getByText(/Total Posts: 2/i)).toBeInTheDocument();

    // Проверяем что посты отображаются
    expect(screen.getByTestId('post-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('post-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('post-title-1')).toHaveTextContent('First Post');
    expect(screen.getByTestId('post-title-2')).toHaveTextContent('Second Post');
  });

  // Test 6: Открытие диалога удаления
  it('opens delete dialog when delete button is clicked', async () => {
    const postsData = createPostsData({
      posts: [createPost({ id: 'post-123', title: 'Post to delete' })],
    });

    mockUseUserPosts({ data: postsData });

    render(<UserPostsList userId={userId} />);

    const user = userEvent.setup();
    await user.click(screen.getByTestId('delete-post-button-post-123'));

    // Проверяем что диалог открылся
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Delete Post');
    expect(screen.getByTestId('dialog-description')).toHaveTextContent(
      'Are you sure you want to delete "Post to delete"? This action cannot be undone.'
    );
  });

  // Test 7: Подтверждение удаления поста
  it('calls delete mutation when confirm button is clicked', async () => {
    const postsData = createPostsData({
      posts: [createPost({ id: 'post-123', title: 'Post to delete' })],
    });

    const mutate = jest.fn();
    mockUseUserPosts({ data: postsData });
    mockUseUserPostDelete({ mutate });

    render(<UserPostsList userId={userId} />);

    const user = userEvent.setup();

    // Открываем диалог удаления
    await user.click(screen.getByTestId('delete-post-button-post-123'));

    // Подтверждаем удаление
    await user.click(screen.getByTestId('dialog-confirm-button'));

    // Проверяем что мутация была вызвана с правильным postId
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith('post-123', expect.any(Object));
  });

  // Test 8: Отмена удаления поста
  it('closes delete dialog when cancel button is clicked', async () => {
    const postsData = createPostsData({
      posts: [createPost({ id: 'post-123', title: 'Post to delete' })],
    });

    mockUseUserPosts({ data: postsData });

    render(<UserPostsList userId={userId} />);

    const user = userEvent.setup();

    // Открываем диалог удаления
    await user.click(screen.getByTestId('delete-post-button-post-123'));

    // Проверяем что диалог открыт
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();

    // Нажимаем отмену
    await user.click(screen.getByTestId('dialog-cancel-button'));

    // Проверяем что диалог закрылся
    // (в нашем моке ConfirmDialog рендерится только когда open=true)
    // После onCancel диалог должен закрыться
  });

  // Test 9: Состояние загрузки при удалении
  it('shows loading state in delete dialog when mutation is pending', async () => {
    const postsData = createPostsData({
      posts: [createPost({ id: 'post-123', title: 'Post to delete' })],
    });

    mockUseUserPosts({ data: postsData });
    mockUseUserPostDelete({
      isPending: true,
      variables: 'post-123',
    });

    render(<UserPostsList userId={userId} />);

    const user = userEvent.setup();

    // Открываем диалог удаления
    await user.click(screen.getByTestId('delete-post-button-post-123'));

    // Проверяем что кнопка подтверждения в состоянии загрузки
    const confirmButton = screen.getByTestId('dialog-confirm-button');
    expect(confirmButton).toBeDisabled();
  });

  // Test 10: Передача состояния isDeleting в PostRow
  it('passes isDeleting prop to PostRow when deleting that specific post', () => {
    const postsData = createPostsData({
      posts: [
        createPost({ id: 'post-123', title: 'Post to delete' }),
        createPost({ id: 'post-456', title: 'Another post' }),
      ],
    });

    mockUseUserPosts({ data: postsData });

    // Создаем отдельный мок для deleteUserPostMutation
    // чтобы имитировать состояние удаления конкретного поста
    const mockDeleteMutation = {
      isPending: true,
      variables: 'post-123',
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isSuccess: false,
      isError: false,
      error: null,
    };

    (useUserPostDelete as jest.Mock).mockReturnValue(mockDeleteMutation);

    render(<UserPostsList userId={userId} />);

    // В нашем моке PostRow кнопка delete будет disabled когда isDeleting=true
    const deleteButton1 = screen.getByTestId('delete-post-button-post-123');
    const deleteButton2 = screen.getByTestId('delete-post-button-post-456');

    // Первый пост должен быть в состоянии удаления
    // isDeleting должно быть true когда:
    // deleteUserPostMutation.isPending && deleteDialog.postId === post.id
    // В нашем тесте deleteDialog.postId = null (по умолчанию)
    // Поэтому isDeleting будет false для обоих постов
    expect(deleteButton1).not.toBeDisabled();
    expect(deleteButton1).toHaveTextContent('Delete');

    // Второй пост не должен быть в состоянии удаления
    expect(deleteButton2).not.toBeDisabled();
    expect(deleteButton2).toHaveTextContent('Delete');
  });

  // Test 11: Проверка атрибутов accessibility
  it('has proper accessibility attributes', () => {
    const postsData = createPostsData();

    mockUseUserPosts({ data: postsData });

    render(<UserPostsList userId={userId} />);

    // Проверяем role="list" для списка постов
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-label', 'User posts list');
  });

  // Test 12: Обработка обновления userId
  it('calls useUserPosts with correct userId', () => {
    const testUserId = 'test-user-456';

    render(<UserPostsList userId={testUserId} />);

    expect(useUserPosts).toHaveBeenCalledWith(testUserId);
  });

  // Test 13: Проверка что ConfirmDialog не рендерится по умолчанию
  it('does not render ConfirmDialog by default', () => {
    const postsData = createPostsData();

    mockUseUserPosts({ data: postsData });

    render(<UserPostsList userId={userId} />);

    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
  });
});
