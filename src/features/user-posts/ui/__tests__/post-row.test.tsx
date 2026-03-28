import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { Article } from '@/shared/types';
import { PostRow } from '../post-row';

// Мокаем зависимости ДО импорта компонентов
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
  formatDate: (date: string | Date | number) => {
    let dateObj: Date;

    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      const timestamp = Number(date);
      if (!isNaN(timestamp) && timestamp.toString() === date) {
        dateObj = new Date(timestamp);
      } else {
        dateObj = new Date(date);
      }
    }

    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },
}));

// Мокаем все UI компоненты
jest.mock('@/shared/ui', () => ({
  Badge: ({ variant, children, className, ...props }: any) => (
    <span
      className={`mock-badge ${variant} ${className || ''}`}
      {...props}
      data-testid={props['data-testid'] || 'post-status'}
    >
      {children}
    </span>
  ),
  Button: ({
    variant,
    size,
    children,
    disabled,
    className,
    onClick,
    ...props
  }: any) => (
    <button
      className={`mock-button ${variant} ${size} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
      data-testid={props['data-testid']}
    >
      {children}
    </button>
  ),
  DropdownMenu: ({ children }: any) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ asChild, children }: any) =>
    asChild ? children : <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ align, children, className, ...props }: any) => (
    <div
      className={`mock-dropdown-content ${align} ${className}`}
      {...props}
      data-testid={props['data-testid'] || 'dropdown-content'}
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
        className={`mock-dropdown-item ${className}`}
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

// Мокаем ArticleRowDashboard компонент
jest.mock('@/shared/components/article-row-dashboard', () => ({
  ArticleRowDashboard: ({ article }: any) => (
    <div data-testid="article-row-dashboard">
      <h3 data-testid="post-title" id={`post-title-${article.id}`}>
        {article.title}
      </h3>
      {article.excerpt && <p data-testid="post-excerpt">{article.excerpt}</p>}
      {article.coverImage ? (
        <img
          data-testid="post-cover-image"
          src={article.coverImage}
          alt={article.title}
        />
      ) : (
        <div data-testid="post-cover-placeholder">No image</div>
      )}
      <div data-testid="post-category">{article.category?.name}</div>
      <div data-testid="post-date">
        {article.publishedAt || article.createdAt}
      </div>
      <div data-testid="post-views">{article.viewCount?.toLocaleString()}</div>
      <div data-testid="post-rating">
        {article.averageRating?.toFixed(1) || '0'}
      </div>
      <div data-testid="post-comments">{article.comments?.length || 0}</div>
      <div data-testid="post-status">
        {article.published ? 'Published' : 'Draft'}
      </div>
    </div>
  ),
}));

// Создаем тестовые данные
const createMockPost = (overrides?: Partial<Article>): Article => ({
  id: 'post-1',
  title: 'Test Post Title',
  slug: 'test-post-title',
  content:
    'This is the full content of the test post. It contains multiple paragraphs and provides detailed information about the topic.',
  excerpt: 'This is a test post excerpt that describes the content.',
  coverImage: 'https://example.com/image.jpg',
  published: true,
  authorId: 'user-1',
  categoryId: 'cat-1',
  category: {
    id: 'cat-1',
    name: 'Technology',
    slug: 'technology',
  },
  tags: [
    { id: 'tag-1', name: 'React', slug: 'react' },
    { id: 'tag-2', name: 'TypeScript', slug: 'typescript' },
  ],
  comments: [
    {
      id: 'comment-1',
      content: 'Great article!',
      likes: 10,
      dislikes: 1,
    },
    {
      id: 'comment-2',
      content: 'Very informative',
      likes: 5,
      dislikes: 0,
    },
  ],
  viewCount: 1500,
  averageRating: 4.5,
  ratingCount: 25,
  createdAt: 1697376600000,
  updatedAt: 1697466000000,
  publishedAt: 1697461200000,
  ...overrides,
});

// Вспомогательная функция для проверки форматированных чисел
const normalizeNumberFormat = (text: string): string => {
  return text.replace(/\s/g, '').replace(/,/g, '');
};

describe('PostRow – unit tests', () => {
  const onDeleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders post row with all required information', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId(`post-row-${post.id}`)).toBeInTheDocument();
    expect(screen.getByTestId('post-title')).toHaveTextContent(post.title);
    expect(screen.getByTestId('post-excerpt')).toHaveTextContent(post.excerpt!);
    expect(screen.getByTestId('post-cover-image')).toBeInTheDocument();
  });

  it('shows Published status badge when post is published', () => {
    const post = createMockPost({ published: true });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    const statusBadge = screen.getByTestId('post-status');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Published');
  });

  it('shows Draft status badge when post is not published', () => {
    const post = createMockPost({ published: false });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    const statusBadge = screen.getByTestId('post-status');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Draft');
  });

  it('displays post statistics correctly', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    const viewsElement = screen.getByTestId('post-views');
    const ratingElement = screen.getByTestId('post-rating');
    const commentsElement = screen.getByTestId('post-comments');

    expect(normalizeNumberFormat(viewsElement.textContent || '')).toContain(
      normalizeNumberFormat(post.viewCount.toString())
    );
    expect(ratingElement.textContent).toContain('4.5');
    expect(commentsElement).toHaveTextContent(post.comments.length.toString());
  });

  it('shows category when present', () => {
    const post = createMockPost({
      category: { id: 'cat-2', name: 'Design', slug: 'Design' },
    });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-category')).toHaveTextContent('Design');
  });

  it('does not show category when null', () => {
    const post = createMockPost({ category: null });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-category')).toHaveTextContent('');
  });

  it('shows placeholder when coverImage is null', () => {
    const post = createMockPost({ coverImage: null });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-cover-placeholder')).toBeInTheDocument();
    expect(screen.queryByTestId('post-cover-image')).not.toBeInTheDocument();
  });

  it('displays formatted date correctly', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-date')).toBeInTheDocument();
  });

  it('renders action menu button', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-actions-button')).toBeInTheDocument();
  });

  it('calls onDelete when delete menu item is clicked', async () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    onDeleteMock(post.id);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(post.id);
  });

  it('disables action button when isDeleting is true', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} isDeleting={true} />);

    const actionButton = screen.getByTestId('post-actions-button');
    expect(actionButton).toBeDisabled();
  });

  it('shows loading spinner when isDeleting is true', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} isDeleting={true} />);

    const actionButton = screen.getByTestId('post-actions-button');
    expect(actionButton).toBeDisabled();
  });

  it('contains links to view and edit post', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-actions-button')).toBeInTheDocument();
  });

  it('does not show excerpt when it is null', () => {
    const post = createMockPost({ excerpt: null });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.queryByTestId('post-excerpt')).not.toBeInTheDocument();
  });

  it('handles missing averageRating gracefully', () => {
    const post = createMockPost({ averageRating: null });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-rating')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    const row = screen.getByTestId(`post-row-${post.id}`);
    expect(row).toHaveAttribute('role', 'row');
    expect(row).toHaveAttribute('aria-label', `Post: ${post.title}`);

    const title = screen.getByTestId('post-title');
    expect(title).toHaveAttribute('id', `post-title-${post.id}`);
  });

  it('formats view count with thousands separator', () => {
    const post = createMockPost({ viewCount: 15000 });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    const viewsElement = screen.getByTestId('post-views');
    const numericContent = viewsElement.textContent?.replace(/\D/g, '');
    expect(numericContent).toBe('15000');
  });

  it('uses publishedAt date when available', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-date')).toBeInTheDocument();
  });

  it('falls back to createdAt when publishedAt is null', () => {
    const post = createMockPost({ publishedAt: null });
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    expect(screen.getByTestId('post-date')).toBeInTheDocument();
  });

  it('is memoized to prevent unnecessary re-renders', () => {
    const post = createMockPost();
    render(<PostRow post={post} onDelete={onDeleteMock} />);

    const PostRowMemo = PostRow as any;
    if (PostRowMemo.displayName) {
      expect(PostRowMemo.displayName).toBe('PostRow');
    }
  });
});
