import { test, expect } from "@playwright/test";
import { CartPage } from "../logic/Cart";
import { HomePage } from "../logic/HomePage";
import { annotateTest } from "../utils/annotate";

let cartPage: CartPage
const date = new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
let cartItems = [
    { item_id: '1', name: 'Wireless Mouse', quantity: 2, price: 29.99, photo:'', created_at: date},
    { item_id: '2', name: 'Mechanical Keyboard', quantity: 1, price: 89.99, photo:'', created_at: date },
    { item_id: '3', name: 'Xiaomi Redmi 14C', quantity: 2, price: 499, photo:'', created_at: date }
];

const userId = '123'
const itemId = '1'

test.use({ storageState: 'auth.json' })

test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page)
    await cartPage.navigate()
    //await page.waitForLoadState('networkidle')
})

test('Empty Cart validation', async ({ page }) => {
    annotateTest({ feature: 'CartPage' })
    const isEmpty = await cartPage.isCartEmpty()
    await expect(isEmpty).toBeTruthy()
})

test('Mocking non-empty cart, validate', async ({ page }) => {
    annotateTest({ feature: 'CartPage' })
    await page.route('**/api/cart/**', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(cartItems)
        });
    });
    await cartPage.refresh()
    await page.waitForSelector('[role="listitem"]')
    await expect(cartPage.getItemAt(0)).not.toBeNull()
    const count = await cartPage.getCartItemsCount()
    console.log('Cart have ', count, ' items')

})

test('Mocked cart validate remove item', async ({ page }) => {
    annotateTest({ feature: 'CartPage' })
    await page.route('**', route => {
        console.log('Intercepted:', route.request().method(), route.request().url());
        route.continue();
    });
    await page.route(`**/api/cart/${userId}`, route => {
        if (route.request().method() === 'GET') {
            route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify(cartItems)});
        } else {
            route.continue();
        }
    });

    await page.route(`**/api/cart/${userId}/*`, route => {
        if (route.request().method() === 'DELETE') {
            const parsedUrl = new URL(route.request().url());
            const segments = parsedUrl.pathname.split('/').filter(Boolean);
            const itemId = parseInt(segments[segments.length - 1], 10);
            console.log('Parsed URL:', parsedUrl.pathname);
            console.log('Segments:', segments);
            console.log('Extracted itemId:', itemId);
            console.log('DELETE called for itemId:', itemId);
            cartItems = cartItems.filter(item => Number(item.item_id) !== itemId);
            route.fulfill({ status: 200, body: JSON.stringify({ message: 'Item removed' }) });
        } else {
            route.continue();
        }
    });
    await page.waitForSelector('[role="listitem"]')
    expect(await cartPage.getItemAt(0)).not.toBeNull()
    const beforeRemoveCount = await cartPage.getCartItemsCount()
    console.log('Items count before remove ', beforeRemoveCount)
    await page.screenshot({ path: './test-screenshots/new/cartBeforeRemove.png' })
    await cartPage.removeItemAt(0)
    await page.waitForTimeout(500);
    await page.screenshot({ path: './test-screenshots/new/cartAfterRemove.png' })
    await expect(page.locator('[role="listitem"]')).toHaveCount(beforeRemoveCount - 1);

})

test('Select item and proceed to checkout', async ({ page }) => {
    annotateTest({ feature: 'CartPage' })
    await page.route(`**/api/cart/${userId}`, route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(cartItems)
        });
    });
    // cartPage = new CartPage(page)
    // await cartPage.navigate()
    //await page.waitForLoadState('networkidle')
    await page.waitForSelector('[role="listitem"]')
    const count = await cartPage.getCartItemsCount()
    expect(count).toBe(cartItems.length)

    // Select the first item's checkbox
    await cartPage.clickItemCheckBoxAtIndex(0)
    await page.screenshot({ path: './test-screenshots/checkbox-validate.png' })
    await page.waitForSelector('button#checkout:not([disabled])');
    await cartPage.checkoutSelected()
    await page.waitForTimeout(500)
    // Assert navigation to checkout page with selected item
    await expect(page).toHaveURL(/.*\/checkout*/);

});

test('🔙 Back button on Cart page redirects to landing', async ({ page }) => {
    annotateTest({ feature: 'CartPage' })
    const homePage = new HomePage(page)
    await homePage.navigate()
    const cartIcon = homePage.getCart()
    await cartIcon.click()
    cartPage = new CartPage(page)
    await cartPage.navigate()
    await cartPage.waitForLoad()
    await cartPage.back('/home')
    //expect(page.url()).toBe(`${process.env.BASE_URL}/home`);
    await expect(page).toHaveURL(/.*\/home/);
});