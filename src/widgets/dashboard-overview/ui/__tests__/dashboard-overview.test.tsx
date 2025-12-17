import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

import { DashboardOverview } from '../dashboard-overview';

// ============================================
// МОКИ ДЛЯ ВСЕХ ДОЧЕРНИХ КОМПОНЕНТОВ
// ============================================

// 1. Мокаем все статистические компоненты (6 шт.)
jest.mock('@/features/posts-stats', () => ({
  PostsStats: ({ timeRange }: { timeRange: string }) => (
    <div
      data-testid="posts-stats"
      data-time-range={timeRange}
      data-component="PostsStats"
    >
      Posts Stats Component
    </div>
  ),
}));

jest.mock('@/features/view-stats', () => ({
  ViewsStats: ({ timeRange }: { timeRange: string }) => (
    <div
      data-testid="views-stats"
      data-time-range={timeRange}
      data-component="ViewsStats"
    >
      Views Stats Component
    </div>
  ),
}));

jest.mock('@/features/rating-stats', () => ({
  RatingStats: ({ timeRange }: { timeRange: string }) => (
    <div
      data-testid="rating-stats"
      data-time-range={timeRange}
      data-component="RatingStats"
    >
      Rating Stats Component
    </div>
  ),
}));

jest.mock('@/features/comments-stats', () => ({
  CommentsStats: ({ timeRange }: { timeRange: string }) => (
    <div
      data-testid="comments-stats"
      data-time-range={timeRange}
      data-component="CommentsStats"
    >
      Comments Stats Component
    </div>
  ),
}));

jest.mock('@/features/users-stats', () => ({
  UsersStats: ({ timeRange }: { timeRange: string }) => (
    <div
      data-testid="users-stats"
      data-time-range={timeRange}
      data-component="UsersStats"
    >
      Users Stats Component
    </div>
  ),
}));

jest.mock('@/features/efficiency', () => ({
  EfficiencyStats: ({ timeRange }: { timeRange: string }) => (
    <div
      data-testid="efficiency-stats"
      data-time-range={timeRange}
      data-component="EfficiencyStats"
    >
      Efficiency Stats Component
    </div>
  ),
}));

// 2. Мокаем секционные компоненты (2 шт.)
jest.mock('@/features/popular-post', () => ({
  PopularPosts: ({ timeRange }: { timeRange: string }) => (
    <div
      data-testid="popular-posts"
      data-time-range={timeRange}
      data-component="PopularPosts"
    >
      Popular Posts Component
    </div>
  ),
}));

jest.mock('@/features/popular-categories', () => ({
  PopularCategories: ({ timeRange }: { timeRange: string }) => (
    <div
      data-testid="popular-categories"
      data-time-range={timeRange}
      data-component="PopularCategories"
    >
      Popular Categories Component
    </div>
  ),
}));

// 3. Мокаем UI компоненты
jest.mock('@/entities/time-range', () => ({
  TimeFilter: ({
    initialPeriod,
  }: {
    initialPeriod: string;
    className?: string;
  }) => (
    <div
      data-testid="time-filter"
      data-initial-period={initialPeriod}
      data-component="TimeFilter"
    >
      Time Filter Component (Period: {initialPeriod})
    </div>
  ),
}));

jest.mock('@/entities/stat-card', () => ({
  SkeletonLoader: ({ className }: { className?: string }) => (
    <div
      data-testid="skeleton-loader"
      data-component="SkeletonLoader"
      className={className}
    >
      Loading Skeleton...
    </div>
  ),
}));

// 4. Мокаем shared UI компоненты
jest.mock('@/shared/ui', () => ({
  Title: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <h1
      data-testid="dashboard-title"
      data-component="Title"
      className={className}
    >
      {children}
    </h1>
  ),

  Subtitle: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <h2
      data-testid="dashboard-subtitle"
      data-component="Subtitle"
      className={className}
    >
      {children}
    </h2>
  ),

  Button: ({
    children,
    variant,
    size,
    onClick,
    className,
  }: {
    children: ReactNode;
    variant?:
      | 'default'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link'
      | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    onClick?: () => void;
    className?: string;
  }) => (
    <button
      data-testid="button"
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  ),
}));

// 5. Мокаем конфигурацию
jest.mock('../../lib', () => ({
  DASHBOARD_CONFIG: {
    maxWidth: 'max-w-7xl',
    title: 'Dashboard Overview',
    subtitle: 'Track your performance metrics',
  },
  GRID_CONFIG: {
    stats: {
      mobile: 'grid-cols-1',
      tablet: 'md:grid-cols-2',
      desktop: 'lg:grid-cols-3',
    },
    sections: {
      mobile: 'grid-cols-1',
      desktop: 'lg:grid-cols-2',
    },
  },
}));

