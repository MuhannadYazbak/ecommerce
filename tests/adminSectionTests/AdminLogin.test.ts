import { test, expect } from '@playwright/test';
import { LoginPage } from '../logic/LoginPage';
import { annotateTest } from '../utils/annotate';
import { LandingPage } from '../logic/LandingPage';

let loginPage: LoginPage


test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  await loginPage.navigate()
  await loginPage.waitForHeader()
});

test('🔐 Admin can log in with valid credentials', async ({ page }) => {
    annotateTest({feature: 'AdminLogin'})
    await page.route('**/api/login', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: '1',
                name: 'Admin User',
                role: 'admin',
                token: 'mocked-token'
            })
        });
    });
    await loginPage.loginAs('admin@test.com', 'Admin-1234')
    await expect(page).toHaveURL('/admin/items');
});