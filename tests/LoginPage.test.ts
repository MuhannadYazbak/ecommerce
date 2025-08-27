import { test, expect } from '@playwright/test';
import { LoginPage } from './logic/LoginPage';
import { annotateTest } from './utils/annotate';
import { LandingPage } from './logic/LandingPage';

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



test('🚫 Invalid login should show error alert', async ({ page }) => {
  annotateTest({ feature: 'LoginPage' })
  await page.route('**/api/login', async route => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Login failed: Invalid credentials' })
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
    expect(dialog.message()).toContain('Login Failed: Incorrect password');
    await dialog.dismiss();
  });
});

test('🔙 Back button on Login page redirects to landing', async ({ page }) => {
  annotateTest({ feature: 'LoginPage' })
  const landingPage = new LandingPage(page)
  await landingPage.navigate()
  await landingPage.clickLogin()
  loginPage = new LoginPage(page)
  await loginPage.navigate()
  await loginPage.waitForHeader()
  await loginPage.back('/')
  expect(page.url()).toBe(`${process.env.BASE_URL}/`);
});