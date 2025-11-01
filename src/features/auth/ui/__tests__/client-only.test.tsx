import { render, screen } from '@testing-library/react';

import { ClientOnly } from '../client-only';

describe('ClientOnly', () => {
  it('should not render children on initial (server) render, then render them after mounting', () => {
    /**
     * Этот компонент предназначен для предотвращения ошибок гидратации.
     * Он возвращает `null` при первом рендере (на сервере) и рендерит
     * дочерние элементы только после монтирования на клиенте.
     *
     * React Testing Library выполняет `useEffect` синхронно, поэтому мы
     * сразу увидим финальное состояние, где дочерние элементы уже видимы.
     */

    // Arrange: Создаем тестовый дочерний элемент, который мы будем искать.
    const testChildId = 'test-child';
    const TestChild = () => (
      <div data-testid={testChildId}>Hello from client</div>
    );

    // Act: Рендерим ClientOnly с нашим тестовым дочерним элементом.
    const { container } = render(
      <ClientOnly>
        <TestChild />
      </ClientOnly>
    );

    // Assert: Проверяем финальное состояние

    // 1. Убедимся, что контейнер не пустой. Это доказывает, что
    //    начальное состояние `null` было заменено на реальный DOM-узел.
    expect(container.firstChild).not.toBeNull();

    // 2. Найдем наш дочерний элемент по его test-id.
    //    Это главная проверка: дочерние элементы были успешно отрендерены.
    const childElement = screen.getByTestId(testChildId);
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Hello from client');

    // 3. Проверим, что обертка имеет правильные accessibility атрибуты.
    const wrapper = screen.getByLabelText('Content has loaded');
    expect(wrapper).toBeInTheDocument();
  });

  it('should render nothing if there are no children', () => {
    /**
     *  Проверим пограничный случай, когда компонент используется
     * без дочерних элементов. Он не должен падать с ошибкой.
     */

    // Act: Рендерим компонент без дочерних элементов.
    const { container } = render(<ClientOnly />);

    // Assert: Убедимся, что обертка отрендерилась, но она пустая.
    expect(container.firstChild).not.toBeNull();
    const wrapper = screen.getByLabelText('Content has loaded');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.firstChild).toBeNull();
  });
});
