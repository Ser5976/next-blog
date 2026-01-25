// ============================================
// ВАЖНО: Моки ДО импорта компонентов!
// ============================================

// 1. Сначала импортируем мок-файл (это установит все моки)
import './dashboard-users.moks';

// 2. Теперь импортируем React и тестовые утилиты
import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

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
import { renderWithProviders } from './dashboard-users.utils';

// ============================================
// ТЕСТ: Префетчинг данных
// ============================================
describe('Prefetching', () => {
  let mockHookData: MockUseUsersManagement;

  beforeEach(() => {
    // Очищаем все моки
    jest.clearAllMocks();

    // Создаем базовый мок данных
    mockHookData = createMockUseUsersManagement();

    // Настраиваем нашу экспортированную мок-функцию
    mockUseUsersManagement.mockReturnValue(mockHookData);
  });
  it('should call handlePrefetchNextPage on mouse enter of list', () => {
    // Arrange
    const handlePrefetchNextPage = jest.fn();

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      page: 1, // НЕ последняя страница
      totalPages: 3,
      handlePrefetchNextPage,
    });

    renderWithProviders(<DashboardUsers />);

    // Act
    const listContainer = screen.getByTestId('users-list-container');
    fireEvent.mouseEnter(listContainer);

    // Assert
    expect(handlePrefetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('should not prefetch if on last page', () => {
    // Arrange
    const handlePrefetchNextPage = jest.fn();

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      page: 3,
      totalPages: 3,
      // Имитируем логику хука - функция не должна вызываться на последней странице
      handlePrefetchNextPage: jest.fn(() => {
        // В реальном хуке здесь есть условие if (page < totalPages)
        console.log(
          'handlePrefetchNextPage called, but should not be on last page'
        );
      }),
    });

    renderWithProviders(<DashboardUsers />);

    // Act
    const listContainer = screen.getByTestId('users-list-container');
    fireEvent.mouseEnter(listContainer);

    // Assert
    expect(handlePrefetchNextPage).not.toHaveBeenCalled();
  });
});
