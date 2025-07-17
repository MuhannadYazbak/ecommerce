import { test, expect } from '@playwright/test';
const testUserId = '123';
test.beforeEach(async ({ page }) => {
  await page.unroute('**'); // Clears all previous routes
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mocked-token');
    localStorage.setItem('user', JSON.stringify({
      id: testUserId,
      name: 'Test User',
      role: 'user'
    }));
  });

  await page.goto('/home');
});

test('🛍️ Home page displays items after login', async ({ page }) => {
  //await page.goto('/home');

  // Assert that at least one item is visible
  const items = page.locator('article'); // adjust selector as needed
  await page.waitForSelector('article');
  await expect(page.locator('article').first()).toBeVisible();

  // Optionally check for item name, price, or image
  const firstItem = page.locator('article').first();
  await expect(firstItem.locator('h2.font-semibold')).toContainText(/.+/);
  await expect(firstItem.locator('p.text-blue-600')).toContainText(/₪\d+/);
  await expect(firstItem.locator('img')).toBeVisible();
  await expect(firstItem.getByRole('button', { name: /View Details/i })).toBeVisible();
  await expect(firstItem.getByRole('button', { name: /Wish/i })).toBeVisible();
});

test('❤️ Clicking Wish adds item to wishlist and shows feedback', async ({ page }) => {
  let wishlistCalled = false;

  await page.route('**/api/wish', async route => {
    wishlistCalled = true;
    await route.fulfill({ status: 200 });
  });

  //await page.goto('/home');
  const firstItem = page.locator('article').first();
  const wishButton = firstItem.getByRole('button', { name: /Wish/i });

  await wishButton.click();

  expect(wishlistCalled).toBe(true);

  // Assert button text changes
  await expect(wishButton).toHaveText(/Wished/i);

  // Assert button has pink background
  await expect(wishButton).toHaveClass(/bg-pink-500/);
});

test('🛒 Cart loads from backend after login', async ({ page }) => {
  const testUserId = '123';

  await page.route(`**/api/cart/${testUserId}`, async route => {
    console.log('✅ Cart API mock triggered');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'iPhone 15 Pro', price: 1199.00, quantity: 1, photo: '/images/iphone15pro.jpg' },
        { id: 4, name: 'MacBook Air M3', price: 1299.00, quantity: 2, photo: '/images/mackbook.jpg' }
      ])
    });
  });

  await page.goto('/home');

  await page.waitForTimeout(5000);
  const html = await page.content();

  const cartBadge = page.getByLabel('Cart Items Count');
  await expect(cartBadge).toHaveText('3');
  // Click the cart icon
  await page.getByLabel('Cart Items Count').click();

  // Wait for navigation
  await expect(page).toHaveURL(/\/cart$/);

  // Assert two cart items are rendered
  const cartItems = page.locator('li[role="listitem"]');
  await expect(cartItems).toHaveCount(2);

  // Assert item names
  await expect(cartItems.nth(0).locator('h2')).toContainText('iPhone 15 Pro');
  await expect(cartItems.nth(1).locator('h2')).toContainText('MacBook Air M3');

});

