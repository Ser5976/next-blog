import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

import { getPopularCategories } from '@/features/popular-categories/api';
import { PopularCategories } from '../popular-categories';

// Мокаем API функцию
jest.mock('@/features/popular-categories/api', () => ({
  getPopularCategories: jest.fn(),
}));

// Мокаем компоненты из @/shared/ui/card
jest.mock('@/shared/ui/card', () => ({
  Card: ({ children }: { children: ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),

  CardHeader: ({ children }: { children: ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),

  CardTitle: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <h2 data-testid="card-title" className={className}>
      {children}
    </h2>
  ),

  CardDescription: ({
    children,
  }: {
    children: ReactNode;
    className?: string;
  }) => <p data-testid="card-description">{children}</p>,

  CardContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
}));

// Мокаем ErrorMessage из stat-card
jest.mock('@/entities/stat-card', () => ({
  ErrorMessage: ({ message }: { message: string }) => (
    <div data-testid="error-message">Error: {message}</div>
  ),
}));

// Мокаем иконку TrendingUp из lucide-react
jest.mock('lucide-react', () => ({
  TrendingUp: ({
    className,
    'aria-hidden': ariaHidden,
  }: {
    className?: string;
    'aria-hidden'?: boolean;
  }) => (
    <svg
      data-testid="icon-trending-up"
      className={className}
      aria-hidden={ariaHidden}
    >
      TrendingUp Icon
    </svg>
  ),
}));

const mockGetPopularCategories = getPopularCategories as jest.Mock;

describe('PopularCategories', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render popular categories list on successful fetch', async () => {
    // Arrange
    const mockCategories = [
      {
        name: 'Technology',
        postCount: 25,
        viewsPercentage: 45,
        totalViews: 45000,
      },
      {
        name: 'Design',
        postCount: 18,
        viewsPercentage: 30,
        totalViews: 30000,
      },
      {
        name: 'Business',
        postCount: 12,
        viewsPercentage: 25,
        totalViews: 25000,
      },
    ];

    mockGetPopularCategories.mockResolvedValue(mockCategories);

    // Act
    const jsx = await PopularCategories({ timeRange: 'week' });
    render(jsx);

    // Assert
    // Проверяем заголовки
    expect(screen.getByTestId('card-title')).toHaveTextContent(
      'Popular categories'
    );
    expect(screen.getByTestId('card-description')).toHaveTextContent(
      'Distribution by topics'
    );

    // Проверяем иконку
    expect(screen.getByTestId('icon-trending-up')).toBeInTheDocument();

    // Проверяем категории
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();

    // Проверяем количество статей (используем regex для игнорирования пробелов)
    expect(screen.getByText(/25\s*articles/)).toBeInTheDocument();
    expect(screen.getByText(/18\s*articles/)).toBeInTheDocument();
    expect(screen.getByText(/12\s*articles/)).toBeInTheDocument();

    // Проверяем проценты (игнорируем пробелы)
    expect(screen.getByText(/45\s*%/)).toBeInTheDocument();
    expect(screen.getByText(/30\s*%/)).toBeInTheDocument();
    expect(screen.getByText(/25\s*%/)).toBeInTheDocument();

    // Проверяем количество просмотров (используем regex для разных форматов)
    // Компонент отображает "45 000 views" вместо "45,000 views"
    expect(screen.getByText(/45[,\s]?000\s*views/)).toBeInTheDocument();
    expect(screen.getByText(/30[,\s]?000\s*views/)).toBeInTheDocument();
    expect(screen.getByText(/25[,\s]?000\s*views/)).toBeInTheDocument();

    // Проверяем доступность
    expect(screen.getByRole('list')).toHaveAttribute(
      'aria-label',
      'Popular categories statistics'
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveAttribute('aria-label', 'Category: Technology');
    expect(listItems[0]).toHaveAttribute('aria-posinset', '1');
    expect(listItems[0]).toHaveAttribute('aria-setsize', '3');

    // Проверяем прогресс-бары
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(3);
    expect(progressBars[0]).toHaveAttribute('aria-valuenow', '45');
    expect(progressBars[0]).toHaveAttribute('aria-valuemin', '0');
    expect(progressBars[0]).toHaveAttribute('aria-valuemax', '100');
    expect(progressBars[0]).toHaveAttribute(
      'aria-label',
      'Views percentage for Technology'
    );
  });

  it('should render ErrorMessage when categories are not available', async () => {
    // Arrange
    mockGetPopularCategories.mockResolvedValue(null);

    // Act
    const jsx = await PopularCategories({ timeRange: 'week' });
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
    mockGetPopularCategories.mockResolvedValue([]);

    // Act
    const jsx = await PopularCategories({ timeRange: 'month' });
    render(jsx);

    // Assert
    // Компонент должен отрендериться без ошибки
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent(
      'Popular categories'
    );

    // Но категорий не должно быть в DOM
    expect(
      screen.queryByText(/Technology|Design|Business/)
    ).not.toBeInTheDocument();

    // Список должен существовать
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should format large numbers correctly', async () => {
    // Arrange
    const mockCategories = [
      {
        name: 'Viral Category',
        postCount: 12345,
        viewsPercentage: 75,
        totalViews: 1234567,
      },
    ];

    mockGetPopularCategories.mockResolvedValue(mockCategories);

    // Act
    const jsx = await PopularCategories({ timeRange: 'year' });
    render(jsx);

    // Assert
    expect(screen.getByText('Viral Category')).toBeInTheDocument();

    // Используем regex для гибкого поиска чисел с пробелами или запятыми
    expect(screen.getByText(/12[,\s]?345\s*articles/)).toBeInTheDocument();
    expect(screen.getByText(/1[,\s]?234[,\s]?567\s*views/)).toBeInTheDocument();
    expect(screen.getByText(/75\s*%/)).toBeInTheDocument();
  });

  it('should handle different timeRange values', async () => {
    // Arrange
    const mockCategories = [
      {
        name: 'Test Category',
        postCount: 10,
        viewsPercentage: 50,
        totalViews: 50000,
      },
    ];

    mockGetPopularCategories.mockResolvedValue(mockCategories);

    const timeRanges = ['week', 'month', 'year'] as const;

    // Act & Assert для каждого timeRange
    for (const timeRange of timeRanges) {
      const jsx = await PopularCategories({ timeRange });
      const { unmount } = render(jsx);

      // Проверяем, что компонент отрендерился
      expect(screen.getByTestId('card-title')).toHaveTextContent(
        'Popular categories'
      );

      // Проверяем, что API был вызван с правильным timeRange
      expect(mockGetPopularCategories).toHaveBeenCalledWith(timeRange);

      // Очищаем перед следующей итерацией
      unmount();
      jest.clearAllMocks();
    }
  });

  it('should render accessibility attributes correctly', async () => {
    // Arrange
    const mockCategories = [
      {
        name: 'Accessibility Category',
        postCount: 15,
        viewsPercentage: 60,
        totalViews: 60000,
      },
      {
        name: 'UI/UX',
        postCount: 12,
        viewsPercentage: 40,
        totalViews: 40000,
      },
    ];

    mockGetPopularCategories.mockResolvedValue(mockCategories);

    // Act
    const jsx = await PopularCategories({ timeRange: 'week' });
    render(jsx);

    // Assert
    // Проверяем aria-атрибуты для списка
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-label', 'Popular categories statistics');

    // Проверяем aria-атрибуты для элементов списка
    const listItems = screen.getAllByRole('listitem');

    expect(listItems[0]).toHaveAttribute(
      'aria-label',
      'Category: Accessibility Category'
    );
    expect(listItems[0]).toHaveAttribute('aria-posinset', '1');
    expect(listItems[0]).toHaveAttribute('aria-setsize', '2');

    expect(listItems[1]).toHaveAttribute('aria-label', 'Category: UI/UX');
    expect(listItems[1]).toHaveAttribute('aria-posinset', '2');
    expect(listItems[1]).toHaveAttribute('aria-setsize', '2');

    // Проверяем aria-атрибуты для прогресс-баров
    const progressBars = screen.getAllByRole('progressbar');

    expect(progressBars[0]).toHaveAttribute('aria-valuenow', '60');
    expect(progressBars[0]).toHaveAttribute('aria-valuemin', '0');
    expect(progressBars[0]).toHaveAttribute('aria-valuemax', '100');
    expect(progressBars[0]).toHaveAttribute(
      'aria-label',
      'Views percentage for Accessibility Category'
    );

    expect(progressBars[1]).toHaveAttribute('aria-valuenow', '40');
    expect(progressBars[1]).toHaveAttribute('aria-valuemin', '0');
    expect(progressBars[1]).toHaveAttribute('aria-valuemax', '100');
    expect(progressBars[1]).toHaveAttribute(
      'aria-label',
      'Views percentage for UI/UX'
    );
  });

  it('should handle API errors gracefully by returning null', async () => {
    // Arrange
    mockGetPopularCategories.mockResolvedValue(null);

    // Act
    const jsx = await PopularCategories({ timeRange: 'month' });
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
    expect(mockGetPopularCategories).toHaveBeenCalledWith('month');
  });

  it('should render progress bars with correct widths based on viewsPercentage', async () => {
    // Arrange
    const mockCategories = [
      {
        name: 'Low Views',
        postCount: 5,
        viewsPercentage: 10,
        totalViews: 1000,
      },
      {
        name: 'Medium Views',
        postCount: 10,
        viewsPercentage: 50,
        totalViews: 5000,
      },
      {
        name: 'High Views',
        postCount: 15,
        viewsPercentage: 90,
        totalViews: 9000,
      },
    ];

    mockGetPopularCategories.mockResolvedValue(mockCategories);

    // Act
    const jsx = await PopularCategories({ timeRange: 'week' });
    render(jsx);

    // Assert
    const progressBars = screen.getAllByRole('progressbar');

    // Проверяем значения для прогресс-баров
    expect(progressBars[0]).toHaveAttribute('aria-valuenow', '10');
    expect(progressBars[1]).toHaveAttribute('aria-valuenow', '50');
    expect(progressBars[2]).toHaveAttribute('aria-valuenow', '90');

    // Альтернативный способ проверки стилей
    // Находим все элементы прогресс-баров и проверяем их inline стили
    const progressBarsContainer = screen.getByTestId('card-content');
    const progressElements = progressBarsContainer.querySelectorAll(
      '[role="progressbar"] > div'
    );

    expect(progressElements).toHaveLength(3);

    // Проверяем inline стили
    expect(progressElements[0]).toHaveStyle('width: 10%');
    expect(progressElements[1]).toHaveStyle('width: 50%');
    expect(progressElements[2]).toHaveStyle('width: 90%');
  });
});
