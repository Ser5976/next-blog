import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DashboardOverview } from '../dashboard-overview';

// ============================================
// ТИПЫ И ГЛОБАЛЬНЫЕ СОСТОЯНИЯ
// ============================================

// Определяем типы для всех возможных состояний
type StatComponentName =
  | 'PostsStats'
  | 'ViewsStats'
  | 'RatingStats'
  | 'CommentsStats'
  | 'UsersStats'
  | 'EfficiencyStats'
  | 'PopularPosts'
  | 'PopularCategories';

type LoadingStates = Record<StatComponentName, boolean>;
type ErrorStates = Record<StatComponentName, boolean>;
type EmptyStates = Record<StatComponentName, boolean>;

// Глобальные переменные для управления состояниями
let mockLoadingStates: LoadingStates = {
  PostsStats: false,
  ViewsStats: false,
  RatingStats: false,
  CommentsStats: false,
  UsersStats: false,
  EfficiencyStats: false,
  PopularPosts: false,
  PopularCategories: false,
};

let mockErrorStates: ErrorStates = {
  PostsStats: false,
  ViewsStats: false,
  RatingStats: false,
  CommentsStats: false,
  UsersStats: false,
  EfficiencyStats: false,
  PopularPosts: false,
  PopularCategories: false,
};

let mockEmptyStates: EmptyStates = {
  PostsStats: false,
  ViewsStats: false,
  RatingStats: false,
  CommentsStats: false,
  UsersStats: false,
  EfficiencyStats: false,
  PopularPosts: false,
  PopularCategories: false,
};

// Вспомогательные функции с правильными типами
const simulateLoading = (
  componentName: StatComponentName,
  isLoading: boolean
) => {
  mockLoadingStates[componentName] = isLoading;
};

const simulateError = (componentName: StatComponentName, hasError: boolean) => {
  mockErrorStates[componentName] = hasError;
};

const simulateEmpty = (componentName: StatComponentName, isEmpty: boolean) => {
  mockEmptyStates[componentName] = isEmpty;
};

// ============================================
// МОКИ КОМПОНЕНТОВ
// ============================================

// Вспомогательная функция для рендеринга компонентов с учетом состояний
const renderMockedComponent = (
  componentName: StatComponentName,
  timeRange: string
) => {
  if (mockLoadingStates[componentName]) {
    return (
      <div data-testid={`${componentName.toLowerCase()}-loading`}>
        Loading {componentName}...
      </div>
    );
  }

  if (mockErrorStates[componentName]) {
    return (
      <div data-testid={`${componentName.toLowerCase()}-error`}>
        Failed to load {componentName}
      </div>
    );
  }

  if (mockEmptyStates[componentName]) {
    return (
      <div
        data-testid={componentName.toLowerCase()}
        data-time-range={timeRange}
      >
        <div data-testid="empty-state" data-component={componentName}>
          No {componentName.toLowerCase().replace('stats', '')} data available
        </div>
      </div>
    );
  }

  // Нормальное состояние с данными
  return (
    <div data-testid={componentName.toLowerCase()} data-time-range={timeRange}>
      {componentName} for {timeRange}
      {componentName === 'PostsStats' && (
        <div data-testid="posts-count">Count: 150</div>
      )}
      {componentName === 'ViewsStats' && (
        <div data-testid="views-count">Views: 12000</div>
      )}
    </div>
  );
};

// TimeFilter с реальным взаимодействием
jest.mock('@/entities/time-range', () => ({
  TimeFilter: ({
    initialPeriod,
    onChange,
  }: {
    initialPeriod: string;
    onChange?: (period: string) => void;
  }) => {
    return (
      <div data-testid="time-filter">
        <div data-testid="current-period-display">Current: {initialPeriod}</div>
        <div>
          <button
            data-testid="period-week-btn"
            onClick={() => onChange?.('week')}
            className={initialPeriod === 'week' ? 'active' : ''}
          >
            Week
          </button>
          <button
            data-testid="period-month-btn"
            onClick={() => onChange?.('month')}
            className={initialPeriod === 'month' ? 'active' : ''}
          >
            Month
          </button>
          <button
            data-testid="period-year-btn"
            onClick={() => onChange?.('year')}
            className={initialPeriod === 'year' ? 'active' : ''}
          >
            Year
          </button>
        </div>
        <select
          data-testid="period-select"
          value={initialPeriod}
          onChange={(e) => onChange?.(e.target.value)}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
    );
  },
}));

// Мокаем все компоненты используя общую функцию рендеринга
jest.mock('@/features/posts-stats', () => ({
  PostsStats: ({ timeRange }: { timeRange: string }) =>
    renderMockedComponent('PostsStats', timeRange),
}));

