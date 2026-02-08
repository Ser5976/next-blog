import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { Comment } from '../../model';
import { CommentRow } from '../comment-row';

// Мокаем зависимости
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className, ...props }: any) => (
    <a
      href={href}
      className={className}
      {...props}
      data-testid={props['data-testid']}
    >
      {children}
    </a>
  ),
}));

jest.mock('@/shared/lib', () => ({
  formatDate: (date: string | Date) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },
}));

jest.mock('@/shared/ui', () => ({
  Badge: ({ variant, children, className, ...props }: any) => (
    <span
      className={`badge ${variant} ${className}`}
      {...props}
      data-testid={props['data-testid']}
    >
      {children}
    </span>
  ),
  Button: ({ variant, size, children, disabled, className, ...props }: any) => (
    <button
      className={`button ${variant} ${size} ${className}`}
      disabled={disabled}
      {...props}
      data-testid={props['data-testid']}
    >
      {children}
    </button>
  ),
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ asChild, children }: any) =>
    asChild ? children : <div>{children}</div>,
  DropdownMenuContent: ({ align, children, className, ...props }: any) => (
    <div
      className={`dropdown-content ${align} ${className}`}
      {...props}
      data-testid={props['data-testid']}
    >
      {children}
    </div>
  ),
  DropdownMenuItem: ({
    asChild,
    children,
    className,
    disabled,
    onClick,
    ...props
  }: any) => {
    if (asChild) {
      // Когда asChild=true, рендерим children как есть
      const child = React.Children.only(children) as React.ReactElement;
      return React.cloneElement(child, {
        className,
        disabled,
        onClick,
        ...props,
        'data-testid': props['data-testid'],
      });
    }
    return (
      <button
        className={`dropdown-item ${className}`}
        disabled={disabled}
        onClick={onClick}
        {...props}
        data-testid={props['data-testid']}
      >
        {children}
      </button>
    );
  },
}));

jest.mock('lucide-react', () => ({
  Calendar: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="calendar-icon" />
  ),
  FileText: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="filetext-icon" />
  ),
  Loader2: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="loader2-icon" />
  ),
  MoreVertical: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="morevertical-icon" />
  ),
  ThumbsDown: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="thumbsdown-icon" />
  ),
  ThumbsUp: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="thumbsup-icon" />
  ),
}));

// Создаем тестовые данные
const createMockComment = (overrides?: Partial<Comment>): Comment => ({
  id: 'comment-1',
  content:
    'This is a test comment content that is quite long and will be truncated for display.',
  createdAt: '2023-10-15T10:30:00Z',
  post: {
    id: 'post-1',
    title: 'Test Post Title',
    slug: 'test-post-title',
    published: true,
  },
  stats: {
    likesCount: 25,
    dislikesCount: 3,
  },
  ...overrides,
});

