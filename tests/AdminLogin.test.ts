import { test, expect} from '@playwright/test'
import { LoginPage } from './logic/LoginPage'
import { annotateTest } from './utils/annotate'

let loginPage : LoginPage

test.use({storageState: 'auth.admin.json'})

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
                id: '123',
                name: 'Test User',
                role: 'admin',
                token: 'mocked-token'
            })
        });
    });
    await loginPage.loginAs('admin@test.com', 'Admin-1234')
    await page.waitForURL('**/admin/items', { timeout: 7000 });
});