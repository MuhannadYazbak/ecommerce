import { test, expect } from '@playwright/test';
const testUserId = '123';
test.beforeEach(async ({ page }) => {
  // Clears all previous routes
  await page.unroute('**');

  await page.goto('/home');
});

test('🛍️ Home page displays items after login', async ({ page }) => {

  // Assert that at least one item is visible
  const items = page.locator('article'); // adjust selector as needed
  await page.waitForSelector('article');
  await expect(page.locator('article').first()).toBeVisible();

  // Check for item name, price, and image
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

  await page.route(`**/api/cart/${testUserId}`, async route => {
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

  //await page.waitForTimeout(5000);

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

test('💙 Clicking on WishList and verifying real data', async ({ page, request }) => {

  // Navigate to /wish
  const wishListButton = page.getByLabel('WishList');
  await wishListButton.click();
  await expect(page).toHaveURL(/\/wish$/);

  // Fetch real wishlist data from backend
  const response = await request.get(`/api/wish?userId=${testUserId}`);
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  console.log('🧠 Real wishlist data:', data);

  if (data.length === 0) {
    // Assert empty state is rendered
    await expect(page.getByLabel('Empty Wishlist')).toBeVisible();
  } else {
    // Assert correct number of items rendered
    const items = page.locator('article');
    await expect(items).toHaveCount(data.length);

    // Assert item names
    for (let i = 0; i < data.length; i++) {
      await expect(items.nth(i).locator('h3')).toContainText(data[i].item_name);
    }
  }

  // Go back to home
  await page.click('text=Back');
  await expect(page).toHaveURL(/\/home$/);
});

test('💙 Clicking on Orders History and verifying real data', async ({ page, request }) => {

  // Navigate to /orders
  const ordersHistoryButton = page.getByLabel('Orders History');
  await ordersHistoryButton.click();
  await expect(page).toHaveURL(/\/orders$/);

  // Fetch real Orders History data from backend
  const response = await request.get(`/api/orders?userId=${testUserId}`);
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  console.log('🧠 Real Orders History data:', data);

  if (data.length === 0) {
    // Assert empty state is rendered
    await expect(page.getByLabel('no-orders-heading')).toBeVisible();
  } else {
    // Assert correct number of items rendered
    const items = page.locator('article');
    await expect(items).toHaveCount(data.length);

    // Assert item names
    for (let i = 0; i < data.length; i++) {
      await expect(items.nth(i).locator('h3')).toContainText(data[i].item_name);
    }
  }

  // Go back to home
  await page.click('text=Back');
  await expect(page).toHaveURL(/\/home$/);
});

test('💙 Clicking on View Item and verifying real data', async ({ page, request }) => {


  // Navigate to /item/[item_id]
  const ViewDetailsButton = page.locator('text=View Details').first();
  await ViewDetailsButton.click();
  await expect(page).toHaveURL('/items/1');

  // Fetch real Item data by id from backend
  const response = await request.get(`/api/items/1`);
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  console.log('🧠 Full item response:', data);
  //console.log('🧠 Real Orders History data:', data);
  console.log('🧠 Item name:', data.name);
  expect(data.name).toBeDefined(); // Optional safety check

  // Assert correct item was rendered
  await expect(page.locator('#item-heading')).toHaveText(data.name);
  // const item = page.locator('#item-heading');
  // await expect(item).toHaveText(data.name);



  // Go back to home
  await page.click('text=Back');
  await expect(page).toHaveURL(/\/home$/);
});

test('💙 Search for phone and validate results include iphone', async ({ page }) => {
  await page.getByLabel('search keyword').fill('phone');
  await page.getByLabel('search keyword').press('Enter');

  // Target the actual product name inside h2
  const productTitles = await page.$$eval('h2.font-semibold', items =>
    items.map(i => i.textContent?.toLowerCase().trim() || '')
  );

  console.log('🔍 Found product titles:', productTitles);
  //Assert having the right item name included
  const matchFound = productTitles.some(title => title.includes('iphone'));
  expect(matchFound).toBe(true);
});


test('💙 Sort by price low to high and validate results are sorted', async ({ page }) => {
  await page.getByLabel('sort results').selectOption('price-low-high');
  //await page.selectOption('select#sort', 'price-low-high');
  const prices = await page.$$eval('p.text-blue-600.font-bold.text-lg', els =>
    els.map(el => parseFloat(el.textContent!.replace('₪', '')))
  );
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
  }
});

test('🔓 Logout redirects to landing page and clears user state', async ({ page }) => {
  await page.waitForSelector('text=Logout');
  await page.click('text=Logout');

  await expect(page).toHaveURL(`${process.env.BASE_URL}/`);
});

test.afterEach(async({page})=>{
  await page.close();
});
