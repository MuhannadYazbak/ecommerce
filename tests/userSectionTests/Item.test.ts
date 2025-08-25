import { test, expect } from '@playwright/test'
import { ItemPage } from '../logic/Item';
import { Item } from '@/types/item';
import { HomePage } from '../logic/HomePage';
import { annotateTest } from '../utils/annotate';

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
})

test('📦 Authenticated user can view item details', async ({ page }) => {
  annotateTest({ feature: 'ItemPage' })
  const heading = itemPage.waitForHeader()
  await expect(page).toHaveTitle(new RegExp(`TechMart \\| ${item.name}`, 'i'));
});

test('Validate Item details are correct', async ({ page }) => {
  annotateTest({ feature: 'ItemPage' })
  const showing = itemPage.validateItem()
  await expect(showing.name).toBe(item.name)
  await expect(showing.price).toBe(item.price)
  await expect(showing.description).toBe(item.description)
  await expect(showing.photo).toBe(item.photo)
  await expect(showing.quantity).toBe(item.quantity)
})

test('validate Cart updated', async ({ page }) => {
  annotateTest({ feature: 'ItemPage' })
  const beforeClickCount = Number(itemPage.getCart().textContent)
  const addToCartBtn = await itemPage.getAddToCartButton()
  await addToCartBtn.click()
  const afterClickCount = Number(itemPage.getCart().textContent)
  await expect(afterClickCount).toBe(item.quantity + beforeClickCount)
})