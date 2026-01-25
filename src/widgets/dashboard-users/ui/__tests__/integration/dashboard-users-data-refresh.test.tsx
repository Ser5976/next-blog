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
// ТЕСТ: Обновление данных
// ============================================
describe('Data Refresh', () => {
  let mockHookData: MockUseUsersManagement;

  beforeEach(() => {
    // Очищаем все моки
    jest.clearAllMocks();

    // Создаем базовый мок данных
    mockHookData = createMockUseUsersManagement();

    // Настраиваем нашу экспортированную мок-функцию
    mockUseUsersManagement.mockReturnValue(mockHookData);
  });
  it('should call handleRefresh when refresh button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleRefresh = jest.fn();

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      handleRefresh,
    });

    renderWithProviders(<DashboardUsers />);

    // Act
    const refreshButton = screen.getByTestId('refresh-users-button');
    await user.click(refreshButton);

    // Assert
    expect(handleRefresh).toHaveBeenCalled();
  });

  it('should disable refresh button while isFetching is true', () => {
    // Arrange
    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      isFetching: true,
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert
    expect(screen.getByTestId('refresh-users-button')).toBeDisabled();
  });
});
