import { test as setup } from '@playwright/test';

setup('auth setup', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'load' });

  // Вводим email и переходим к следующему шагу
  await page.fill('input[name="identifier"]', process.env.E2E_EMAIL!);
  await page.getByRole('button', { name: /continue/i }).click();

  // Ждем появления поля пароля (Clerk переходит на следующий шаг)
  await page.waitForSelector('input[name="password"]', {
    state: 'visible',
    timeout: 10000,
  });

  // Вводим пароль и завершаем аутентификацию
  await page.fill('input[name="password"]', process.env.E2E_PASSWORD!);
  
  // Кликаем и ждем навигации
  await Promise.all([
    page.waitForURL(
      (url) => !url.pathname.includes('sign-in') && !url.pathname.includes('sign-up'),
      { timeout: 30000 }
    ),
    page.getByRole('button', { name: /continue/i }).click(),
  ]);

  // Дополнительная проверка: ждем, пока форма входа исчезнет
  // или появится индикатор успешной аутентификации
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
    // Игнорируем ошибку networkidle, если страница уже загружена
  });

  // Сохраняем состояние аутентификации
  await page.context().storageState({ path: 'tests/.auth/user.json' });
});
