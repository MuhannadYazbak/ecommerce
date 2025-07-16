import { test, expect } from '@playwright/test';

test('🔐 User can log in with valid credentials', async ({ page }) => {
    await page.route('**/api/login', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: '123',
                name: 'Test User',
                role: 'user',
                token: 'mocked-token'
            })
        });
    });

    await page.goto('/login');
    await page.waitForSelector('h1');
    await page.fill('#login-email', 'sajrawiAmer@gmail.com');
    await page.fill('#login-password', '1212');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/home');
});

test('🔐 Admin can log in with valid credentials', async ({ page }) => {
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

    await page.goto('/login');
    await page.waitForSelector('h1');
    await page.fill('#login-email', 'yazbakm@gmail.com');
    await page.fill('#login-password', '123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/items', { timeout: 7000 });
    //await expect(page).toHaveURL('/admin/items');
});

test('🚫 Invalid login should show error alert', async ({ page }) => {
  await page.route('**/api/login', async route => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Invalid credentials' })
    });
  });
  await page.goto('/login');
  await page.waitForSelector('h1');

  await page.fill('#login-email', 'wronguser@example.com');
  await page.fill('#login-password', 'badpass');

  // Listen for alert triggered by failed login
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Login failed');
    await dialog.dismiss();
  });

  await page.click('button[type="submit"]');
});

test('🔙 Back button on Login page redirects to landing', async ({ page }) => {
  await page.goto('/');
  await page.click('text=login'); // assuming this triggers real navigation

  await page.waitForURL('/login'); // confirm navigation to register
  await page.click('text=Back'); // trigger router.back()

  await page.waitForURL('/', { timeout: 5000 }); // wait for landing page
  await expect(page).toHaveURL('/');
});