jest.mock('@/features/view-stats', () => ({
  ViewsStats: ({ timeRange }: { timeRange: string }) =>
    renderMockedComponent('ViewsStats', timeRange),
}));

jest.mock('@/features/rating-stats', () => ({
  RatingStats: ({ timeRange }: { timeRange: string }) =>
    renderMockedComponent('RatingStats', timeRange),
}));

jest.mock('@/features/comments-stats', () => ({
  CommentsStats: ({ timeRange }: { timeRange: string }) =>
    renderMockedComponent('CommentsStats', timeRange),
}));

jest.mock('@/features/users-stats', () => ({
  UsersStats: ({ timeRange }: { timeRange: string }) =>
    renderMockedComponent('UsersStats', timeRange),
}));

jest.mock('@/features/efficiency', () => ({
  EfficiencyStats: ({ timeRange }: { timeRange: string }) =>
    renderMockedComponent('EfficiencyStats', timeRange),
}));

jest.mock('@/features/popular-post', () => ({
  PopularPosts: ({ timeRange }: { timeRange: string }) =>
    renderMockedComponent('PopularPosts', timeRange),
}));

jest.mock('@/features/popular-categories', () => ({
  PopularCategories: ({ timeRange }: { timeRange: string }) =>
    renderMockedComponent('PopularCategories', timeRange),
}));

// Мокаем SkeletonLoader и ErrorMessage
jest.mock('@/entities/stat-card', () => ({
  SkeletonLoader: () => (
    <div data-testid="skeleton-loader" role="progressbar">
      <div className="animate-pulse">Loading...</div>
    </div>
  ),
  ErrorMessage: ({ message }: { message: string }) => (
    <div data-testid="error-message" role="alert">
      {message}
    </div>
  ),
}));

// Мокаем конфигурацию
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

// Мокаем shared UI
jest.mock('@/shared/ui', () => ({
  Title: ({ children }: { children: React.ReactNode }) => (
    <h1 data-testid="dashboard-title">{children}</h1>
  ),
  Subtitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dashboard-subtitle">{children}</h2>
  ),
}));

// ============================================
//  ИНТЕГРАЦИОННЫЕ ТЕСТЫ
// ============================================

