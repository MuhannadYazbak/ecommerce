import { test, expect } from '@playwright/test';

test('💚 Landing page loads and displays top 5 items', async ({ page }) => {
  await page.goto('/');
  
  // ✅ Check landing page URL
  await expect(page).toHaveURL(/\/$/);
  
  // 💛 System renders header
  //await expect(page.locator('h1')).toHaveText('TechMart');
  await page.waitForSelector('h1');
  // 📦 Check items rendering (assuming your item card class)
  const items = page.locator('article');
  await expect(items).toHaveCount(5);
});

test('💙 Clicking login should redirect to /login page', async ({ page }) => {
  await page.goto('/');

  // Click the "login" link by its visible text
  await page.click('text=login');

  // Assert that URL changed to /login
  await expect(page).toHaveURL(/\/login$/);
});

test('💙 Clicking register should redirect to /register page', async ({ page }) => {
  await page.goto('/');

  // Click the "register" link by its visible text
  await page.click('text=register');

  // Assert that URL changed to /register
  await expect(page).toHaveURL(/\/register$/);
});