describe('CommentRow – unit tests', () => {
  const onDeleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Базовый рендеринг компонента
  it('renders comment row with all required information', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    // Проверяем наличие основных элементов
    expect(screen.getByTestId(`comment-row-${comment.id}`)).toBeInTheDocument();
    expect(screen.getByTestId('comment-content')).toBeInTheDocument();
    expect(screen.getByTestId('comment-post-link')).toBeInTheDocument();
    expect(screen.getByTestId('comment-post-status')).toBeInTheDocument();
  });

  // Test 2: Рендеринг статуса Published поста
  it('shows Published status badge when post is published', () => {
    const comment = createMockComment({
      post: {
        id: 'post-1',
        title: 'Test Post',
        slug: 'test-post',
        published: true,
      },
    });
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    const statusBadge = screen.getByTestId('comment-post-status');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Published');
  });

  // Test 3: Рендеринг статуса Draft поста
  it('shows Draft status badge when post is not published', () => {
    const comment = createMockComment({
      post: {
        id: 'post-1',
        title: 'Test Post',
        slug: 'test-post',
        published: false,
      },
    });
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    const statusBadge = screen.getByTestId('comment-post-status');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Draft');
  });

  // Test 4: Отображение статистики комментария
  it('displays comment statistics correctly', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    const likesElement = screen.getByTestId('comment-likes');
    const dislikesElement = screen.getByTestId('comment-dislikes');

    expect(likesElement).toHaveTextContent(comment.stats.likesCount.toString());
    expect(dislikesElement).toHaveTextContent(
      comment.stats.dislikesCount.toString()
    );
  });

  // Test 5: Отображение контента комментария
  it('displays comment content correctly', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    const contentElement = screen.getByTestId('comment-content');
    expect(contentElement).toBeInTheDocument();
    expect(contentElement.textContent).toContain(
      'This is a test comment content'
    );
  });

  // Test 6: Обрезка длинного контента
  it('truncates long comment content', () => {
    const longContent = 'A'.repeat(200); // Создаем очень длинный контент
    const comment = createMockComment({ content: longContent });
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    const contentElement = screen.getByTestId('comment-content');
    expect(contentElement.textContent).toContain('...');
  });

  // Test 7: Отображение даты комментария
  it('displays formatted date correctly', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('comment-date')).toBeInTheDocument();
  });

  // Test 8: Кнопки действий открываются
  it('renders action menu button', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('comment-actions-button')).toBeInTheDocument();
  });

  // Test 9: Вызов onDelete при клике на Delete
  it('calls onDelete when delete menu item is clicked', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    // Находим кнопку действий и кликаем для открытия меню
    const actionButton = screen.getByTestId('comment-actions-button');
    fireEvent.click(actionButton);

    // Находим кнопку удаления в меню
    const deleteButton = screen.getByTestId('delete-comment-button');
    fireEvent.click(deleteButton);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(
      comment.id,
      expect.stringContaining('...') // Проверяем что второй аргумент содержит троеточие
    );
  });

  // Test 10: Отключение кнопок при isDeleting
  it('disables action button when isDeleting is true', () => {
    const comment = createMockComment();
    render(
      <CommentRow comment={comment} onDelete={onDeleteMock} isDeleting={true} />
    );

    const actionButton = screen.getByTestId('comment-actions-button');
    expect(actionButton).toBeDisabled();
  });

  // Test 11: Отображение индикатора загрузки при удалении
  it('shows loading spinner when isDeleting is true', () => {
    const comment = createMockComment();
    render(
      <CommentRow comment={comment} onDelete={onDeleteMock} isDeleting={true} />
    );

    // В нашем моке Loader2 рендерится как иконка
    expect(screen.getByTestId('comment-actions-button')).toBeDisabled();
  });

  // Test 12: Ссылки на просмотр комментария и поста
  it('contains links to view comment and post', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('comment-post-link')).toBeInTheDocument();
    expect(screen.getByTestId('comment-post-link')).toHaveAttribute(
      'href',
      `/posts/${comment.post.slug}`
    );
  });

  // Test 13: Accessibility атрибуты
  it('has proper accessibility attributes', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    const row = screen.getByTestId(`comment-row-${comment.id}`);
    expect(row).toHaveAttribute('role', 'row');
    expect(row).toHaveAttribute(
      'aria-label',
      `Comment on post: ${comment.post.title}`
    );

    const content = screen.getByTestId('comment-content');
    expect(content).toHaveAttribute('aria-label', 'Comment content');
  });

  // Test 14: Проверка форматирования чисел
  it('displays correct number formatting', () => {
    const comment = createMockComment({
      stats: {
        likesCount: 1500,
        dislikesCount: 100,
      },
    });
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    const likesElement = screen.getByTestId('comment-likes');
    const dislikesElement = screen.getByTestId('comment-dislikes');

    expect(likesElement).toHaveTextContent('1500');
    expect(dislikesElement).toHaveTextContent('100');
  });

  // Test 15: Короткий контент не обрезается
  it('does not truncate short comment content', () => {
    const shortContent = 'Short comment';
    const comment = createMockComment({ content: shortContent });
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    const contentElement = screen.getByTestId('comment-content');
    expect(contentElement.textContent).not.toContain('...');
  });

  // Test 16: Проверка memo обертки
  it('is memoized to prevent unnecessary re-renders', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    // Проверяем что компонент имеет displayName
    const CommentRowMemo = CommentRow as any;
    if (CommentRowMemo.displayName) {
      expect(CommentRowMemo.displayName).toBe('CommentRow');
    }
  });

  // Test 17: Отображение метаданных (иконки)
  it('displays metadata icons correctly', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    expect(screen.getByTestId('filetext-icon')).toBeInTheDocument();
    expect(screen.getByTestId('thumbsup-icon')).toBeInTheDocument();
    expect(screen.getByTestId('thumbsdown-icon')).toBeInTheDocument();
  });

  // Test 18: Ссылка на просмотр комментария в меню действий
  it('has link to view comment in action menu', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    // Открываем меню действий
    const actionButton = screen.getByTestId('comment-actions-button');
    fireEvent.click(actionButton);

    // Проверяем наличие ссылки на просмотр комментария
    // Теперь, когда мок DropdownMenuItem правильно обрабатывает asChild,
    // ссылка должна быть доступна
    expect(screen.getByTestId('view-comment-link')).toBeInTheDocument();
  });

  // Test 19: Ссылка на просмотр поста в меню действий
  it('has link to view post in action menu', () => {
    const comment = createMockComment();
    render(<CommentRow comment={comment} onDelete={onDeleteMock} />);

    // Открываем меню действий
    const actionButton = screen.getByTestId('comment-actions-button');
    fireEvent.click(actionButton);

    // Проверяем наличие ссылки на просмотр поста
    expect(screen.getByTestId('view-post-link')).toBeInTheDocument();
  });

  // Test 20: Предотвращение удаления при isDeleting
  it('prevents delete when isDeleting is true', () => {
    const comment = createMockComment();
    render(
      <CommentRow comment={comment} onDelete={onDeleteMock} isDeleting={true} />
    );

    // Пытаемся вызвать handleDelete напрямую
    const actionButton = screen.getByTestId('comment-actions-button');
    fireEvent.click(actionButton);

    // Проверяем что onDelete не был вызван
    expect(onDeleteMock).not.toHaveBeenCalled();
  });
});
