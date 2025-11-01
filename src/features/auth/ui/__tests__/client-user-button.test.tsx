import { UserButton } from '@clerk/nextjs';
import { render, screen } from '@testing-library/react';

import ClientUserButton from '../client-user-button';

// Мокируем зависимость - компонент UserButton из Clerk
jest.mock('@clerk/nextjs', () => ({
  UserButton: jest.fn(() => <div data-testid="mock-user-button" />),
}));

const MockedUserButton = UserButton as unknown as jest.Mock;

describe('ClientUserButton', () => {
  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    MockedUserButton.mockClear();
  });

  it('should not render anything initially, then render UserButton after mounting', () => {
    /**
     * Компонент использует useEffect для отложенного рендеринга.
     * На сервере и при первой гидратации он возвращает null.
     * React Testing Library выполняет useEffect синхронно, поэтому мы сразу
     * видим финальное состояние.
     *
     * Мы проверим, что в контейнере что-то появилось (он не остался null)
     * и что это "что-то" - наш замокированный UserButton.
     */

    // Act: Рендерим компонент. `render` возвращает разные утилиты, включая `container`.
    const { container } = render(<ClientUserButton />);

    // Assert: Проверяем финальное состояние

    // 1. Убедимся, что компонент отрендерил не `null`, а реальный DOM-узел.
    // `container` - это div, в который происходит рендер.
    // Если компонент вернул `null`, `container.firstChild` будет `null`.
    expect(container.firstChild).not.toBeNull();

    // 2. Найдем наш замокированный UserButton по test-id.
    // Это подтверждает, что именно он был отрендерен после монтирования.
    const userButton = screen.getByTestId('mock-user-button');
    expect(userButton).toBeInTheDocument();

    // 3. Проверим, что mock-компонент UserButton был вызван ровно 1 раз.
    expect(MockedUserButton).toHaveBeenCalledTimes(1);

    // 4. Проверим наличие обертки с правильными accessibility атрибутами.
    const navigationWrapper = screen.getByRole('navigation');
    expect(navigationWrapper).toBeInTheDocument();
    expect(navigationWrapper).toHaveAttribute(
      'aria-label',
      'User account menu'
    );
  });
});
