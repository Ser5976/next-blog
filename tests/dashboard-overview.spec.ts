import { expect, Page, test } from '@playwright/test';

test.describe('Dashboard Overview - Complete E2E Tests', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Переходим на dashboard
    await page.goto('/dashboard', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    //  Проверяем URL
    await expect(page).toHaveURL(/dashboard/);
  });

  // ============================================
  // ТЕСТ 1:  Основная структура
  // ============================================
  test('should display complete dashboard structure', async ({
    page,
  }: {
    page: Page;
  }) => {
    // 1. Проверяем заголовок панели
    const mainTitle = page.getByText('Overview Panel', { exact: false });
    await expect(mainTitle).toBeVisible();

    // 2. Проверяем подзаголовок
    const subtitle = page.getByText('Analytics for VitaFlowBlog', {
      exact: false,
    });
    await expect(subtitle).toBeVisible();

    // 3. Проверяем фильтры времени (3 кнопки)
    const weekButton = page.getByRole('button', { name: 'Week', exact: true });
    const monthButton = page.getByRole('button', {
      name: 'Month',
      exact: true,
    });
    const yearButton = page.getByRole('button', { name: 'Year', exact: true });

    // Проверяем наличие всех кнопок
    await expect(weekButton).toBeVisible();
    await expect(monthButton).toBeVisible();
    await expect(yearButton).toBeVisible();

    // Проверяем что кнопки кликабельны
    await expect(weekButton).toBeEnabled();
    await expect(monthButton).toBeEnabled();
    await expect(yearButton).toBeEnabled();

    // 4. Проверяем ожидаемые карточки по заголовкам
    const expectedCardTitles = [
      'Total articles',
      'Views',
      'Average rating',
      'Comments',
      'Users',
      'Efficiency',
      'Popular articles',
      'Popular categories',
    ];

    for (const title of expectedCardTitles) {
      const card = page.locator('[data-testid="card-title"]', {
        hasText: title,
      });
      await expect(card).toBeVisible();
    }
  });

  // ============================================
  // ТЕСТ 2:  Фильтры времени
  // ============================================
  test('should convey the time period via URL parameters', async ({
    page,
  }: {
    page: Page;
  }) => {
    const timeRanges = [
      { name: 'Week', value: 'week' },
      { name: 'Month', value: 'month' },
      { name: 'Year', value: 'year' },
    ];

    for (const timeRange of timeRanges) {
      const button = page.getByRole('button', {
        name: timeRange.name,
        exact: true,
      });

      // Проверяем текущий URL перед кликом
      const currentUrl = page.url();
      const currentParams = new URLSearchParams(new URL(currentUrl).search);
      const currentTimeRange = currentParams.get('timeRange');

      // Кликаем только если параметр еще не установлен
      if (currentTimeRange !== timeRange.value) {
        // Убеждаемся, что кнопка видима и готова к клику
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();

        // Кликаем на кнопку и ждем изменения URL
        // Используем Promise.all для одновременного ожидания навигации и клика
        await Promise.all([
          page.waitForFunction(
            (expectedValue) => {
              const params = new URLSearchParams(window.location.search);
              return params.get('timeRange') === expectedValue;
            },
            timeRange.value,
            { timeout: 10000 }
          ),
          button.click(),
        ]);
      } else {
        // Если параметр уже установлен, просто проверяем URL
        await expect(page).toHaveURL(
          new RegExp(`timeRange=${timeRange.value}`)
        );
      }

      // Проверяем конкретный параметр в URL
      const url = page.url();
      const urlParams = new URLSearchParams(new URL(url).search);

      expect(urlParams.get('timeRange')).toBe(timeRange.value);

      // Проверяем что кнопка стала активной
      // У активной кнопки есть классы для primary стиля
      await expect(button).toHaveClass(/bg-primary/);
      await expect(button).toHaveClass(/text-primary-foreground/);
    }
  });

  // ============================================
  // ТЕСТ 3:  Тест на устойчивость
  // ============================================

  test('should remain usable when one widget fails to load', async ({
    page,
  }) => {
    await page.route('**/api/**/comments**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    // Используем 'load' вместо 'networkidle' - более надежно
    // networkidle может никогда не достигнуться из-за фоновых запросов
    await page.goto('/dashboard', { waitUntil: 'load', timeout: 30000 });

    // 1️⃣ Dashboard загрузился
    await expect(
      page.getByText('Overview Panel', { exact: false })
    ).toBeVisible();

    // 2️⃣ Другие карточки на месте
    await expect(
      page.locator('[data-testid="card-title"]', {
        hasText: 'Total articles',
      })
    ).toBeVisible();

    await expect(
      page.locator('[data-testid="card-title"]', {
        hasText: 'Views',
      })
    ).toBeVisible();

    // 4️⃣ Фильтр продолжает работать
    const yearButton = page.getByRole('button', { name: 'Year' });
    await yearButton.click();

    await expect(page).toHaveURL(/timeRange=year/);
  });
});
