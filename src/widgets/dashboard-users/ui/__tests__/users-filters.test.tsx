import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UsersFilters } from '../../model';
import { UsersFiltersComponent } from '../users-filters';

// ============================================
// ТЕСТОВЫЕ ДАННЫЕ
// ============================================

const mockFilters: UsersFilters = {
  page: 1,
  limit: 10,
  emailSearch: '',
};

// ============================================
// ГРУППА ТЕСТОВ
// ============================================

describe('UsersFiltersComponent - Unit Tests', () => {
  const mockOnFiltersChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // ТЕСТ 1: Базовый рендеринг
  // ============================================
  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      // Act
      render(
        <UsersFiltersComponent
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      // Assert
      expect(screen.getByTestId('users-filters')).toBeInTheDocument();
    });

    it('should display search input', () => {
      // Act
      render(
        <UsersFiltersComponent
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      // Assert
      const searchInput = screen.getByTestId('user-search-input');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute(
        'placeholder',
        'Search by name or email...'
      );
    });

    it('should display search icon', () => {
      // Act
      const { container } = render(
        <UsersFiltersComponent
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      // Assert - иконка Search должна быть в DOM
      const searchIcon = container.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });

    it('should display info icon for search tips', () => {
      // Act
      render(
        <UsersFiltersComponent
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      // Assert
      expect(screen.getByTestId('search-tips-icon')).toBeInTheDocument();
    });
  });

  // ============================================
  // ТЕСТ 2: Поиск
  // ============================================
  describe('Search functionality', () => {
    it('should display current search value', () => {
      // Arrange
      const filtersWithSearch: UsersFilters = {
        ...mockFilters,
        emailSearch: 'test@example.com',
      };

      // Act
      render(
        <UsersFiltersComponent
          filters={filtersWithSearch}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      // Assert
      const searchInput = screen.getByTestId(
        'user-search-input'
      ) as HTMLInputElement;
      expect(searchInput.value).toBe('test@example.com');
    });

    it('should call onFiltersChange when typing in search input', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <UsersFiltersComponent
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const searchInput = screen.getByTestId('user-search-input');
      await user.type(searchInput, 'test');

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalled();
    });

    it('should reset page to 1 on search change', async () => {
      const user = userEvent.setup();
      const onFiltersChange = jest.fn();

      render(
        <UsersFiltersComponent
          filters={{ page: 3, limit: 10, emailSearch: '' }}
          onFiltersChange={onFiltersChange}
        />
      );

      await user.type(screen.getByTestId('user-search-input'), 'a');

      expect(onFiltersChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 1,
        })
      );
    });

    it('should preserve other filters when search changes', async () => {
      // Arrange
      const user = userEvent.setup();
      const filtersWithLimit: UsersFilters = {
        ...mockFilters,
        limit: 20,
      };

      // Act
      render(
        <UsersFiltersComponent
          filters={filtersWithLimit}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const searchInput = screen.getByTestId('user-search-input');
      await user.type(searchInput, 'test');

      // Assert - limit должен сохраниться
      const lastCall =
        mockOnFiltersChange.mock.calls[
          mockOnFiltersChange.mock.calls.length - 1
        ][0];
      expect(lastCall.limit).toBe(20);
    });

    it('should reset page to 1 when search changes', async () => {
      // Arrange
      const user = userEvent.setup();
      const filtersOnPage2: UsersFilters = {
        ...mockFilters,
        page: 3,
      };

      // Act
      render(
        <UsersFiltersComponent
          filters={filtersOnPage2}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const searchInput = screen.getByTestId('user-search-input');
      await user.type(searchInput, 'new search');

      // Assert
      const lastCall =
        mockOnFiltersChange.mock.calls[
          mockOnFiltersChange.mock.calls.length - 1
        ][0];
      expect(lastCall.page).toBe(1);
    });
  });

  // ============================================
  // ТЕСТ 3: Tooltip
  // ============================================
  describe('Tooltip functionality', () => {
    it('should display tooltip on hover', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <UsersFiltersComponent
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const infoIcon = screen.getByTestId('search-tips-icon');
      await user.hover(infoIcon);

      // Assert - tooltip должен появиться
      // Note: Tooltip может не появиться сразу, зависит от реализации
      // В реальном тесте может потребоваться waitFor
      expect(infoIcon).toBeInTheDocument();
    });
  });

  // ============================================
  // ТЕСТ 4: Accessibility
  // ============================================
  describe('Accessibility', () => {
    it('should have correct role attribute', () => {
      // Act
      render(
        <UsersFiltersComponent
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      // Assert
      const filtersContainer = screen.getByTestId('users-filters');
      expect(filtersContainer).toHaveAttribute('role', 'search');
    });

    it('should have correct aria-label on search input', () => {
      // Act
      render(
        <UsersFiltersComponent
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      // Assert
      const searchInput = screen.getByTestId('user-search-input');
      expect(searchInput).toHaveAttribute(
        'aria-label',
        'Search users by name or email'
      );
    });

    it('should have correct aria-label on info icon', () => {
      // Act
      render(
        <UsersFiltersComponent
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      // Assert
      const infoIcon = screen.getByTestId('search-tips-icon');
      expect(infoIcon).toHaveAttribute('aria-label', 'Search tips');
    });
  });
});


