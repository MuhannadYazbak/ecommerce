import { test, expect } from "@playwright/test";
import { CartPage } from "./logic/Cart";
import { HomePage } from "./logic/HomePage";
import { annotateTest } from "./utils/annotate";

let cartPage: CartPage

test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page)
    await cartPage.navigate()
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
            body: JSON.stringify([
                { id: '1', name: 'Wireless Mouse', quantity: 2, price: 29.99 },
                { id: '2', name: 'Mechanical Keyboard', quantity: 1, price: 89.99 }
            ])
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
    await page.route('**/api/cart/**', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                { id: '1', name: 'Wireless Mouse', quantity: 2, price: 29.99 },
                { id: '2', name: 'Mechanical Keyboard', quantity: 1, price: 89.99 }
            ])
        });
    });
    await cartPage.refresh()
    await page.waitForSelector('[role="listitem"]')
    await expect(cartPage.getItemAt(0)).not.toBeNull()
    const beforeRemoveCount = await cartPage.getCartItemsCount()
    await cartPage.removeItemAt(0)
    const afterRemoveCount = await cartPage.getCartItemsCount()
    await expect(beforeRemoveCount - afterRemoveCount).toBe(1)
    console.log('Cart have ', afterRemoveCount, ' items')

})

test('Select item and proceed to checkout', async ({ page }) => {
    annotateTest({ feature: 'CartPage' })
    await page.route('**/api/cart/**', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                { id: '1', name: 'Wireless Mouse', quantity: 2, price: 29.99 },
                { id: '2', name: 'Mechanical Keyboard', quantity: 1, price: 89.99 }
            ])
        });
    });
    await cartPage.refresh()

    await page.waitForSelector('[role="listitem"]')
    const count = await cartPage.getCartItemsCount()
    expect(count).toBe(2)

    // Select the first item's checkbox
    await cartPage.clickItemCheckBoxAtIndex(0)
    await page.screenshot({ path: 'checkbox-validate.png' })
    await cartPage.checkoutSelected()
    // Assert navigation to checkout page with selected item
    await expect(page).toHaveURL(/\/checkout\?selected=/);

});

test('🔙 Back button on Login page redirects to landing', async ({ page }) => {
    annotateTest({ feature: 'CartPage' })
    // Navigate to landing page
    const homePage = new HomePage(page)
    await homePage.navigate()
    const cartIcon = homePage.getCart()
    await cartIcon.click()

    // Go back and wait for landing page to load
    await cartPage.back('/home')
    await page.waitForURL('/home');

    // Assert that we're no longer on the login page
    await expect(page.url()).toBe('http://localhost:3000/home');
});