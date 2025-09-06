import { test, expect, Locator } from '@playwright/test';
import { HomePage } from '../logic/HomePage';
import { annotateTest } from '../utils/annotate';
import { Item } from '@/types/item';
const guestId = 999;
let homePage: HomePage
let firstItem: Locator
let items: Item[] = [
    { id: 1, name: 'iPhone 15 Pro', price: 1199.00, quantity: 1, photo: '/images/iphone15pro.jpg', description: '' },
    { id: 4, name: 'MacBook Air M3', price: 1299.00, quantity: 2, photo: '/images/mackbook.jpg', description: '' }
]
test.use({ storageState: 'auth.guest.json' })
test.describe('guest actions with beforeEach', async () => {
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

    test('🛍️ Home page displays items for guest', async ({ page }) => {
        annotateTest({ feature: 'GuestHomePage' })
        await expect(firstItem).toBeVisible();
        await expect(homePage.getItemTitle(firstItem)).toContainText(/.+/);
        await expect(homePage.getItemPrice(firstItem)).toContainText(/₪\d+/);
        await expect(homePage.getItemImage(firstItem)).toBeVisible();
        await expect(homePage.getItemViewDetailsBtn(firstItem)).toBeVisible();
        await expect(homePage.getItemWishBtn(firstItem)).toBeVisible();
    });

    test('❤️ Clicking Wish adds item to wishlist and shows feedback', async ({ page }) => {
        annotateTest({ feature: 'GuestHomePage' })
        let wishlistCalled = false;

        await page.route('**/api/wish', async route => {
            wishlistCalled = true;
            await route.fulfill({
                contentType: 'application/json',
                status: 200,
                body: JSON.stringify(items)
            });
        });
        const wishBtn = homePage.getItemWishBtn(firstItem)
        await wishBtn.click()

        expect(wishlistCalled).toBe(true);

        // Assert button text changes
        await expect(wishBtn).toHaveText(/Wished/i);

        // Assert button has pink background
        await expect(wishBtn).toHaveClass(/bg-pink-500/);

    });

    test('loads from localStorage and navigates to cart page', async ({ page }) => {
        annotateTest({ feature: 'GuestHomePage' });
        homePage = new HomePage(page);
        await homePage.navigate()
        await homePage.waitForItemsToLoad()
        await page.evaluate(() => {
            
                localStorage.setItem('guestCart', JSON.stringify([
                    {
                        item_id: 1,
                        name: 'iPhone 15 Pro',
                        price: 1199.00,
                        quantity: 1,
                        photo: '/images/iphone15pro.jpg'
                    },
                    {
                        item_id: 4,
                        name: 'MacBook Air M3',
                        price: 1299.00,
                        quantity: 2,
                        photo: '/images/mackbook.jpg'
                    }

                ]))
        });
        await homePage.refresh()
        await page.screenshot({ path: 'test-screenshots/new/guestCart.png' })

        const cart = page.getByTestId('cart-count');
        await expect(cart).toBeVisible();
        await expect(cart).toHaveText('3');

        await cart.click();
        await expect(page).toHaveURL(/\/cart$/);
    });
    test('💙 Guest have no access for WishList', async ({ page }) => {
        let wishlistCalled = false
        annotateTest({ feature: 'GuestHomePage' })
        await page.route('**/api/wish', async route => {
            wishlistCalled = true;
            await route.fulfill({
                contentType: 'application/json',
                status: 200,
                body: JSON.stringify(items)
            });
        });
        homePage = new HomePage(page)
        await homePage.navigate()
        await homePage.waitForItemsToLoad()
        const wishListButton = homePage.getWishListButton()
        await wishListButton.click();
        await expect(page).toHaveURL(/\/home$/);
    });

    test('💙 Guest  have no access for Orders History', async ({ page, request }) => {

        annotateTest({ feature: 'GuestHomePage' })
        await page.route('**/api/orders', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([]) // or mock orders
            });
        });
        const ordersHistoryButton = homePage.getOrdersHistoryButton()
        await ordersHistoryButton.click();
        await expect(page).toHaveURL(/\/home$/);
    });

    test('💙 Clicking on View Item and verifying real data', async ({ page, request }) => {

        annotateTest({ feature: 'GuestHomePage' })
        const viewDetailsButton = homePage.getItemViewDetailsBtn(firstItem)
        await viewDetailsButton.click();
        await expect(page).toHaveURL('/items/1');
    });


    test('💙 Search for phone and validate results include iphone', async ({ page }) => {
        annotateTest({ feature: 'GuestHomePage' })
        await page.route('**/api/search?**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(items)
            });
        });
        homePage = new HomePage(page)
        await homePage.navigate()
        await homePage.waitForItemsToLoad()
        await homePage.searchKeyword('phone')

        // Target the actual product name inside h2
        const productTitles = await homePage.getProductTitles()

        console.log('🔍 Found product titles:', productTitles);
        //Assert having the right item name included
        const matchFound = productTitles.some(title => title.includes('iphone'));
        expect(matchFound).toBe(true);
    });


    test('💙 Sort by price low to high and validate results are sorted', async ({ page }) => {
        annotateTest({ feature: 'GuestHomePage' })
        await homePage.sortByOption('price-low-high')
        const prices = await homePage.getProductPrices()
        for (let i = 0; i < prices.length - 1; i++) {
            expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
        }
    });

    test('🔓 Logout redirects to landing page and clears guest state', async ({ page }) => {
        annotateTest({ feature: 'GuestHomePage' });

        const homePage = new HomePage(page); // Re-initialize here
        await homePage.logout();

        await page.waitForURL(`${process.env.BASE_URL}/`);
        await expect(page).toHaveURL(`${process.env.BASE_URL}/`);

        const guestData = await page.evaluate(() => localStorage.getItem('guest'));
        expect(guestData).toBeNull();
    });
});
