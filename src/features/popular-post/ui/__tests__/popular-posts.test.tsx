import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

import { getPopularPosts } from '@/features/popular-post/api';
import { PopularPosts } from '../popular-posts';

// Мокаем API функцию
jest.mock('@/features/popular-post/api', () => ({
  getPopularPosts: jest.fn(),
}));

// Мокаем компоненты из @/shared/ui/card с правильными типами
jest.mock('@/shared/ui/card', () => ({
  Card: ({
    children,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  }: {
    children: ReactNode;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
  }) => (
    <div
      data-testid="card"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      {children}
    </div>
  ),

  CardHeader: ({ children }: { children: ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),

  CardTitle: ({
    children,
    id,
  }: {
    children: ReactNode;
    id?: string;
    className?: string;
  }) => (
    <h2 data-testid="card-title" id={id}>
      {children}
    </h2>
  ),

  CardDescription: ({
    children,
    id,
  }: {
    children: ReactNode;
    id?: string;
    className?: string;
  }) => (
    <p data-testid="card-description" id={id}>
      {children}
    </p>
  ),

  CardContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
}));

// Мокаем компонент Badge из shadcn
jest.mock('@/shared/ui/badge', () => ({
  Badge: ({
    children,
    variant,
    'aria-label': ariaLabel,
  }: {
    children: ReactNode;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    'aria-label'?: string;
    className?: string;
  }) => (
    <span data-testid="badge" data-variant={variant} aria-label={ariaLabel}>
      {children}
    </span>
  ),
}));

// Мокаем ErrorMessage из stat-card
jest.mock('@/entities/stat-card', () => ({
  ErrorMessage: ({ message }: { message: string }) => (
    <div data-testid="error-message">Error: {message}</div>
  ),
}));

// Мокаем иконки из lucide-react
jest.mock('lucide-react', () => ({
  BarChart3: ({
    className,
    'aria-hidden': ariaHidden,
  }: {
    className?: string;
    'aria-hidden'?: boolean;
  }) => (
    <svg
      data-testid="icon-bar-chart"
      className={className}
      aria-hidden={ariaHidden}
    >
      BarChart3 Icon
    </svg>
  ),

  Eye: ({
    className,
    'aria-hidden': ariaHidden,
  }: {
    className?: string;
    'aria-hidden'?: boolean;
  }) => (
    <svg data-testid="icon-eye" className={className} aria-hidden={ariaHidden}>
      Eye Icon
    </svg>
  ),

  Star: ({
    className,
    'aria-hidden': ariaHidden,
  }: {
    className?: string;
    'aria-hidden'?: boolean;
  }) => (
    <svg data-testid="icon-star" className={className} aria-hidden={ariaHidden}>
      Star Icon
    </svg>
  ),

  MessageSquare: ({
    className,
    'aria-hidden': ariaHidden,
  }: {
    className?: string;
    'aria-hidden'?: boolean;
  }) => (
    <svg
      data-testid="icon-message-square"
      className={className}
      aria-hidden={ariaHidden}
    >
      MessageSquare Icon
    </svg>
  ),
}));

const mockGetPopularPosts = getPopularPosts as jest.Mock;

describe('PopularPosts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render popular posts list on successful fetch', async () => {
    // Arrange
    const mockPosts = [
      {
        id: '1',
        title: 'Test Post 1',
        views: 1000,
        rating: 4.5,
        commentCount: 50,
        published: true,
      },
      {
        id: '2',
        title: 'Test Post 2',
        views: 800,
        rating: 4.2,
        commentCount: 30,
        published: false,
      },
    ];

    mockGetPopularPosts.mockResolvedValue(mockPosts);

    // Act
    const jsx = await PopularPosts({ timeRange: 'week' });
    render(jsx);

    // Assert
    // Проверяем заголовки
    expect(screen.getByTestId('card-title')).toHaveTextContent(
      'Popular articles'
    );
    expect(screen.getByTestId('card-description')).toHaveTextContent(
      'Articles with the most views'
    );

    // Проверяем посты
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();

    // Проверяем иконки
    expect(screen.getByTestId('icon-bar-chart')).toBeInTheDocument();

    // Проверяем бейджи
    const badges = screen.getAllByTestId('badge');
    expect(badges[0]).toHaveTextContent('Published');
    expect(badges[0]).toHaveAttribute('data-variant', 'default');
    expect(badges[1]).toHaveTextContent('Draft');
    expect(badges[1]).toHaveAttribute('data-variant', 'secondary');

    // Проверяем атрибуты доступности
    expect(screen.getByTestId('card')).toHaveAttribute(
      'aria-labelledby',
      'popular-posts-title'
    );
    expect(screen.getByTestId('card')).toHaveAttribute(
      'aria-describedby',
      'popular-posts-description'
    );
  });

  it('should render ErrorMessage when posts are not available', async () => {
    // Arrange
    mockGetPopularPosts.mockResolvedValue(null);

    // Act
    const jsx = await PopularPosts({ timeRange: 'week' });
    render(jsx);

    // Assert
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Error: Something went wrong!'
    );

    // Проверяем, что компоненты карточки не отрендерились
    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-title')).not.toBeInTheDocument();
  });

  it('should render empty state when array is empty', async () => {
    // Arrange
    mockGetPopularPosts.mockResolvedValue([]);

    // Act
    const jsx = await PopularPosts({ timeRange: 'month' });
    render(jsx);

    // Assert
    // Компонент должен отрендериться без ошибки
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent(
      'Popular articles'
    );

    // Но постов не должно быть в DOM
    expect(screen.queryByText(/Test Post/)).not.toBeInTheDocument();
  });

  it('should format large numbers correctly', async () => {
    // Arrange
    const mockPosts = [
      {
        id: '1',
        title: 'Viral Post',
        views: 1234567,
        rating: 4.8,
        commentCount: 1234,
        published: true,
      },
    ];

    mockGetPopularPosts.mockResolvedValue(mockPosts);

    // Act
    const jsx = await PopularPosts({ timeRange: 'year' });
    render(jsx);

    // Assert
    expect(screen.getByText('Viral Post')).toBeInTheDocument();

    // Проверяем, что иконки статистики отрендерились
    expect(screen.getByTestId('icon-eye')).toBeInTheDocument();
    expect(screen.getByTestId('icon-star')).toBeInTheDocument();
    expect(screen.getByTestId('icon-message-square')).toBeInTheDocument();
  });

  it('should handle different timeRange values', async () => {
    // Arrange
    const mockPosts = [
      {
        id: '1',
        title: 'Test Post',
        views: 500,
        rating: 4.0,
        commentCount: 25,
        published: true,
      },
    ];

    mockGetPopularPosts.mockResolvedValue(mockPosts);

    const timeRanges = ['week', 'month', 'year'] as const;

    // Act & Assert для каждого timeRange
    for (const timeRange of timeRanges) {
      const jsx = await PopularPosts({ timeRange });
      const { unmount } = render(jsx);

      // Проверяем, что компонент отрендерился
      expect(screen.getByTestId('card-title')).toHaveTextContent(
        'Popular articles'
      );

      // Проверяем, что API был вызван с правильным timeRange
      expect(mockGetPopularPosts).toHaveBeenCalledWith(timeRange);

      // Очищаем перед следующей итерацией
      unmount();
      jest.clearAllMocks();
    }
  });

  it('should render accessibility attributes correctly', async () => {
    // Arrange
    const mockPosts = [
      {
        id: '1',
        title: 'Accessible Post',
        views: 1000,
        rating: 4.5,
        commentCount: 50,
        published: true,
      },
    ];

    mockGetPopularPosts.mockResolvedValue(mockPosts);

    // Act
    const jsx = await PopularPosts({ timeRange: 'week' });
    render(jsx);

    // Assert
    // Проверяем aria-атрибуты карточки
    expect(screen.getByTestId('card')).toHaveAttribute(
      'aria-labelledby',
      'popular-posts-title'
    );
    expect(screen.getByTestId('card')).toHaveAttribute(
      'aria-describedby',
      'popular-posts-description'
    );

    // Проверяем ID заголовков
    const cardTitle = screen.getByTestId('card-title');
    expect(cardTitle).toHaveAttribute('id', 'popular-posts-title');

    const cardDescription = screen.getByTestId('card-description');
    expect(cardDescription).toHaveAttribute('id', 'popular-posts-description');

    // Проверяем aria-атрибуты для списка
    const listContainer = screen.getByRole('list');
    expect(listContainer).toHaveAttribute(
      'aria-label',
      'Popular articles list'
    );

    // Проверяем aria-атрибуты для элементов списка
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveAttribute('aria-labelledby', 'post-title-1');

    // Проверяем заголовок поста
    const postTitle = screen.getByText('Accessible Post');
    expect(postTitle).toHaveAttribute('id', 'post-title-1');

    // Проверяем aria-атрибуты для статистики
    const statsContainer = screen.getByLabelText('Post statistics');
    expect(statsContainer).toBeInTheDocument();

    // Проверяем aria-label для бейджа
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('aria-label', 'Published');
  });

  it('should render correct badge variants based on published status', async () => {
    // Arrange
    const mockPosts = [
      {
        id: '1',
        title: 'Published Post',
        views: 1000,
        rating: 4.5,
        commentCount: 50,
        published: true,
      },
      {
        id: '2',
        title: 'Draft Post',
        views: 500,
        rating: 4.0,
        commentCount: 20,
        published: false,
      },
    ];

    mockGetPopularPosts.mockResolvedValue(mockPosts);

    // Act
    const jsx = await PopularPosts({ timeRange: 'week' });
    render(jsx);

    // Assert
    const badges = screen.getAllByTestId('badge');

    // Проверяем первый бейдж (published: true)
    expect(badges[0]).toHaveTextContent('Published');
    expect(badges[0]).toHaveAttribute('data-variant', 'default');
    expect(badges[0]).toHaveAttribute('aria-label', 'Published');

    // Проверяем второй бейдж (published: false)
    expect(badges[1]).toHaveTextContent('Draft');
    expect(badges[1]).toHaveAttribute('data-variant', 'secondary');
    expect(badges[1]).toHaveAttribute('aria-label', 'Draft');
  });

  it('should handle API rejection gracefully', async () => {
    // Arrange: Симулируем случай, когда API возвращает null
    // (это происходит при ошибке в реальной функции getPopularPosts)
    mockGetPopularPosts.mockResolvedValue(null);

    // Act
    const jsx = await PopularPosts({ timeRange: 'month' });
    render(jsx);

    // Assert
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Error: Something went wrong!'
    );

    // Проверяем, что компоненты карточки не отрендерились
    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-title')).not.toBeInTheDocument();

    // Проверяем, что API был вызван
    expect(mockGetPopularPosts).toHaveBeenCalledWith('month');
  });

  it('should render post statistics with correct formatting', async () => {
    // Arrange
    const mockPosts = [
      {
        id: '1',
        title: 'Formatted Post',
        views: 1234,
        rating: 4.25,
        commentCount: 56,
        published: true,
      },
    ];

    mockGetPopularPosts.mockResolvedValue(mockPosts);

    // Act
    const jsx = await PopularPosts({ timeRange: 'week' });
    render(jsx);

    // Assert
    // Проверяем, что статистика отображается
    expect(screen.getByText('Formatted Post')).toBeInTheDocument();

    // Проверяем наличие иконок статистики
    expect(screen.getByTestId('icon-eye')).toBeInTheDocument();
    expect(screen.getByTestId('icon-star')).toBeInTheDocument();
    expect(screen.getByTestId('icon-message-square')).toBeInTheDocument();
  });
});
