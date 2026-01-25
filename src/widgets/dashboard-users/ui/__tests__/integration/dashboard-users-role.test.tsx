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
describe('Role Management', () => {
  let mockHookData: MockUseUsersManagement;

  beforeEach(() => {
    // Очищаем все моки
    jest.clearAllMocks();

    // Создаем базовый мок данных
    mockHookData = createMockUseUsersManagement();

    // Настраиваем нашу экспортированную мок-функцию
    mockUseUsersManagement.mockReturnValue(mockHookData);
  });
  it('should call handleRoleChange when role is changed', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleRoleChange = jest.fn();

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      handleRoleChange,
    });

    renderWithProviders(<DashboardUsers />);

    // Act
    const roleSelect = screen.getByTestId('role-select-user-3');
    await user.selectOptions(roleSelect, 'admin');

    // Assert
    expect(handleRoleChange).toHaveBeenCalledWith('user-3', 'admin');
  });

  it('should show loading state for specific user when updating role', () => {
    // Arrange
    const isUserUpdatingRole = jest
      .fn()
      .mockImplementation((userId: string) => userId === 'user-3');

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      isUserUpdatingRole,
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert
    const user3Select = screen.getByTestId('role-select-user-3');
    expect(user3Select).toBeDisabled();
    expect(screen.getByTestId('loading-indicator-user-3')).toBeInTheDocument();
  });
});
