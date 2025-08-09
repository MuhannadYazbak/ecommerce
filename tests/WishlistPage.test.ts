import { test, expect } from '@playwright/test';
import { WishlistPage } from './logic/Wishlist'
import { annotateTest } from './utils/annotate';

let wishlistPage: WishlistPage

let wishlist = [
    {
        item_id: 101,
        item_name: 'Mocked Item 1',
        wished_at: new Date().toISOString(),
    },
    {
        item_id: 102,
        item_name: 'Mocked Item 2',
        wished_at: new Date().toISOString(),
    },
];



test.use({ storageState: 'auth.json' });



test('should display heading and check if wishlist is empty', async ({ page }) => {
    annotateTest({ feature: 'WishlistPage' })
    wishlistPage = new WishlistPage(page)
    await wishlistPage.navigate()
    const headingText = await wishlistPage.getHeadingText();
    expect(headingText).toContain('Your Wishlist');

    if (await wishlistPage.isWishlistEmpty()) {
        console.log('✅ Wishlist is empty');
    } else {
        console.log('✅ Wishlist has items');
    }
});

test('should display correct number of wishlist items', async ({ page }) => {
    annotateTest({ feature: 'WishlistPage' })
    await page.route('**/api/wish?userId=123', async route => {
        console.log('✅ Route triggered:', route.request().method(), route.request().url());
        const url = new URL(route.request().url());
        if (url.searchParams.get('userId') === '123') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(wishlist),
            });
        }
    });

    wishlistPage = new WishlistPage(page);
    await wishlistPage.navigate();
    const item = await wishlistPage.waitForItems();
    if (await wishlistPage.isWishlistEmpty()) {
        throw new Error('❌ Wishlist is unexpectedly empty — test cannot proceed');
    }

    expect(item).not.toBeNull();

    const count = await wishlistPage.getWishlistCount();
    console.log('🧮 Count after wait:', count);
    expect(count).toBeGreaterThan(0);
});

test('should allow viewing an item from wishlist', async ({ page }) => {
    annotateTest({ feature: 'WishlistPage' })
    await page.route('**/api/wish?userId=123', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    item_id: 101,
                    item_name: 'Mocked Item',
                    wished_at: new Date().toISOString(),
                },
            ]),
        });
    });
    wishlistPage = new WishlistPage(page)
    await wishlistPage.navigate()
    await wishlistPage.waitForItems()
    if (!(await wishlistPage.isWishlistEmpty())) {
        await page.screenshot({ path: 'wishlist-allow-view.png' })
        await wishlistPage.viewItem(0);
        await expect(page).toHaveURL(/\/items\/\d+/);
        console.log('✅ Navigated to item detail page');
    }
});


test('should allow removing an item from wishlist', async ({ page }) => {
    annotateTest({ feature: 'WishlistPage' })
    await page.route('**/api/wish?userId=123', async route => {
        const method = route.request().method();

        if (method === 'GET') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(wishlist),
            });
        } else if (method === 'DELETE') {
            const body = await route.request().postDataJSON();
            wishlist = wishlist.filter(item => item.item_id !== body.item_id);
            console.log('🗑️ DELETE triggered. Removed item:', body.item_id);
            await route.fulfill({ status: 200 });
        } else {
            await route.continue();
        }
    });

    const wishlistPage = new WishlistPage(page);
    await wishlistPage.navigate();
    await wishlistPage.waitForItems();
    await page.screenshot({ path: 'wishlist-before-remove.png' })
    const initialCount = await wishlistPage.getWishlistCount();
    console.log('🧮 Initial count:', initialCount);
    expect(initialCount).toBe(2);

    await wishlistPage.removeItem(0);
    // Wait for the item count to drop
    await page.waitForFunction(() => {
        return document.querySelectorAll('[role="wishlist item"]').length === 1;
    }, { timeout: 3000 });
    await wishlistPage.waitForItems();
    await page.screenshot({ path: 'wishlist-after-remove.png' })
    const newCount = await wishlistPage.getWishlistCount();
    console.log('🧮 New count:', newCount);
    expect(newCount).toBe(initialCount - 1);
});
