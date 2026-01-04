import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
  // Проверка, что тесты запускаются без storageState (неаутентифицированный пользователь)
  test('should run without authentication state', async ({ context }) => {
    // Проверяем, что нет cookies аутентификации Clerk
    const cookies = await context.cookies();
    const clerkCookies = cookies.filter(
      (cookie) =>
        cookie.name.includes('__session') || cookie.name.includes('__clerk')
    );

    // В неаутентифицированном состоянии не должно быть cookies Clerk
    expect(clerkCookies.length).toBe(0);
  });

  test('unauthenticated user can access sign-in page', async ({ page }) => {
    // Act: Переходим на страницу входа
    // Используем 'load' вместо 'networkidle' - более надежно для Clerk компонентов
    await page.goto('/sign-in', { waitUntil: 'load', timeout: 30000 });

    // Assert: Проверяем что форма входа видима
    // Ожидаем появления формы - ищем поле email или кнопку Continue
    // Clerk компоненты загружаются асинхронно через ClientOnly
    // Используем waitForSelector с несколькими селекторами через Promise.race
    await Promise.race([
      page.waitForSelector('input[type="email"], input[name="identifier"]', {
        state: 'visible',
        timeout: 15000,
      }),
      page
        .getByRole('button', { name: /continue|sign in/i })
        .first()
        .waitFor({ state: 'visible', timeout: 15000 }),
    ]).catch(() => {
      // Если оба не найдены, проверяем наличие заголовка формы
      return page
        .getByRole('heading', { name: /sign in/i })
        .waitFor({ state: 'visible', timeout: 5000 });
    });

    // Дополнительно проверяем, что мы не были перенаправлены на главную
    await expect(page).toHaveURL(/sign-in/);
  });

  test('unauthenticated user can access sign-up page', async ({ page }) => {
    // Act: Переходим на страницу регистрации
    // Используем 'load' вместо 'networkidle' - более надежно для Clerk компонентов
    await page.goto('/sign-up', { waitUntil: 'load', timeout: 30000 });

    // Assert: Проверяем что форма регистрации видима
    // Ожидаем появления формы - ищем поле email или кнопку Continue
    // Clerk компоненты загружаются асинхронно через ClientOnly
    // Используем waitForSelector с несколькими селекторами через Promise.race
    await Promise.race([
      page.waitForSelector('input[type="email"], input[name="emailAddress"]', {
        state: 'visible',
        timeout: 15000,
      }),
      page
        .getByRole('button', { name: /continue|create account|sign up/i })
        .first()
        .waitFor({ state: 'visible', timeout: 15000 }),
    ]).catch(() => {
      // Если оба не найдены, проверяем наличие заголовка формы
      return page
        .getByRole('heading', { name: /create your account/i })
        .waitFor({ state: 'visible', timeout: 5000 });
    });

    // Дополнительно проверяем, что мы не были перенаправлены на главную
    await expect(page).toHaveURL(/sign-up/);
  });

  test('unauthenticated user is redirected from protected route', async ({
    page,
  }) => {
    // Act: Пытаемся получить доступ к защищенному маршруту
    // Используем 'load' для более надежного ожидания редиректа
    await page.goto('/dashboard', { waitUntil: 'load', timeout: 30000 });

    // Assert: Проверяем что пользователь перенаправлен на главную или sign-in
    // В зависимости от настроек middleware может быть редирект на / или /sign-in
    await expect(page).toHaveURL(/\/(sign-in)?$/, { timeout: 10000 });
  });
});
