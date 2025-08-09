import { test, expect } from '@playwright/test';
import { LandingPage } from './logic/LandingPage';
import { annotateTest } from './utils/annotate';

let landingPage: LandingPage;

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  await landingPage.navigate();
});

test('💚 Landing page loads and displays top 5 items', async ({ page }) => {
  annotateTest({ feature: 'LandingPage' })
  const landingPage = new LandingPage(page);
  await expect(page).toHaveURL(/\/$/);
  await landingPage.waitForHeader();
  const itemCount = await landingPage.getItemCards();
  expect(itemCount).toBe(5);
});

test('💙 Clicking login should redirect to /login page', async ({ page }) => {
  annotateTest({ feature: 'LandingPage' })
  const landingPage = new LandingPage(page);
  await landingPage.clickLogin();
  await expect(page).toHaveURL(/\/login$/);
});

test('💙 Clicking register should redirect to /register page', async ({ page }) => {
  annotateTest({ feature: 'LandingPage' })
  const landingPage = new LandingPage(page);
  await landingPage.clickRegister();
  await expect(page).toHaveURL(/\/register$/);
});