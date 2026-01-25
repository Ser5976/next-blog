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
// ТЕСТ: Пустые состояния
// ============================================
describe('Empty States', () => {
  let mockHookData: MockUseUsersManagement;

  beforeEach(() => {
    // Очищаем все моки
    jest.clearAllMocks();

    // Создаем базовый мок данных
    mockHookData = createMockUseUsersManagement();

    // Настраиваем нашу экспортированную мок-функцию
    mockUseUsersManagement.mockReturnValue(mockHookData);
  });
  it('should show empty state when no users', () => {
    // Arrange
    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      users: [],
      total: 0,
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert
    expect(screen.getByTestId('users-empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('empty-title')).toHaveTextContent(/no users/i);
  });

  it('should show search query in empty state when searching', () => {
    // Arrange
    mockUseUsersManagement.mockReturnValue({
      ...mockHookData,
      users: [],
      total: 0,
      debouncedEmailSearch: 'nonexistent',
    });

    // Act
    renderWithProviders(<DashboardUsers />);

    // Assert
    expect(screen.getByTestId('users-empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('empty-search-query')).toHaveTextContent(
      'No results for nonexistent' // Убрал слеши
    );
  });
});
