import { test, expect } from '@playwright/test';
import { LoginPage } from './logic/LoginPage';
import { annotateTest } from './utils/annotate';

let loginPage: LoginPage

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  await loginPage.navigate()
  await loginPage.waitForHeader()
});

test('🔐 User can log in with valid credentials', async ({ page }) => {
  annotateTest({ feature: 'LoginPage' })
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
  await loginPage.loginAs('user@test.com', 'User@pass01')

  await expect(page).toHaveURL('/home');
});

// test('🔐 Admin can log in with valid credentials', async ({ page }) => {
//     annotateTest({feature: 'LoginPage'})
//     await page.route('**/api/login', async route => {
//         await route.fulfill({
//             status: 200,
//             contentType: 'application/json',
//             body: JSON.stringify({
//                 id: '123',
//                 name: 'Test User',
//                 role: 'admin',
//                 token: 'mocked-token'
//             })
//         });
//     });
//     await loginPage.loginAs('admin@test.com', 'Admin-1234')
//     await page.waitForURL('**/admin/items', { timeout: 7000 });
// });

test('🚫 Invalid login should show error alert', async ({ page }) => {
  annotateTest({ feature: 'LoginPage' })
  await page.route('**/api/login', async route => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Invalid credentials' })
    });
  });
  await loginPage.loginAs('wronguser@example.com', 'badpass',false)
  // Listen for alert triggered by failed login
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Login failed: User not found');
    await dialog.dismiss();
  });


});

test('🚫 Login fails with incorrect password for valid email', async ({ page }) => {
  annotateTest({ feature: 'LoginPage' })
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
  await loginPage.loginAs('user@email.com', 'WrongPassword123',false)
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Incorrect password');
    await dialog.dismiss();
  });
});

test('🔙 Back button on Login page redirects to landing', async ({ page }) => {
  annotateTest({ feature: 'LoginPage' })
  await page.goto('/');
  await page.click('text=login');
  await page.waitForURL('/login');
  await loginPage.back('/')
  await page.waitForURL('/');
  expect(page.url()).toBe('http://localhost:3000/');
});