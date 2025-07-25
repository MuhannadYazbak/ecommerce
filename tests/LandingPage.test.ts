import { test, expect } from '@playwright/test';
import { LandingPage } from './logic/LandingPage';

let landingPage : LandingPage;

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  await landingPage.navigate();
});

test('💚 Landing page loads and displays top 5 items', async ({ page }) => {
  const landingPage = new LandingPage(page);

  await expect(page).toHaveURL(/\/$/);
  await landingPage.waitForHeader();
  const itemCount = await landingPage.getItemCards();
  expect(itemCount).toBe(5);
});

test('💙 Clicking login should redirect to /login page', async ({ page }) => {
  const landingPage = new LandingPage(page);

  await landingPage.clickLogin();
  await expect(page).toHaveURL(/\/login$/);
});

test('💙 Clicking register should redirect to /register page', async ({ page }) => {
  const landingPage = new LandingPage(page);

  await landingPage.clickRegister();
  await expect(page).toHaveURL(/\/register$/);
});

test.afterEach(async ({ page }) => {
  await page.close();
});