import { test, expect } from '@playwright/test';
import { AdminItemsPage } from './logic/AdminDashboardPage'
import { annotateTest } from "./utils/annotate";

test.describe('Admin Items Dashboard', () => {
    let adminPage: AdminItemsPage
    let mockItems = [
        { id: 1, name: 'Mock Item', description: 'Test', price: 100, quantity: 5, photo: '/mock.jpg' },
        { id: 2, name: 'Another Item', description: 'Test 2', price: 150, quantity: 3, photo: '/mock2.jpg' },
    ];
    test.use({ storageState: 'auth.admin.json' })
    test.beforeEach(async ({ page }) => {
        await page.route('**/api/items**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockItems),
            });
        });
        adminPage = new AdminItemsPage(page);
        await adminPage.navigate()
        //await page.waitForLoadState('networkidle')
    });

    test('should navigate to new item page', async ({ page }) => {
        annotateTest({ feature: 'AdminDashboardPage' })
        await adminPage.addItem();
        await expect(page).toHaveURL(/\/admin\/items\/new/);
    });

    test('should view details of nth item', async ({ page }) => {
        annotateTest({ feature: 'AdminDashboardPage' })
        await adminPage.viewItem(0);
        await expect(page).toHaveURL(/\/admin\/items\/\d+/);
    });

    test('should delete the first item', async ({ page }) => {
        annotateTest({ feature: 'AdminDashboardPage' })
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
        adminPage = new AdminItemsPage(page);
        await adminPage.navigate()
        await page.waitForSelector('#item-article')
        const totalCountBefore = await page.locator('#item-article').count();
        await page.screenshot({ path: './test-screenshots/before-delete.png' })
        await adminPage.removeItem(0);
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: './test-screenshots/after-delete.png' })
        const totalCountAfter = await page.locator('#item-article').count();
        expect(Number(totalCountAfter)).toBeLessThan(Number(totalCountBefore));
    });

    test('should navigate to orders list', async ({ page }) => {
        annotateTest({ feature: 'AdminDashboardPage' })
        await adminPage.goToOrdersList();
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveURL(/\/admin\/orders-list/);
    });

    test('should navigate to bar chart page', async ({ page }) => {
        annotateTest({ feature: 'AdminDashboardPage' })
        await adminPage.goToBarChart();
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveURL(/\/admin\/chart/);
    });

    test('should navigate to pie chart page', async ({ page }) => {
        annotateTest({ feature: 'AdminDashboardPage' })
        await adminPage.goToPieChart();
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveURL(/\/admin\/pieChart/);
    });

    test('should logout and redirect to landing page', async ({ page }) => {
        annotateTest({ feature: 'AdminDashboardPage' })
        await adminPage.logout();
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveURL(`${process.env.BASE_URL}/`);
    });
});