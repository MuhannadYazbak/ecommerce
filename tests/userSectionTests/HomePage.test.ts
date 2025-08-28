import { test, expect, Locator } from '@playwright/test';
import { HomePage } from '../logic/HomePage';
import { annotateTest } from '../utils/annotate';
import { Item } from '@/types/item';
const testUserId = '123';
let homePage: HomePage
let firstItem: Locator
let items: Item[] = [
  { id: 1, name: 'iPhone 15 Pro', price: 1199.00, quantity: 1, photo: '/images/iphone15pro.jpg', description: '' },
  { id: 4, name: 'MacBook Air M3', price: 1299.00, quantity: 2, photo: '/images/mackbook.jpg', description: '' }
]
test.use({ storageState: 'auth.json' })
test.beforeEach(async ({ page }) => {
  // Clears all previous routes
  await page.unroute('**');
  await page.route('**/api/items', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(items)
    });
  });
  homePage = new HomePage(page)
  await homePage.navigate()
  await homePage.waitForItemsToLoad();
  firstItem = homePage.getFirstItem();
});

test('🛍️ Home page displays items after login', async ({ page }) => {
  annotateTest({ feature: 'HomePage' })
  await expect(firstItem).toBeVisible();
  await expect(homePage.getItemTitle(firstItem)).toContainText(/.+/);
  await expect(homePage.getItemPrice(firstItem)).toContainText(/₪\d+/);
  await expect(homePage.getItemImage(firstItem)).toBeVisible();
  await expect(homePage.getItemViewDetailsBtn(firstItem)).toBeVisible();
  await expect(homePage.getItemWishBtn(firstItem)).toBeVisible();
});

test('❤️ Clicking Wish adds item to wishlist and shows feedback', async ({ page }) => {
  annotateTest({ feature: 'HomePage' })
  let wishlistCalled = false;

  await page.route('**/api/wish', async route => {
    wishlistCalled = true;
    await route.fulfill({ status: 200 });
  });
  const wishBtn = homePage.getItemWishBtn(firstItem)
  await wishBtn.click()

  expect(wishlistCalled).toBe(true);

  // Assert button text changes
  await expect(wishBtn).toHaveText(/Wished/i);

  // Assert button has pink background
  await expect(wishBtn).toHaveClass(/bg-pink-500/);

});

test('🛒 Cart loads from backend after login', async ({ page }) => {
  annotateTest({ feature: 'HomePage' })
  await page.route(`**/api/cart/${testUserId}`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(items)
    });
  });

  await homePage.refresh()
  const cart = homePage.getCart()
  await expect(cart).toBeVisible();
  expect(cart).toHaveText('3')
  await cart.click()

  // Wait for navigation
  await expect(page).toHaveURL(/\/cart$/);

});

// test('💙 Clicking on WishList and verifying real data', async ({ page, request }) => {
//   annotateTest({feature: 'HomePage'})
//   // Navigate to /wish
//   const wishListButton = page.getByLabel('WishList');
//   await wishListButton.click();
//   await expect(page).toHaveURL(/\/wish$/);

//   // Fetch real wishlist data from backend
//   const response = await request.get(`/api/wish?userId=${testUserId}`);
//   expect(response.ok()).toBeTruthy();

//   const data = await response.json();
//   console.log('🧠 Real wishlist data:', data);

//   if (data.length === 0) {
//     // Assert empty state is rendered
//     await expect(page.getByLabel('Empty Wishlist')).toBeVisible();
//   } else {
//     // Assert correct number of items rendered
//     const items = page.locator('article');
//     await expect(items).toHaveCount(data.length);

//     // Assert item names
//     for (let i = 0; i < data.length; i++) {
//       await expect(items.nth(i).locator('h3')).toContainText(data[i].item_name);
//     }
//   }

//   // Go back to home
//   await page.click('text=Back');
//   await expect(page).toHaveURL(/\/home$/);
// });

test('💙 Clicking WishList navigates and renders', async ({ page }) => {
  annotateTest({ feature: 'HomePage' })
  const wishListButton = homePage.getWishListButton()
  await wishListButton.click();
  await expect(page).toHaveURL(/\/wish$/);

  await expect(
    page.getByLabel('Empty Wishlist').or(page.locator('article').first())
  ).toBeVisible();
  await homePage.back('/home')
  await expect(page).toHaveURL(/\/home$/);
});

test('💙 Clicking on Orders History and verifying real data', async ({ page, request }) => {

  annotateTest({ feature: 'HomePage' })
  const ordersHistoryButton = homePage.getOrdersHistoryButton()
  await ordersHistoryButton.click();
  await expect(page).toHaveURL(/\/orders$/);
  await expect(
    page.getByLabel('no-orders-heading').or(page.locator('article').first())
  ).toBeVisible();
  await homePage.back('/home')
  await expect(page).toHaveURL(/\/home$/);
});

test('💙 Clicking on View Item and verifying real data', async ({ page, request }) => {

  annotateTest({ feature: 'HomePage' })
  const viewDetailsButton = homePage.getItemViewDetailsBtn(firstItem)
  await viewDetailsButton.click();
  await expect(page).toHaveURL('/items/1');
});


test('💙 Search for phone and validate results include iphone', async ({ page }) => {
  annotateTest({ feature: 'HomePage' })
  await homePage.searchKeyword('phone')

  // Target the actual product name inside h2
  const productTitles = await homePage.getProductTitles()

  console.log('🔍 Found product titles:', productTitles);
  //Assert having the right item name included
  const matchFound = productTitles.some(title => title.includes('iphone'));
  expect(matchFound).toBe(true);
});


test('💙 Sort by price low to high and validate results are sorted', async ({ page }) => {
  annotateTest({ feature: 'HomePage' })
  await homePage.sortByOption('price-low-high')
  const prices = await homePage.getProductPrices()
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
  }
});

test('🔓 Logout redirects to landing page and clears user state', async ({ page }) => {
  annotateTest({ feature: 'HomePage' });

  const homePage = new HomePage(page); // Re-initialize here
  await homePage.logout();

  await page.waitForURL(`${process.env.BASE_URL}/`);
  await expect(page).toHaveURL(`${process.env.BASE_URL}/`);

  const userData = await page.evaluate(() => localStorage.getItem('user'));
  expect(userData).toBeNull();
});
