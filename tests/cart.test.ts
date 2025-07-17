import { test, expect } from '@playwright/test'
const testUserId = '123';

test.beforeEach(async ({ page }) => {
    await page.unroute('**');
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
    await page.addInitScript(() => {
        localStorage.setItem('token', 'mocked-token');
        localStorage.setItem('user', JSON.stringify({
            id: '123',
            name: 'Test User',
            role: 'user'
        }));
    });

    await page.goto('/home');
});

test('🛒 Cart loads from backend after login', async ({ page }) => {


    const cartBadge = page.getByLabel('Cart Items Count');
    await expect(cartBadge).toHaveText('3');
});