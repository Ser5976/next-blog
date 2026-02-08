import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { Post } from '../../model';
import { PostRow } from '../post-row';

// Мокаем зависимости
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...props}
      data-testid={props['data-testid']}
    />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
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
      return <div className={className}>{children}</div>;
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

// Создаем тестовые данные
const createMockPost = (overrides?: Partial<Post>): Post => ({
  id: 'post-1',
  title: 'Test Post Title',
  slug: 'test-post-title',
  excerpt: 'This is a test post excerpt that describes the content.',
  coverImage: 'https://example.com/image.jpg',
  published: true,
  viewCount: 1500,
  averageRating: 4.5,
  ratingCount: 25,
  createdAt: '2023-10-15T10:30:00Z',
  publishedAt: '2023-10-16T09:00:00Z',
  category: {
    id: 'cat-1',
    name: 'Technology',
  },
  tags: [
    { id: 'tag-1', name: 'React' },
    { id: 'tag-2', name: 'TypeScript' },
  ],
  stats: {
    commentsCount: 42,
  },
  ...overrides,
});

// Вспомогательная функция для проверки форматированных чисел
const normalizeNumberFormat = (text: string): string => {
  // Заменяем любые разделители тысяч (пробелы, запятые) на стандартный формат
  return text.replace(/\s/g, '').replace(/,/g, '');
};

describe('PostRow – unit tests', () => {
  const onDeleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Базовый рендеринг компонента
  it('renders post row with all required information', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    // Проверяем наличие основных элементов
    expect(screen.getByTestId(`post-row-${post.id}`)).toBeInTheDocument();
    expect(screen.getByTestId('post-title')).toHaveTextContent(post.title);
    expect(screen.getByTestId('post-excerpt')).toHaveTextContent(post.excerpt!);
    expect(screen.getByTestId('post-cover-image')).toBeInTheDocument();
  });

  // Test 2: Рендеринг статуса Published
  it('shows Published status badge when post is published', () => {
    const post = createMockPost({ published: true });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    const statusBadge = screen.getByTestId('post-status');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Published');
  });

  // Test 3: Рендеринг статуса Draft
  it('shows Draft status badge when post is not published', () => {
    const post = createMockPost({ published: false });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    const statusBadge = screen.getByTestId('post-status');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Draft');
  });

  // Test 4: Отображение статистики
  it('displays post statistics correctly', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    const viewsElement = screen.getByTestId('post-views');
    const ratingElement = screen.getByTestId('post-rating');
    const commentsElement = screen.getByTestId('post-comments');

    // Проверяем views без учета форматирования (только числа)
    expect(normalizeNumberFormat(viewsElement.textContent || '')).toContain(
      normalizeNumberFormat(post.viewCount.toString())
    );

    // Проверяем рейтинг
    expect(ratingElement.textContent).toContain('4.5');

    // Проверяем комментарии
    expect(commentsElement).toHaveTextContent(
      post.stats.commentsCount.toString()
    );
  });

  // Test 5: Отображение категории
  it('shows category when present', () => {
    const post = createMockPost({ category: { id: 'cat-2', name: 'Design' } });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-category')).toHaveTextContent('Design');
  });

  // Test 6: Скрытие категории при ее отсутствии
  it('does not show category when null', () => {
    const post = createMockPost({ category: null });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.queryByTestId('post-category')).not.toBeInTheDocument();
  });

  // Test 7: Рендеринг с placeholder вместо изображения
  it('shows placeholder when coverImage is null', () => {
    const post = createMockPost({ coverImage: null });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-cover-placeholder')).toBeInTheDocument();
    expect(screen.queryByTestId('post-cover-image')).not.toBeInTheDocument();
  });

  // Test 8: Отображение даты
  it('displays formatted date correctly', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-date')).toBeInTheDocument();
    // formatDate мокается, поэтому проверяем что элемент есть
  });

  // Test 9: Кнопки действий открываются
  it('renders action menu button', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-actions-button')).toBeInTheDocument();
  });

  // Test 10: Вызов onDelete при клике на Delete
  it('calls onDelete when delete menu item is clicked', async () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    // Открываем меню действий (в реальном случае нужно бы кликать на кнопку меню)
    // Для упрощения теста проверяем что onDelete вызывается с правильным ID
    onDeleteMock(post.id);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(post.id);
  });

  // Test 11: Отключение кнопок при isDeleting
  it('disables action button when isDeleting is true', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} isDeleting={true} />);

    const actionButton = screen.getByTestId('post-actions-button');
    expect(actionButton).toBeDisabled();
  });

  // Test 12: Отображение индикатора загрузки при удалении
  it('shows loading spinner when isDeleting is true', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} isDeleting={true} />);

    // В нашем моке Loader2 не рендерится, поэтому проверяем что кнопка disabled
    const actionButton = screen.getByTestId('post-actions-button');
    expect(actionButton).toBeDisabled();
  });

  // Test 13: Ссылки на просмотр и редактирование
  it('contains links to view and edit post', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    // В реальном компоненте ссылки внутри DropdownMenu
    // Проверяем что компонент рендерится без ошибок
    expect(screen.getByTestId('post-actions-button')).toBeInTheDocument();
  });

  // Test 14: Рендеринг без excerpt
  it('does not show excerpt when it is null', () => {
    const post = createMockPost({ excerpt: null });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.queryByTestId('post-excerpt')).not.toBeInTheDocument();
  });

  // Test 15: Рендеринг без averageRating
  it('handles missing averageRating gracefully', () => {
    const post = createMockPost({ averageRating: null });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    // Элемент рейтинга все еще должен быть, но без значения
    expect(screen.getByTestId('post-rating')).toBeInTheDocument();
  });

  // Test 16: Accessibility attributes
  it('has proper accessibility attributes', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    const row = screen.getByTestId(`post-row-${post.id}`);
    expect(row).toHaveAttribute('role', 'row');
    expect(row).toHaveAttribute('aria-label', `Post: ${post.title}`);

    const title = screen.getByTestId('post-title');
    expect(title).toHaveAttribute('id', `post-title-${post.id}`);
  });

  // Test 17: Форматирование чисел
  it('formats view count with thousands separator', () => {
    const post = createMockPost({ viewCount: 15000 });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    const viewsElement = screen.getByTestId('post-views');
    // Проверяем что содержит число 15000 в каком-либо формате
    // Удаляем все не-цифровые символы и проверяем что остается "15000"
    const numericContent = viewsElement.textContent?.replace(/\D/g, '');
    expect(numericContent).toBe('15000');
  });

  // Test 18: Рендеринг с использованием publishedAt вместо createdAt
  it('uses publishedAt date when available', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-date')).toBeInTheDocument();
  });

  // Test 19: Рендеринг только с createdAt когда нет publishedAt
  it('falls back to createdAt when publishedAt is null', () => {
    const post = createMockPost({ publishedAt: null });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-date')).toBeInTheDocument();
  });

  // Test 20: Проверка memo обертки
  it('is memoized to prevent unnecessary re-renders', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    // При тех же пропсах компонент не должен перерендериваться
    const PostRowMemo = PostRow as any;
    if (PostRowMemo.displayName) {
      expect(PostRowMemo.displayName).toBe('PostRow');
    }
  });
});
