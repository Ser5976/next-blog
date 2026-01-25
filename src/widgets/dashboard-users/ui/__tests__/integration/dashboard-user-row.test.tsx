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
// ТЕСТ: Интеграция с UserRow
// ============================================
describe('Integration with UserRow', () => {
  let mockHookData: MockUseUsersManagement;

  beforeEach(() => {
    // Очищаем все моки
    jest.clearAllMocks();

    // Создаем базовый мок данных
    mockHookData = createMockUseUsersManagement();

    // Настраиваем нашу экспортированную мок-функцию
    mockUseUsersManagement.mockReturnValue(mockHookData);
  });
  it('should pass correct props to UserRow components', () => {
    // Arrange
    const isUserUpdatingRole = jest
      .fn()
      .mockImplementation((userId: string) => userId === 'user-2');

    const isUserDeleting = jest
      .fn()
      .mockImplementation((userId: string) => userId === 'user-3');

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      isUserUpdatingRole,
      isUserDeleting,
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert
    // User 1 - обычный
    expect(screen.getByTestId('role-select-user-1')).not.toBeDisabled();
    expect(screen.getByTestId('delete-button-user-1')).not.toBeDisabled();

    // User 2 - обновляется роль
    expect(screen.getByTestId('role-select-user-2')).toBeDisabled();
    expect(
      screen.queryByTestId('loading-indicator-user-2')
    ).toBeInTheDocument();

    // User 3 - удаляется
    expect(screen.getByTestId('delete-button-user-3')).toBeDisabled();
    expect(
      screen.queryByTestId('loading-indicator-user-3')
    ).toBeInTheDocument();
  });

  it('should handle multiple UserRow interactions correctly', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleRoleChange = jest.fn();
    const handleDeleteClick = jest.fn();

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      handleRoleChange,
      handleDeleteClick,
    });

    renderWithProviders(<DashboardUsers />);

    // Act 1 - меняем роль первого пользователя
    const roleSelect1 = screen.getByTestId('role-select-user-1');
    await user.selectOptions(roleSelect1, 'author');

    // Act 2 - удаляем второго пользователя
    const deleteButton2 = screen.getByTestId('delete-button-user-2');
    await user.click(deleteButton2);

    // Assert
    expect(handleRoleChange).toHaveBeenCalledWith('user-1', 'author');
    expect(handleDeleteClick).toHaveBeenCalledWith(
      'user-2',
      'author@example.com'
    );
    expect(handleRoleChange).toHaveBeenCalledTimes(1);
    expect(handleDeleteClick).toHaveBeenCalledTimes(1);
  });
});
