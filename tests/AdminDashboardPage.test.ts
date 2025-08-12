import { test, expect } from '@playwright/test';
//import { LoginPage } from './logic/LoginPage'
import { AdminItemsPage } from './logic/AdminDashboardPage'

test.describe('Admin Items Dashboard', () => {
    test.use({ storageState: 'auth.admin.json' })
    test.beforeEach(async ({ page }) => {
        await page.route('**/api/items**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 1, name: 'Mock Item', description: 'Test', price: 100, quantity: 5, photo: '/mock.jpg' },
                ]),
            });
        });

        await page.goto(`${process.env.BASE_URL}/admin/items`);
    });

    test('should navigate to new item page', async ({ page }) => {
        const adminPage = new AdminItemsPage(page);
        await adminPage.navigate()
        await adminPage.addItem();
        await expect(page).toHaveURL(/\/admin\/items\/new/);
    });

    test('should view details of nth item', async ({ page }) => {
        const adminPage = new AdminItemsPage(page);
        await adminPage.navigate()
        await adminPage.viewItem(0);
        await expect(page).toHaveURL(/\/admin\/items\/\d+/);
    });

    test('should delete the first item', async ({ page }) => {
        let mockItems = [
            { id: 1, name: 'Mock Item', description: 'Test', price: 100, quantity: 5, photo: '/mock.jpg' },
            { id: 2, name: 'Another Item', description: 'Test 2', price: 150, quantity: 3, photo: '/mock2.jpg' },
        ];

        await page.route('**/api/items', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockItems),
            });
        });

        await page.route('**/api/items/*', async route => {
            if (route.request().method() === 'DELETE') {
                const id = parseInt(route.request().url().split('/').pop() || '', 10);
                mockItems = mockItems.filter(item => item.id !== id); // simulate deletion
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true }),
                });
            } else {
                await route.continue();
            }
        });
        const adminPage = new AdminItemsPage(page);
        await adminPage.navigate()
        const totalCountBefore = await page.locator('#item-article').count();
        await adminPage.removeItem(0);
        await page.waitForLoadState('networkidle');
        await adminPage.refresh()
        const totalCountAfter = await page.locator('#item-article').count();
        expect(Number(totalCountAfter)).toBeLessThan(Number(totalCountBefore));
        // await adminPage.removeItem(0);
        // const count = await page.locator('article').count()
        // expect(count).toBeLessThan(6)
    });

    test('should navigate to orders list', async ({ page }) => {
        const adminPage = new AdminItemsPage(page);
        await adminPage.navigate()
        await adminPage.goToOrdersList();
        await expect(page).toHaveURL(/\/admin\/orders-list/);
    });

    test('should navigate to bar chart page', async ({ page }) => {
        const adminPage = new AdminItemsPage(page);
        await adminPage.navigate()
        await adminPage.goToBarChart();
        await expect(page).toHaveURL(/\/admin\/chart/);
    });

    test('should navigate to pie chart page', async ({ page }) => {
        const adminPage = new AdminItemsPage(page);
        await adminPage.navigate()
        await adminPage.goToPieChart();
        await expect(page).toHaveURL(/\/admin\/pieChart/);
    });

    test('should logout and redirect to landing page', async ({ page }) => {
        const adminPage = new AdminItemsPage(page);
        await adminPage.navigate()
        await adminPage.logout();
        await expect(page).toHaveURL(`${process.env.BASE_URL}/`);
        //await expect(page).toHaveURL(/\/landing/);
    });
});