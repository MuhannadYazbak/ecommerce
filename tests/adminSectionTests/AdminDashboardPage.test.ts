import { test, expect } from '@playwright/test';
import { AdminItemsPage } from '../logic/AdminDashboardPage'
import { annotateTest } from "../utils/annotate";
import { Item } from '@/types/item';
import { TranslatedItem } from '@/types/translatedItem';

test.describe('Admin Items Dashboard', () => {
    let adminPage: AdminItemsPage
    let mockItems: TranslatedItem[] = [
        { item_id: 1, name: 'Mock Item', description: 'Test', arName: '', arDescription: '', heName: '', heDescription: '', price: 100, quantity: 5, photo: '/mock.jpg' },
        { item_id: 2, name: 'Another Item', description: 'Test 2', arName: '', arDescription: '', heName: '', heDescription: '', price: 150, quantity: 3, photo: '/mock2.jpg' },
    ];
    test.use({ storageState: 'auth.admin.json' })
    test.beforeEach(async ({ page }) => {
        await page.route('**/api/items', async route => {
            const method = route.request().method();
            if (method === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockItems),
                });
            } else if (method === 'DELETE') {
                const body = await route.request().postDataJSON();
                const id = body.item_id;
                mockItems = mockItems.filter(item => item.item_id !== id);
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true }),
                });
            } else {
                await route.continue();
            }
        });
        // await page.route('**/api/items', async route => {
        //     await route.fulfill({
        //         status: 200,
        //         contentType: 'application/json',
        //         body: JSON.stringify(mockItems),
        //     });
        // });
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
        await page.route(`**/api/items/${mockItems[0].item_id}`, async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockItems[0])
            });
        });
        await adminPage.viewItem(0);
        await expect(page).toHaveURL(/\/admin\/items\/\d+/);
    });

    test('should delete the first item', async ({ page }) => {
        annotateTest({ feature: 'AdminDashboardPage' })
        let myMockItems : TranslatedItem[] = [
            { item_id: 1, name: 'Mock Item', description: 'Test', arName: '', arDescription: '', heName: '', heDescription: '', price: 100, quantity: 5, photo: '/mock.jpg' },
            { item_id: 2, name: 'Another Item', description: 'Test 2', arName: '', arDescription: '', heName: '', heDescription: '', price: 150, quantity: 3, photo: '/mock2.jpg' },
        ];
        await page.route('**/api/items**', async route => {
            if (route.request().method() === 'GET') {
                console.log('✅ GET /api/items intercepted');
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(myMockItems),
                });
            } else {
                await route.continue();
            }
        });

        await page.route(`**/api/items/*`, async route => {
            const method = route.request().method();
            if (method === 'DELETE') {
                console.log('DELETE is Called !!!!')
                const body = await route.request().postDataJSON();
                const url = route.request().url()
                const id = Number(url.split('/').pop())
                myMockItems = myMockItems.filter(item => item.item_id !== id);
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true }),
                });
            } else {
                await route.continue();
            }
        });
        await page.waitForSelector('#item-article')
        const totalCountBefore = await page.locator('#item-article').count();
        await page.screenshot({ path: './test-screenshots/before-delete.png' })
        await adminPage.removeItem(0);
        //await adminPage.refresh();
        await page.waitForTimeout(500);
        //await page.waitForLoadState('networkidle');
        await page.screenshot({ path: './test-screenshots/after-delete.png' })
        const totalCountAfter = await page.locator('#item-article').count();
        //const totalCountAfter = mockItems.length
        console.log('before delete page had ', totalCountBefore, ' items, but after delete it is ', totalCountAfter);
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