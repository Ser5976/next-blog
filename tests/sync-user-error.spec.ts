import { test, expect } from '@playwright/test';

test.describe('Sync User Error Page', () => {
  test('should display registration error and navigation links', async ({ page }) => {
    // Navigate to the sync-user-error page with a specific error type
    await page.goto('/sync-user-error?error=sync_failed');

    // Expect a title "Registration Error"
    await expect(page.getByRole('heading', { name: 'Registration Error' })).toBeVisible();

    // Expect a specific error message
    await expect(page.getByText('An error occurred while creating your profile. Please try registering again.')).toBeVisible();

    // Expect "Try Again" link to be visible and navigate to /sign-up
    const tryAgainLink = page.getByRole('link', { name: 'Try registration again' });
    await expect(tryAgainLink).toBeVisible();
    await expect(tryAgainLink).toHaveAttribute('href', '/sign-up');

    // Expect "Go to Homepage" link to be visible and navigate to /
    const goHomeLink = page.getByRole('link', { name: 'Go to home page' });
    await expect(goHomeLink).toBeVisible();
    await expect(goHomeLink).toHaveAttribute('href', '/');
  });

  test('should display default authentication error and navigation links', async ({ page }) => {
    // Navigate to the sync-user-error page without a specific error type
    await page.goto('/sync-user-error');

    // Expect a title "Authentication Error"
    await expect(page.getByRole('heading', { name: 'Authentication Error' })).toBeVisible();

    // Expect a specific default error message
    await expect(page.getByText('An unknown error occurred. Please try again.')).toBeVisible();

    // Expect "Try Again" link to be visible and navigate to /sign-up
    const tryAgainLink = page.getByRole('link', { name: 'Try registration again' });
    await expect(tryAgainLink).toBeVisible();
    await expect(tryAgainLink).toHaveAttribute('href', '/sign-up');

    // Expect "Go to Homepage" link to be visible and navigate to /
    const goHomeLink = page.getByRole('link', { name: 'Go to home page' });
    await expect(goHomeLink).toBeVisible();
    await expect(goHomeLink).toHaveAttribute('href', '/');
  });
});
