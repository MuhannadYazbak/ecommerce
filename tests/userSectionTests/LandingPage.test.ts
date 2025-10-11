import { test, expect } from '@playwright/test';
import { LandingPage } from '../logic/LandingPage';
import { annotateTest } from '../utils/annotate';
import { Order } from '@/types/order';

let landingPage: LandingPage;
const mockTop5Orders: Order[] = [
  {
    order_id: 101,
    user_id: 123,
    total_amount: 4995.00,
    items_json: [
      { id: 1, name: 'iPhone 15 Pro', quantity: 1, price: 1199.00, photo: '/images/iphone15pro.jpg' },
      { id: 2, name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 990.00, photo: '/images/s24ultra.jpg' },
      { id: 3, name: 'Xiaomi Tab7 pro', quantity: 1, price: 1199.00, photo: '/images/pad7pro.jpg' },
      { id: 4, name: 'MacBook Air M3', quantity: 1, price: 1299.00, photo: '/images/mackbook.jpg' },
      { id: 5, name: 'Playstation 5', quantity: 1, price: 2679.00, photo: '/images/playstation5.jpg' }
    ],
    created_at: '2025-08-28',
    status: 'Delivered',
    address_id: 77
  }
];
test.beforeEach(async ({ page }) => {
    await page.unroute('**');
  await page.route('**/api/top5', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockTop5Orders)
    });
  });
  landingPage = new LandingPage(page);
  await landingPage.navigate();
});

test('💚 Landing page loads and displays top 5 items', async ({ page }) => {
  annotateTest({ feature: 'LandingPage' })
  //const landingPage = new LandingPage(page);
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