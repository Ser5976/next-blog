// ============================================
// ВАЖНО: Моки ДО импорта компонентов!
// ============================================

// 1. Сначала импортируем мок-файл (это установит все моки)
import './dashboard-users.moks';

// 2. Теперь импортируем React и тестовые утилиты
import React from 'react';
import { screen } from '@testing-library/react';

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
// ТЕСТ: Отображение данных
// ============================================
describe('Data Display', () => {
  let mockHookData: MockUseUsersManagement;

  beforeEach(() => {
    // Очищаем все моки
    jest.clearAllMocks();

    // Создаем базовый мок данных
    mockHookData = createMockUseUsersManagement();

    // Настраиваем нашу экспортированную мок-функцию
    mockUseUsersManagement.mockReturnValue(mockHookData);
  });

  it('should display users list from hook data', () => {
    // Arrange
    renderWithProviders(<DashboardUsers />);

    // Assert
    expect(screen.getByText(/user management/i)).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('author@example.com')).toBeInTheDocument();
    expect(screen.getByText('regular@example.com')).toBeInTheDocument();

    // Проверяем что используются данные из хука
    expect(screen.getByTestId('users-count')).toHaveTextContent(
      '3 total users'
    );
  });

  it('should show loading state when isLoading is true', () => {
    // Arrange
    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      isLoading: true,
      users: [],
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert
    expect(screen.getByTestId('users-loading')).toBeInTheDocument();
    expect(screen.queryByText('admin@example.com')).not.toBeInTheDocument();
  });

  it('should show error state when isError is true', () => {
    // Arrange
    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      isError: true,
      error: new Error('Failed to load users'),
      users: [],
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert
    expect(screen.getByTestId('users-error-state')).toBeInTheDocument();
    expect(screen.getByTestId('error-title')).toHaveTextContent(
      /error loading users/i
    );
  });
});
