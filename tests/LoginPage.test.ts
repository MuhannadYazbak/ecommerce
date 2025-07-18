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
    await page.fill('#login-email', 'user@test.com');
    await page.fill('#login-password', 'User@passs01');
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
    await page.fill('#login-email', 'admin@test.com');
    await page.fill('#login-password', 'Admin-1234');
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

test('🚫 Login fails with incorrect password for valid email', async ({ page }) => {
  await page.route('**/api/login', async route => {
    const requestBody = JSON.parse(await route.request().postData() || '{}');

    if (requestBody.email === 'user@email.com' && requestBody.password !== 'CorrectP@ss1') {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Login Failed: Incorrect password' })
      });
    } else {
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
    }
  });

  await page.goto('/login');
  await page.fill('#login-email', 'user@email.com');
  await page.fill('#login-password', 'WrongPassword123');
  await page.click('button[type="submit"]');
   page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Incorrect password');
    await dialog.dismiss();
  });
});

test('🔙 Back button on Login page redirects to landing', async ({ page }) => {
  await page.goto('/');
  await page.click('text=login'); // assuming this triggers real navigation

  await page.waitForURL('/login'); // confirm navigation to register
  await page.click('text=Back'); // trigger router.back()

  await page.waitForURL('/', { timeout: 5000 }); // wait for landing page
  await expect(page).toHaveURL('/');
});

test.afterEach(async ({page} )=>{
  await page.close();
})