// ============================================
// ВАЖНО: Моки ДО импорта компонентов!
// ============================================

// 1. Сначала импортируем мок-файл (это установит все моки)
import './dashboard-users.moks';

// 2. Теперь импортируем React и тестовые утилиты
import React from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

// 5. ТЕПЕРЬ импортируем компонент (после того как все моки установлены)
import { DashboardUsers } from '../../dashboard-users';
// 3. Импортируем наши мок-функции из мок-файла
import {
  createMockUseUsersManagement,
  mockUseUsersManagement, // ← ВАЖНО: импортируем экспортированную мок-функцию
  MockUseUsersManagement,
} from './dashboard-users.moks';
// 4. Импортируем утилиты
import {
  getPaginationButtons,
  renderWithProviders,
} from './dashboard-users.utils';

// ============================================
// ТЕСТ: Пагинация
// ============================================
describe('Pagination', () => {
  let mockHookData: MockUseUsersManagement;

  beforeEach(() => {
    // Очищаем все моки
    jest.clearAllMocks();

    // Создаем базовый мок данных
    mockHookData = createMockUseUsersManagement();

    // Настраиваем нашу экспортированную мок-функцию
    mockUseUsersManagement.mockReturnValue(mockHookData);
  });

  it('should call handlePageChange when navigating pages', async () => {
    // Arrange
    const user = userEvent.setup();
    const handlePageChange = jest.fn();

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      total: 25,
      totalPages: 3,
      handlePageChange,
    });

    renderWithProviders(<DashboardUsers />);

    // Act - используем нижнюю пагинацию для теста
    const { next } = getPaginationButtons('pagination-bottom'); // ← Исправлено: 1 аргумент
    await user.click(next); // ← Исправлено: используем 'next', а не 'nextButton'

    // Assert
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('should call handleItemsPerPageChange when changing page size', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleItemsPerPageChange = jest.fn();

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      handleItemsPerPageChange,
    });

    renderWithProviders(<DashboardUsers />);

    // Act
    const itemsPerPageSelect = screen.getAllByTestId(
      'items-per-page-select'
    )[0];
    await user.selectOptions(itemsPerPageSelect, '20');

    // Assert
    expect(handleItemsPerPageChange).toHaveBeenCalledWith(20);
  });

  it('should disable previous button on first page', () => {
    // Arrange
    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      page: 1,
      totalPages: 3,
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert - проверяем верхнюю пагинацию
    const { prev, next } = getPaginationButtons('pagination-top'); // ← Исправлено
    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();
  });

  it('should disable next button on last page', () => {
    // Arrange
    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      page: 3,
      totalPages: 3,
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert - проверяем нижнюю пагинацию
    const { prev, next } = getPaginationButtons('pagination-bottom');
    expect(prev).not.toBeDisabled();
    expect(next).toBeDisabled();
  });
  it('should render both top and bottom paginations', () => {
    // Arrange
    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      total: 25,
      totalPages: 3,
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert
    expect(screen.getByTestId('pagination-top')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-bottom')).toBeInTheDocument();
  });

  it('should sync both paginations', () => {
    // Arrange
    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      page: 2,
      totalPages: 3,
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert
    const topCurrentPage = within(
      screen.getByTestId('pagination-top')
    ).getByTestId('pagination-current-page');
    const bottomCurrentPage = within(
      screen.getByTestId('pagination-bottom')
    ).getByTestId('pagination-current-page');

    expect(topCurrentPage).toHaveTextContent('2');
    expect(bottomCurrentPage).toHaveTextContent('2');
  });
});