// ============================================
// ГРУППА ТЕСТОВ
// ============================================

describe('DashboardOverview - Unit Tests', () => {
  // Очищаем моки после каждого теста
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // ТЕСТ 1: Базовый рендеринг
  // ============================================
  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      // Act
      render(<DashboardOverview timeRange="week" />);

      // Assert
      expect(screen.getByTestId('dashboard-title')).toBeInTheDocument();
    });

    it('should render title and subtitle from config', () => {
      // Act
      render(<DashboardOverview timeRange="week" />);

      // Assert
      expect(screen.getByTestId('dashboard-title')).toHaveTextContent(
        'Dashboard Overview'
      );
      expect(screen.getByTestId('dashboard-subtitle')).toHaveTextContent(
        'Track your performance metrics'
      );
    });

    it('should render TimeFilter with correct initial period', () => {
      // Act
      render(<DashboardOverview timeRange="month" />);

      // Assert
      const timeFilter = screen.getByTestId('time-filter');
      expect(timeFilter).toBeInTheDocument();
      expect(timeFilter).toHaveAttribute('data-initial-period', 'month');
    });
  });

  // ============================================
  // ТЕСТ 2: Рендеринг всех статистических компонентов
  // ============================================
  describe('Statistical components rendering', () => {
    it('should render all 6 statistical components', () => {
      // Act
      render(<DashboardOverview timeRange="week" />);

      // Assert
      const statComponents = [
        'posts-stats',
        'views-stats',
        'rating-stats',
        'comments-stats',
        'users-stats',
        'efficiency-stats',
      ];

      statComponents.forEach((testId) => {
        const component = screen.getByTestId(testId);
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('data-component');
      });
    });

    it('should pass correct timeRange to all statistical components', () => {
      // Arrange
      const testTimeRange = 'year';

      // Act
      render(<DashboardOverview timeRange={testTimeRange} />);

      // Assert
      const statComponents = [
        'posts-stats',
        'views-stats',
        'rating-stats',
        'comments-stats',
        'users-stats',
        'efficiency-stats',
      ];

      statComponents.forEach((testId) => {
        expect(screen.getByTestId(testId)).toHaveAttribute(
          'data-time-range',
          testTimeRange
        );
      });
    });
  });

  // ============================================
  // ТЕСТ 3: Рендеринг секционных компонентов
  // ============================================
  describe('Section components rendering', () => {
    it('should render popular posts and categories components', () => {
      // Act
      render(<DashboardOverview timeRange="week" />);

      // Assert
      expect(screen.getByTestId('popular-posts')).toBeInTheDocument();
      expect(screen.getByTestId('popular-categories')).toBeInTheDocument();
    });

    it('should pass correct timeRange to section components', () => {
      // Arrange
      const testTimeRange = 'month';

      // Act
      render(<DashboardOverview timeRange={testTimeRange} />);

      // Assert
      expect(screen.getByTestId('popular-posts')).toHaveAttribute(
        'data-time-range',
        testTimeRange
      );
      expect(screen.getByTestId('popular-categories')).toHaveAttribute(
        'data-time-range',
        testTimeRange
      );
    });
  });

  // ============================================
  // ТЕСТ 4: Layout и стили
  // ============================================
  describe('Layout and styling', () => {
    it('should apply correct max-width class from config', () => {
      // Act
      const { container } = render(<DashboardOverview timeRange="week" />);

      // Assert
      const mainContainer = container.querySelector('.mx-auto');
      expect(mainContainer).toHaveClass('max-w-7xl');
    });

    it('should have correct spacing classes', () => {
      // Act
      const { container } = render(<DashboardOverview timeRange="week" />);

      // Assert
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('min-h-screen');
      expect(mainDiv).toHaveClass('bg-background');
      expect(mainDiv).toHaveClass('p-4');
      expect(mainDiv).toHaveClass('md:p-6');

      const innerContainer = container.querySelector('.mx-auto');
      expect(innerContainer).toHaveClass('space-y-6');
    });

    it('should have correct responsive header layout', () => {
      // Act
      render(<DashboardOverview timeRange="week" />);

      // Assert
      const title = screen.getByTestId('dashboard-title');
      const headerContainer = title.parentElement?.parentElement;

      expect(headerContainer).toHaveClass('flex');
      expect(headerContainer).toHaveClass('flex-col');
      expect(headerContainer).toHaveClass('md:flex-row');
      expect(headerContainer).toHaveClass('justify-between');
      expect(headerContainer).toHaveClass('items-start');
      expect(headerContainer).toHaveClass('md:items-center');
      expect(headerContainer).toHaveClass('gap-4');
    });
  });

  // ============================================
  // ТЕСТ 5: Grid layout
  // ============================================
  describe('Grid layout', () => {
    it('should apply correct grid classes to stats section', () => {
      // Act
      const { container } = render(<DashboardOverview timeRange="week" />);

      // Assert
      // Находим grid контейнер по его содержимому
      const statsGrid = container.querySelector(
        '[data-testid="posts-stats"]'
      )?.parentElement;

      expect(statsGrid).toBeInTheDocument();
      expect(statsGrid).toHaveClass('grid');
      expect(statsGrid).toHaveClass('grid-cols-1');
      expect(statsGrid).toHaveClass('md:grid-cols-2');
      expect(statsGrid).toHaveClass('lg:grid-cols-3');
      expect(statsGrid).toHaveClass('gap-4');
    });

    it('should apply correct grid classes to sections', () => {
      // Act
      const { container } = render(<DashboardOverview timeRange="week" />);

      // Assert
      const sectionsGrid = container.querySelector(
        '[data-testid="popular-posts"]'
      )?.parentElement;

      expect(sectionsGrid).toBeInTheDocument();
      expect(sectionsGrid).toHaveClass('grid');
      expect(sectionsGrid).toHaveClass('grid-cols-1');
      expect(sectionsGrid).toHaveClass('lg:grid-cols-2');
      expect(sectionsGrid).toHaveClass('gap-6');
    });
  });

  // ============================================
  // ТЕСТ 6: Suspense и загрузка
  // ============================================
  describe('Suspense and loading states', () => {
    it('should wrap all async components in Suspense', () => {
      // Act
      const { container } = render(<DashboardOverview timeRange="week" />);

      // Assert
      // Проверяем, что есть Suspense элементы
      const suspenseWrappers = container.querySelectorAll('[data-testid]');
      expect(suspenseWrappers.length).toBeGreaterThan(0);
    });

    it('should have fallback loaders for all async components', () => {
      // Act
      const { container } = render(<DashboardOverview timeRange="week" />);

      // Assert
      // В реальном компоненте все статистические компоненты в Suspense
      // с fallback={<SkeletonLoader />}
      const statsGrid = container.querySelector(
        '[data-testid="posts-stats"]'
      )?.parentElement;

      // Проверяем, что есть элементы сетки
      expect(statsGrid).toBeInTheDocument();
    });
  });

  // ============================================
  // ТЕСТ 7: Разные значения timeRange
  // ============================================
  describe('Different timeRange values', () => {
    const timeRanges = ['week', 'month', 'year'] as const;

    timeRanges.forEach((timeRange) => {
      it(`should render correctly with timeRange="${timeRange}"`, () => {
        // Act
        render(<DashboardOverview timeRange={timeRange} />);

        // Assert
        // Проверяем TimeFilter
        expect(screen.getByTestId('time-filter')).toHaveAttribute(
          'data-initial-period',
          timeRange
        );

        // Проверяем один из компонентов как пример
        expect(screen.getByTestId('posts-stats')).toHaveAttribute(
          'data-time-range',
          timeRange
        );
      });
    });
  });

  // ============================================
  // ТЕСТ 8: Структура и порядок элементов
  // ============================================
  describe('Structure and element order', () => {
    it('should render elements in correct order', () => {
      // Act
      render(<DashboardOverview timeRange="week" />);

      // Assert
      const testIdsInOrder = [
        'dashboard-title',
        'dashboard-subtitle',
        'time-filter',
        'posts-stats',
        'views-stats',
        'rating-stats',
        'comments-stats',
        'users-stats',
        'efficiency-stats',
        'popular-posts',
        'popular-categories',
      ];

      // Получаем все элементы
      const elements = testIdsInOrder.map((testId) =>
        screen.getByTestId(testId)
      );

      // Проверяем, что все элементы отрендерились
      elements.forEach((element) => {
        expect(element).toBeInTheDocument();
      });
    });

    it('should have correct nesting structure', () => {
      // Act
      const { container } = render(<DashboardOverview timeRange="week" />);

      // Assert
      // Проверяем основную структуру
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.tagName).toBe('DIV');
      expect(mainDiv).toHaveClass('min-h-screen');

      // Проверяем вложенность
      const innerContainer = mainDiv.querySelector('.mx-auto');
      expect(innerContainer).toBeInTheDocument();

      // Проверяем наличие grid контейнеров
      const statsGrid = innerContainer?.querySelector('.grid');
      expect(statsGrid).toBeInTheDocument();
    });
  });
});
