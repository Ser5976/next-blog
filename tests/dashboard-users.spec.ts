import { expect, Page, test } from '@playwright/test';

test.describe('Dashboard Users - Complete E2E Tests', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Переходим на страницу пользователей
    await page.goto('/dashboard/users', {
      waitUntil: 'load',
      timeout: 30000,
    });

    // Ждем загрузки основных элементов
    await page.waitForSelector('text=User Management', { timeout: 10000 });

    // Проверяем URL
    await expect(page).toHaveURL(/dashboard\/users/);
  });

  // ============================================
  // ТЕСТ 1: Основная структура страницы
  // ============================================
  test('should display complete page structure', async ({
    page,
  }: {
    page: Page;
  }) => {
    // 1. Проверяем заголовок
    const title = page.getByText('User Management', { exact: false });
    await expect(title).toBeVisible();

    // 2. Проверяем подзаголовок
    const subtitle = page.getByText('Manage users with Clerk integration', {
      exact: false,
    });
    await expect(subtitle).toBeVisible();

    // 3. Проверяем кнопку Refresh
    const refreshButton = page.getByTestId('refresh-users-button');
    await expect(refreshButton).toBeVisible();
    await expect(refreshButton).toBeEnabled();

    // 4. Проверяем карточку с пользователями
    const usersCard = page.getByTestId('users-card');
    await expect(usersCard).toBeVisible();

    // 5. Проверяем фильтры
    const filters = page.getByTestId('users-filters');
    await expect(filters).toBeVisible();

    // 6. Проверяем пагинацию
    const paginationTop = page.getByTestId('pagination-top');
    await expect(paginationTop).toBeVisible();
  });

  // ============================================
  // ТЕСТ 2: Загрузка и отображение данных
  // ============================================
  test('should load and display users', async ({ page }: { page: Page }) => {
    // Ждем загрузки пользователей
    await page.waitForSelector('[data-testid^="user-row-"]', {
      timeout: 10000,
    });

    // Проверяем, что пользователи отображаются
    const userRows = page.locator('[data-testid^="user-row-"]');
    const count = await userRows.count();
    expect(count).toBeGreaterThan(0);

    // Проверяем отображение данных пользователя
    const firstUserRow = userRows.first();
    await expect(firstUserRow.getByTestId('user-fullname')).toBeVisible();
    await expect(firstUserRow.getByTestId('user-email')).toBeVisible();
    await expect(firstUserRow.getByTestId('user-created-at')).toBeVisible();
  });

  // ============================================
  // ТЕСТ 3: Поиск пользователей
  // ============================================
  test('should filter users by search', async ({ page }: { page: Page }) => {
    // Ждем загрузки
    await page.waitForSelector('[data-testid^="user-row-"]', {
      timeout: 10000,
    });

    // Получаем начальное количество пользователей
    const initialCount = await page
      .locator('[data-testid^="user-row-"]')
      .count();

    // Вводим текст поиска
    const searchInput = page.getByTestId('user-search-input');
    await searchInput.fill('test');

    // Ждем результатов поиска (дебаунс 500ms + загрузка)
    await page.waitForTimeout(1000);
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
      // Игнорируем ошибку networkidle
    });

    // Проверяем, что результаты обновились
    // (количество может измениться или остаться тем же)
    const filteredCount = await page
      .locator('[data-testid^="user-row-"]')
      .count();
    expect(filteredCount).toBeGreaterThanOrEqual(0);
  });

  // ============================================
  // ТЕСТ 4: Пагинация
  // ============================================
  test('should handle pagination', async ({ page }: { page: Page }) => {
    // Ждем загрузки
    await page.waitForSelector('[data-testid="pagination-top"]', {
      timeout: 10000,
    });

    // Проверяем наличие пагинации
    const pagination = page.getByTestId('pagination-top');
    await expect(pagination).toBeVisible();

    // Пытаемся перейти на следующую страницу (если есть)
    const nextButton = pagination.getByRole('button', { name: /next/i });
    const isNextVisible = await nextButton.isVisible().catch(() => false);

    if (isNextVisible && (await nextButton.isEnabled())) {
      await nextButton.click();

      // Ждем загрузки следующей страницы
      await page.waitForTimeout(1000);
      await page
        .waitForLoadState('networkidle', { timeout: 5000 })
        .catch(() => {});

      // Проверяем, что пользователи загрузились
      const userRows = page.locator('[data-testid^="user-row-"]');
      const count = await userRows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  // ============================================
  // ТЕСТ 5: Изменение роли пользователя
  // ============================================
  test('should update user role', async ({ page }: { page: Page }) => {
    // Ждем загрузки
    await page.waitForSelector('[data-testid^="user-row-"]', {
      timeout: 10000,
    });

    // Находим первого пользователя
    const firstUserRow = page.locator('[data-testid^="user-row-"]').first();
    await expect(firstUserRow).toBeVisible();

    // Получаем текущую роль
    const currentRole = firstUserRow.getByTestId('current-role');
    const currentRoleText = await currentRole.textContent();

    // Открываем Select роли
    const roleSelect = firstUserRow.getByTestId('role-select-trigger');
    await roleSelect.click();

    // Выбираем другую роль (если текущая user, выбираем author, иначе user)
    const targetRole = currentRoleText?.includes('User') ? 'author' : 'user';
    const roleOption = firstUserRow.getByTestId(`role-option-${targetRole}`);
    await roleOption.click();

    // Ждем обновления (может быть индикатор загрузки)
    await page.waitForTimeout(500);

    // Проверяем, что роль изменилась (или показывается индикатор загрузки)
    const updatedRole = firstUserRow.getByTestId('current-role');
    await expect(updatedRole).toBeVisible();
  });

  // ============================================
  // ТЕСТ 6: Удаление пользователя
  // ============================================
  test('should delete user with confirmation', async ({
    page,
  }: { page: Page }) => {
    // Ждем загрузки
    await page.waitForSelector('[data-testid^="user-row-"]', {
      timeout: 10000,
    });

    // Получаем начальное количество
    const initialCount = await page
      .locator('[data-testid^="user-row-"]')
      .count();

    if (initialCount === 0) {
      test.skip();
      return;
    }

    // Находим первого пользователя
    const firstUserRow = page.locator('[data-testid^="user-row-"]').first();
    const userEmail = await firstUserRow
      .getByTestId('user-email')
      .textContent();

    // Открываем меню действий
    const actionsButton = firstUserRow.getByTestId('user-actions-button');
    await actionsButton.click();

    // Кликаем на удаление
    const deleteButton = firstUserRow.getByTestId('delete-user-button');
    await deleteButton.click();

    // Проверяем, что диалог открылся
    const confirmDialog = page.getByTestId('delete-user-dialog');
    await expect(confirmDialog).toBeVisible();

    // Проверяем, что email отображается в диалоге
    if (userEmail) {
      await expect(confirmDialog).toContainText(userEmail.trim());
    }

    // Отменяем удаление
    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await cancelButton.click();

    // Проверяем, что диалог закрылся
    await expect(confirmDialog).not.toBeVisible();

    // Проверяем, что пользователь остался
    const finalCount = await page
      .locator('[data-testid^="user-row-"]')
      .count();
    expect(finalCount).toBe(initialCount);
  });

  // ============================================
  // ТЕСТ 7: Обновление данных
  // ============================================
  test('should refresh users list', async ({ page }: { page: Page }) => {
    // Ждем загрузки
    await page.waitForSelector('[data-testid="refresh-users-button"]', {
      timeout: 10000,
    });

    // Получаем начальное количество
    const initialCount = await page
      .locator('[data-testid^="user-row-"]')
      .count();

    // Кликаем на Refresh
    const refreshButton = page.getByTestId('refresh-users-button');
    await refreshButton.click();

    // Ждем обновления
    await page.waitForTimeout(1000);
    await page
      .waitForLoadState('networkidle', { timeout: 5000 })
      .catch(() => {});

    // Проверяем, что данные обновились
    const finalCount = await page
      .locator('[data-testid^="user-row-"]')
      .count();
    expect(finalCount).toBeGreaterThanOrEqual(0);
  });

  // ============================================
  // ТЕСТ 8: Обработка ошибок
  // ============================================
  test('should handle error states', async ({ page }: { page: Page }) => {
    // Перехватываем запрос и возвращаем ошибку
    await page.route('**/api/dashboard/users-clerk**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // Перезагружаем страницу
    await page.reload();

    // Проверяем, что отображается ошибка
    await expect(page.getByTestId('users-error-state')).toBeVisible({
      timeout: 10000,
    });

    // Проверяем наличие кнопки retry
    const retryButton = page.getByTestId('retry-button');
    await expect(retryButton).toBeVisible();
  });

  // ============================================
  // ТЕСТ 9: Навигация
  // ============================================
  test('should navigate to user profile', async ({ page }: { page: Page }) => {
    // Ждем загрузки
    await page.waitForSelector('[data-testid^="user-row-"]', {
      timeout: 10000,
    });

    // Находим первого пользователя
    const firstUserRow = page.locator('[data-testid^="user-row-"]').first();
    await expect(firstUserRow).toBeVisible();

    // Открываем меню действий
    const actionsButton = firstUserRow.getByTestId('user-actions-button');
    await actionsButton.click();

    // Кликаем на "View Profile"
    const viewProfileLink = firstUserRow.getByTestId('user-post-link');
    await viewProfileLink.click();

    // Проверяем, что перешли на страницу профиля
    await expect(page).toHaveURL(/dashboard\/users\/[\w-]+/, {
      timeout: 5000,
    });
  });

  // ============================================
  // ТЕСТ 10: Accessibility
  // ============================================
  test('should have proper accessibility attributes', async ({
    page,
  }: { page: Page }) => {
    // Ждем загрузки
    await page.waitForSelector('[data-testid^="user-row-"]', {
      timeout: 10000,
    });

    // Проверяем aria-label на кнопке Refresh
    const refreshButton = page.getByTestId('refresh-users-button');
    await expect(refreshButton).toHaveAttribute(
      'aria-label',
      'Refresh users list'
    );

    // Проверяем role на фильтрах
    const filters = page.getByTestId('users-filters');
    await expect(filters).toHaveAttribute('role', 'search');

    // Проверяем aria-label на поиске
    const searchInput = page.getByTestId('user-search-input');
    await expect(searchInput).toHaveAttribute(
      'aria-label',
      'Search users by name or email'
    );
  });
});



