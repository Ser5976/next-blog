import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
  test('unauthenticated user can access sign-in page', async ({ page }) => {
    // Act: Переходим на страницу входа
    await page.goto('/sign-in');

    // Assert: Проверяем что форма входа видима
    await expect(
      page.getByRole('heading', { name: 'Sign in to My Application' })
    ).toBeVisible();
  });

  test('unauthenticated user can access sign-up page', async ({ page }) => {
    // Act: Переходим на страницу регистрации
    await page.goto('/sign-up');

    // Assert: Проверяем что форма регистрации видима
    await expect(
      page.getByRole('heading', { name: 'Create your account' })
    ).toBeVisible();
  });

  test('unauthenticated user is redirected from protected route', async ({
    page,
  }) => {
    // Act: Пытаемся получить доступ к защищенному маршруту
    await page.goto('/dashboard');

    // Assert: Проверяем что пользователь перенаправлен
    await expect(page).toHaveURL('/');
  });
});
