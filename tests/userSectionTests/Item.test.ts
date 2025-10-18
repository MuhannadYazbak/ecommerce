import { test, expect } from '@playwright/test'
import { ItemPage } from '../logic/Item';
import { Item } from '@/types/item';
import { HomePage } from '../logic/HomePage';
import { annotateTest } from '../utils/annotate';
import en from '@/locales/en/translation.json'
import { TranslatedItem } from '@/types/translatedItem';
import { request } from 'http';

let itemPage: ItemPage
const item: TranslatedItem = {
  item_id: 2,
  name: 'Samsung Galaxy S24 Ultra',
  arName: 'سامسونج جلاكسي اس24 الترا',
  heName: 'סמסונג גלקסי אס24 אולטרא',
  price: 1100,
  description: 'Great High-end Android phone with 200MP camera and S Pen.',
  arDescription: 'هاتف اندرويد فخم ومتطور بكاميرا 200 ميجا بيكسل وقلم اس',
  heDescription: 'מכשיר אנדרויד מתקדם עם מצלמת 200 מיגה פיקסל ועט אס',
  photo: '/images/s24ultra.jpg',
  quantity: 1
}

test.use({ storageState: 'auth.json' });
test.beforeEach(async ({ page }) => {
  await page.route('**/api/items*', async route => {
    if (route.request().method() === 'GET'){
   // if (route.request().url().includes(`/api/items/${item.item_id}`)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(item),
      });
    } else {
      route.continue();
    }
  });
  itemPage = new ItemPage(page, item)
  await itemPage.navigate()
  await itemPage.waitForItemsToLoad()
})

test('📦 Authenticated user can view item details', async ({ page }) => {
  annotateTest({ feature: 'ItemPage' })
  await itemPage.waitForHeader()
  await page.screenshot({path: 'test-screenshots/new/itemS24.png'})
  await expect(page).toHaveTitle(/TechMart \| (Samsung Galaxy S24 Ultra|Item #2)/i);
  //await expect(page).toHaveTitle(new RegExp(`TechMart \\| ${item.name}`, 'i'));
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