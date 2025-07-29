import { test, expect, Locator } from '@playwright/test';
import { HomePage } from './logic/HomePage';
const testUserId = '123';
let homePage : HomePage
let firstItem : Locator
test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page)
  // Clears all previous routes
  await page.unroute('**');

  await homePage.navigate()
  await homePage.waitForItemsToLoad();
  firstItem = homePage.getFirstItem();
});

test('🛍️ Home page displays items after login', async ({ page }) => {
  await expect(firstItem).toBeVisible();
  await expect(homePage.getItemTitle(firstItem)).toContainText(/.+/);
  await expect(homePage.getItemPrice(firstItem)).toContainText(/₪\d+/);
  await expect(homePage.getItemImage(firstItem)).toBeVisible();
  await expect(homePage.getItemViewDetailsBtn(firstItem)).toBeVisible();
  await expect(homePage.getItemWishBtn(firstItem)).toBeVisible();
});

test('❤️ Clicking Wish adds item to wishlist and shows feedback', async ({ page }) => {
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

  await homePage.refresh()

  //await page.waitForTimeout(5000);

  //const cartBadge = page.getByLabel('Cart Items Count');
  const cart = homePage.getCart()
  await expect(cart).toBeVisible();
  expect(cart).toHaveText('3')
  await cart.click()

  // Wait for navigation
  await expect(page).toHaveURL(/\/cart$/);
});

  // // Assert two cart items are rendered
  // const cartItems = page.locator('li[role="listitem"]');
  // await expect(cartItems).toHaveCount(2);

  // // Assert item names
  // await expect(cartItems.nth(0).locator('h2')).toContainText('iPhone 15 Pro');
  // await expect(cartItems.nth(1).locator('h2')).toContainText('MacBook Air M3');

//});

// test('💙 Clicking on WishList and verifying real data', async ({ page, request }) => {

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
  //const wishListButton = page.getByLabel('WishList');
  const wishListButton = homePage.getWishListButton()
  await wishListButton.click();
  await expect(page).toHaveURL(/\/wish$/);

  // Optional: check presence of a wishlist container element or empty label
  await expect(
    page.getByLabel('Empty Wishlist').or(page.locator('article').first())
  ).toBeVisible();
  await homePage.back()

  //await page.click('text=Back');
  await expect(page).toHaveURL(/\/home$/);
});

test('💙 Clicking on Orders History and verifying real data', async ({ page, request }) => {

  // Navigate to /orders
  const ordersHistoryButton = homePage.getOrdersHistoryButton()
  await ordersHistoryButton.click();
  await expect(page).toHaveURL(/\/orders$/);
   await expect(
    page.getByLabel('no-orders-heading').or(page.locator('article').first())
  ).toBeVisible();
  await homePage.back()
  await expect(page).toHaveURL(/\/home$/);
});

//   // Fetch real Orders History data from backend
//   const response = await request.get(`/api/orders?userId=${testUserId}`);
//   expect(response.ok()).toBeTruthy();

//   const data = await response.json();
//   console.log('🧠 Real Orders History data:', data);

//   if (data.length === 0) {
//     // Assert empty state is rendered
//     await expect(page.getByLabel('no-orders-heading')).toBeVisible();
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
  
// });

test('💙 Clicking on View Item and verifying real data', async ({ page, request }) => {


  // Navigate to /item/[item_id]
  //const ViewDetailsButton = page.locator('text=View Details').first();
  const viewDetailsButton = homePage.getItemViewDetailsBtn(firstItem)
  await viewDetailsButton.click();
  await expect(page).toHaveURL('/items/1');
  await 
  await expect(page).toHaveURL(/\/home$/);
});

  // // Fetch real Item data by id from backend
  // const response = await request.get(`/api/items/1`);
  // expect(response.ok()).toBeTruthy();

  // const data = await response.json();
  // console.log('🧠 Full item response:', data);
  // //console.log('🧠 Real Orders History data:', data);
  // console.log('🧠 Item name:', data.name);
  // expect(data.name).toBeDefined(); // Optional safety check

  // // Assert correct item was rendered
  // await expect(page.locator('#item-heading')).toHaveText(data.name);
  // // const item = page.locator('#item-heading');
  // // await expect(item).toHaveText(data.name);



  

test('💙 Search for phone and validate results include iphone', async ({ page }) => {
  // await page.getByLabel('search keyword').fill('phone');
  // await page.getByLabel('search keyword').press('Enter');
  await homePage.searchKeyword('phone')

  // Target the actual product name inside h2
  const productTitles = await homePage.getProductTitles()
  // const productTitles = await page.$$eval('h2.font-semibold', items =>
  //   items.map(i => i.textContent?.toLowerCase().trim() || '')
  // );

  console.log('🔍 Found product titles:', productTitles);
  //Assert having the right item name included
  const matchFound = productTitles.some(title => title.includes('iphone'));
  expect(matchFound).toBe(true);
});


test('💙 Sort by price low to high and validate results are sorted', async ({ page }) => {
  //await page.getByLabel('sort results').selectOption('price-low-high');
  //await page.selectOption('select#sort', 'price-low-high');
  await homePage.sortByOption('price-low-high')
  const prices = await homePage.getProductPrices()
  // const prices = await page.$$eval('p.text-blue-600.font-bold.text-lg', els =>
  //   els.map(el => parseFloat(el.textContent!.replace('₪', '')))
  // );
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
  }
});

test('🔓 Logout redirects to landing page and clears user state', async ({ page }) => {
  // await page.waitForSelector('text=Logout');
  // await page.click('text=Logout');
  await homePage.logout()

  await expect(page).toHaveURL(`${process.env.BASE_URL}/`);
});