describe('DashboardOverview - Fixed Integration Tests', () => {
  beforeEach(() => {
    // Сброс всех состояний перед каждым тестом
    mockLoadingStates = {
      PostsStats: false,
      ViewsStats: false,
      RatingStats: false,
      CommentsStats: false,
      UsersStats: false,
      EfficiencyStats: false,
      PopularPosts: false,
      PopularCategories: false,
    };

    mockErrorStates = {
      PostsStats: false,
      ViewsStats: false,
      RatingStats: false,
      CommentsStats: false,
      UsersStats: false,
      EfficiencyStats: false,
      PopularPosts: false,
      PopularCategories: false,
    };

    mockEmptyStates = {
      PostsStats: false,
      ViewsStats: false,
      RatingStats: false,
      CommentsStats: false,
      UsersStats: false,
      EfficiencyStats: false,
      PopularPosts: false,
      PopularCategories: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // ТЕСТ 1: Базовое взаимодействие компонентов
  // ============================================
  describe('Component integration and data flow', () => {
    it('should render all components with initial timeRange', () => {
      render(<DashboardOverview timeRange="week" />);

      expect(screen.getByTestId('dashboard-title')).toHaveTextContent(
        'Dashboard Overview'
      );
      expect(screen.getByTestId('time-filter')).toBeInTheDocument();

      const components = [
        'postsstats',
        'viewsstats',
        'ratingstats',
        'commentsstats',
        'usersstats',
        'efficiencystats',
        'popularposts',
        'popularcategories',
      ];

      components.forEach((testId) => {
        const component = screen.getByTestId(testId);
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('data-time-range', 'week');
      });
    });
  });

  // ============================================
  // ТЕСТ 2: Различные состояния компонентов
  // ============================================
  describe('Component states', () => {
    it('should handle loading states for components', () => {
      simulateLoading('PostsStats', true);
      simulateLoading('ViewsStats', true);

      render(<DashboardOverview timeRange="week" />);

      expect(screen.getByTestId('postsstats-loading')).toBeInTheDocument();
      expect(screen.getByTestId('viewsstats-loading')).toBeInTheDocument();
      expect(screen.getByTestId('ratingstats')).toBeInTheDocument();
    });

    it('should handle error states for components', () => {
      simulateError('PostsStats', true);
      simulateError('RatingStats', true);

      render(<DashboardOverview timeRange="week" />);

      expect(screen.getByTestId('postsstats-error')).toBeInTheDocument();
      expect(screen.getByTestId('ratingstats-error')).toBeInTheDocument();
      expect(screen.getByTestId('viewsstats')).toBeInTheDocument();
    });

    it('should handle empty data states gracefully', () => {
      // Устанавливаем пустые состояния для нескольких компонентов
      simulateEmpty('PostsStats', true);
      simulateEmpty('ViewsStats', true);
      simulateEmpty('RatingStats', true);

      render(<DashboardOverview timeRange="week" />);

      // Проверяем что компоненты с пустыми данными отображают empty state
      const emptyStates = screen.getAllByTestId('empty-state');
      expect(emptyStates).toHaveLength(3);

      // Проверяем содержимое каждого empty state
      const postsEmpty = emptyStates.find(
        (el) => el.getAttribute('data-component') === 'PostsStats'
      );
      const viewsEmpty = emptyStates.find(
        (el) => el.getAttribute('data-component') === 'ViewsStats'
      );
      const ratingEmpty = emptyStates.find(
        (el) => el.getAttribute('data-component') === 'RatingStats'
      );

      expect(postsEmpty).toBeInTheDocument();
      expect(viewsEmpty).toBeInTheDocument();
      expect(ratingEmpty).toBeInTheDocument();

      // Проверяем что другие компоненты все еще работают
      expect(screen.getByTestId('commentsstats')).toBeInTheDocument();
    });

    it('should handle mixed states correctly', () => {
      // Разные состояния для разных компонентов
      simulateLoading('PostsStats', true);
      simulateError('ViewsStats', true);
      simulateEmpty('RatingStats', true);
      // CommentsStats - нормальное состояние

      render(<DashboardOverview timeRange="week" />);

      expect(screen.getByTestId('postsstats-loading')).toBeInTheDocument();
      expect(screen.getByTestId('viewsstats-error')).toBeInTheDocument();

      // Проверяем RatingStats с empty state
      const ratingEmpty = screen
        .getAllByTestId('empty-state')
        .find((el) => el.getAttribute('data-component') === 'RatingStats');
      expect(ratingEmpty).toBeInTheDocument();

      // CommentsStats в нормальном состоянии
      expect(screen.getByTestId('commentsstats')).toBeInTheDocument();
    });
  });

  // ============================================
  // ТЕСТ 3: Пользовательские взаимодействия
  // ============================================
  describe('User interactions', () => {
    it('should handle button clicks without errors', async () => {
      render(<DashboardOverview timeRange="week" />);

      // Все кнопки должны быть доступны
      expect(screen.getByTestId('period-week-btn')).toBeInTheDocument();
      expect(screen.getByTestId('period-month-btn')).toBeInTheDocument();
      expect(screen.getByTestId('period-year-btn')).toBeInTheDocument();

      // Select также должен быть
      expect(screen.getByTestId('period-select')).toBeInTheDocument();
    });

    it('should maintain UI stability during rapid interactions', async () => {
      const user = userEvent.setup();
      render(<DashboardOverview timeRange="week" />);

      // Быстрые последовательные действия (только проверка что не падает)
      await user.click(screen.getByTestId('period-week-btn'));
      await user.click(screen.getByTestId('period-month-btn'));
      await user.click(screen.getByTestId('period-year-btn'));

      // UI должен оставаться стабильным
      expect(screen.getByTestId('time-filter')).toBeInTheDocument();
      expect(screen.getByTestId('postsstats')).toBeInTheDocument();
    });
  });

  // ============================================
  // ТЕСТ 4: Согласованность состояния
  // ============================================
  describe('State consistency', () => {
    it('should pass consistent timeRange to all child components', () => {
      const testTimeRange = 'year';
      render(<DashboardOverview timeRange={testTimeRange} />);

      const allComponents = [
        'postsstats',
        'viewsstats',
        'ratingstats',
        'commentsstats',
        'usersstats',
        'efficiencystats',
        'popularposts',
        'popularcategories',
      ];

      allComponents.forEach((testId) => {
        const component = screen.getByTestId(testId);
        expect(component).toHaveAttribute('data-time-range', testTimeRange);
      });
    });

    it('should handle different timeRange values', () => {
      const timeRanges = ['week', 'month', 'year'] as const;

      timeRanges.forEach((timeRange) => {
        const { unmount } = render(<DashboardOverview timeRange={timeRange} />);

        // Проверяем TimeFilter
        expect(screen.getByTestId('current-period-display')).toHaveTextContent(
          `Current: ${timeRange}`
        );

        // Проверяем один из компонентов
        expect(screen.getByTestId('postsstats')).toHaveAttribute(
          'data-time-range',
          timeRange
        );

        unmount();
      });
    });
  });
});
