import { test, expect} from '@playwright/test'
test.use({ storageState: 'auth.json' });
const itemId = '2';
const itemName = 'Samsung Galaxy S24 Ultra';

test.beforeEach(async ({page})=>{
    await page.route(`**/api/item/${itemId}`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '2',
        name: 'Samsung Galaxy S24 Ultra'
      })
    });
  });

  await page.goto(`${process.env.BASE_URL}/items/${itemId}`);
})

test('📦 Authenticated user can view item details', async ({ page }) => {
  
  const heading = page.locator('h1', { hasText: itemName });
  await expect(heading).toBeVisible();
  await expect(page).toHaveTitle(new RegExp(`TechMart \\| ${itemName}`, 'i'));
  //await expect(page).toHaveTitle(/TechMart \| Samsung Galaxy S24 Ultra/i);
});