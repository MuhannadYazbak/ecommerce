import { test, expect } from '@playwright/test'
import { ItemPage } from './logic/Item';
import { Item } from '@/types/item';
import { HomePage } from './logic/HomePage';

let itemPage: ItemPage
const item = {
  id: 2,
  name: 'Samsung Galaxy S24 Ultra',
  price: 1100,
  description: 'Great High-end Android phone with 200MP camera and S Pen.',
  photo: '/images/s24ultra.jpg',
  quantity: 1
}

test.use({ storageState: 'auth.json' });
test.beforeEach(async ({ page }) => {
  await page.route(`**/api/item/${item.id}`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '2',
        name: 'Samsung Galaxy S24 Ultra'
      })
    });
  });
  itemPage = new ItemPage(page, item)
  await itemPage.navigate()
  await itemPage.waitForItemsToLoad()
  //await page.goto(`${process.env.BASE_URL}/items/${itemId}`);
})

test('📦 Authenticated user can view item details', async ({ page }) => {

  //const heading = page.locator('h1', { hasText: item.name });
  const heading = itemPage.waitForHeader()
  //await expect(heading).toBeVisible();
  await expect(page).toHaveTitle(new RegExp(`TechMart \\| ${item.name}`, 'i'));
  //await expect(page).toHaveTitle(/TechMart \| Samsung Galaxy S24 Ultra/i);
});

test('Validate Item details are correct', async ({ page }) => {
  const showing = itemPage.validateItem()
  await expect(showing.name).toBe(item.name)
  await expect(showing.price).toBe(item.price)
  await expect(showing.description).toBe(item.description)
  await expect(showing.photo).toBe(item.photo)
  await expect(showing.quantity).toBe(item.quantity)
})

test('validate Cart updated', async ({ page })=> {
  const beforeClickCount = Number(itemPage.getCart().textContent)
  const addToCartBtn = await itemPage.getAddToCartButton()
  await addToCartBtn.click()
  const afterClickCount = Number(itemPage.getCart().textContent)
  await expect(afterClickCount).toBe(item.quantity + beforeClickCount)
})

// test('🔙 Back button on Login page redirects to landing', async ({ page }) => {
//   //await page.goto('/home');
//   const homePage = new HomePage(page)
//   await homePage.navigate()
//   await homePage.getItemViewDetailsBtn(homePage.getItemByIndex(item.id)).click()
//   //await page.click('text=login'); // assuming this triggers real navigation

//   await page.waitForURL(`items/${item.id}`); // confirm navigation to Item dynamic page
//   // await page.click('text=Back'); // trigger router.back()
//   await itemPage.back()

//   await page.waitForURL('/home', { timeout: 5000 }); // wait for landing page
//   await expect(page).toHaveURL('/home');
// });