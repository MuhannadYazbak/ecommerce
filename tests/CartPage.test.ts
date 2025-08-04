import { test, expect } from "@playwright/test";
import { CartPage } from "./logic/Cart";
import { HomePage } from "./logic/HomePage";

let cartPage: CartPage

test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page)
    await cartPage.navigate()
    // page.on('request', req => {
    //     if (req.url().includes('/api/cart')) {
    //         console.log('➡️ Cart request made to:', req.url());
    //     }
    // });

    // page.on('response', async res => {
    //     if (res.url().includes('/api/cart')) {
    //         console.log('🧾 Real cart response:', await res.json());
    //     }
    // });
})

test('Empty Cart validation', async () => {
    const isEmpty = await cartPage.isCartEmpty()
    //console.log(await page.content());
    //await page.screenshot({ path: 'cart-page-with-p.png' })
    await expect(isEmpty).toBeTruthy()
})

test('Mocking non-empty cart, validate', async ({ page }) => {
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


    await page.screenshot({ path: 'mocked-cart.png' })
    // const cartItems = page.locator("text=Wireless Mouse");
    // expect(cartItems).toBeVisible()
    // console.log('Cart have ', cartItems, 'and a total of ', count, ' items')
})

test('🔙 Back button on Login page redirects to landing', async ({ page }) => {
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