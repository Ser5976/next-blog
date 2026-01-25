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
// ТЕСТ: Удаление пользователей
// ============================================
describe('User Deletion Flow', () => {
  let mockHookData: MockUseUsersManagement;

  beforeEach(() => {
    // Очищаем все моки
    jest.clearAllMocks();

    // Создаем базовый мок данных
    mockHookData = createMockUseUsersManagement();

    // Настраиваем нашу экспортированную мок-функцию
    mockUseUsersManagement.mockReturnValue(mockHookData);
  });
  it('should open delete dialog when delete button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleDeleteClick = jest.fn();

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      handleDeleteClick,
    });

    renderWithProviders(<DashboardUsers />);

    // Act
    const deleteButton = screen.getByTestId('delete-button-user-3');
    await user.click(deleteButton);

    // Assert
    expect(handleDeleteClick).toHaveBeenCalledWith(
      'user-3',
      'regular@example.com'
    );
  });

  it('should show delete dialog when deleteDialog.open is true', () => {
    // Arrange
    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      deleteDialog: {
        open: true,
        userId: 'user-3',
        userEmail: 'regular@example.com',
      },
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert
    expect(screen.getByTestId('delete-user-dialog')).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to delete regular@example.com\?/i)
    ).toBeInTheDocument();
  });

  it('should call handleConfirmDelete when confirming deletion', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleConfirmDelete = jest.fn();

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      deleteDialog: {
        open: true,
        userId: 'user-3',
        userEmail: 'regular@example.com',
      },
      handleConfirmDelete,
    });

    renderWithProviders(<DashboardUsers />);

    // Act
    const confirmButton = screen.getByTestId('confirm-delete-button');
    await user.click(confirmButton);

    // Assert
    expect(handleConfirmDelete).toHaveBeenCalled();
  });

  it('should call handleCancelDelete when cancelling deletion', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleCancelDelete = jest.fn();

    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      deleteDialog: {
        open: true,
        userId: 'user-3',
        userEmail: 'regular@example.com',
      },
      handleCancelDelete,
    });

    renderWithProviders(<DashboardUsers />);

    // Act
    const cancelButton = screen.getByTestId('cancel-delete-button');
    await user.click(cancelButton);

    // Assert
    expect(handleCancelDelete).toHaveBeenCalled();
  });

  it('should show loading state in delete dialog when mutation is pending', () => {
    // Arrange
    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      deleteDialog: {
        open: true,
        userId: 'user-3',
        userEmail: 'regular@example.com',
      },
      deleteUserMutation: {
        isPending: true,
        variables: 'user-3',
        mutate: jest.fn(),
      },
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert
    expect(screen.getByTestId('confirm-delete-button')).toBeDisabled();
    expect(screen.getByTestId('dialog-loading')).toBeInTheDocument();
  });
});
