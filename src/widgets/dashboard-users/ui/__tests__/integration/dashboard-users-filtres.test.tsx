// ============================================
// ВАЖНО: Моки ДО импорта компонентов!
// ============================================

// 1. Сначала импортируем мок-файл (это установит все моки)
import './dashboard-users.moks';

// 2. Теперь импортируем React и тестовые утилиты
import React from 'react';
import { screen } from '@testing-library/react';
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
import { renderWithProviders } from './dashboard-users.utils';

// ============================================
// ТЕСТ: Взаимодействие с фильтрами
// ============================================
describe('Filters Interaction', () => {
  let mockHookData: MockUseUsersManagement;

  beforeEach(() => {
    // Очищаем все моки
    jest.clearAllMocks();

    // Создаем базовый мок данных
    mockHookData = createMockUseUsersManagement();

    // Настраиваем нашу экспортированную мок-функцию
    mockUseUsersManagement.mockReturnValue(mockHookData);
  });
  it('should call handleFiltersChange when searching', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleFiltersChange = jest.fn();

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      handleFiltersChange,
    });

    renderWithProviders(<DashboardUsers />);

    // Act
    const searchInput = screen.getByTestId('user-search-input');
    await user.type(searchInput, 'a');

    // Assert - просто проверяем, что функция вызывалась
    expect(handleFiltersChange).toHaveBeenCalled();

    // ИЛИ проверяем параметры первого вызова
    expect(handleFiltersChange).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        emailSearch: 'a',
        page: 1,
      })
    );
  });
});
