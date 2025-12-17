import { test as setup } from '@playwright/test';

setup('auth setup', async ({ page }) => {
  await page.goto('/sign-in');

  await page.fill('input[name="identifier"]', process.env.E2E_EMAIL!);
  await page.getByRole('button', { name: /continue/i }).click();

  await page.fill('input[name="password"]', process.env.E2E_PASSWORD!);
  await page.getByRole('button', { name: /continue/i }).click();

  // Ждём, что мы больше не на sign-in
  await page.waitForURL((url) => !url.pathname.includes('sign-in'));

  await page.context().storageState({ path: 'tests/.auth/user.json' });
});
