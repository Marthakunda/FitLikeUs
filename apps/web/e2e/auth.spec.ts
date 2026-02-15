import { test, expect } from '@playwright/test';

test.describe('Authentication Redirects', () => {
    test('Admin user is redirected to /admin/dashboard', async ({ page }) => {
        // Note: We'll implement actual firebase mock/login later
        // This test is designed to FAIL right now as routes don't exist
        await page.goto('/login');

        // Placeholder login flow
        await page.fill('input[name="email"]', 'admin@fitlikeus.com');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/\/admin\/dashboard/);
    });

    test('Client user is redirected to /dashboard', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[name="email"]', 'client@fitlikeus.com');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/\/dashboard/);
    });
});
