import { test, expect } from '@playwright/test';
import { AdminItemsPage } from '../logic/AdminDashboardPage'
import { annotateTest } from "../utils/annotate";
import { Item } from '@/types/item';
import { TranslatedItem } from '@/types/translatedItem';

test.describe('Admin Items Dashboard', () => {
    let adminPage: AdminItemsPage
    let mockItems: Item[];
    test.use({ storageState: 'auth.admin.json' })


    test.beforeEach(async ({ page }) => {
        mockItems = [
            { id: 1, name: 'Mock Item', description: 'Test', price: 100, quantity: 5, photo: '/mock.jpg' },
            { id: 2, name: 'Another Item', description: 'Test 2', price: 150, quantity: 3, photo: '/mock2.jpg' },
        ];

        await page.route('**/api/items*', async route => {
            const method = route.request().method();
            const url = route.request().url();

            if (method === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockItems),
                });
            } else if (method === 'DELETE') {
                const id = Number(url.split('/').pop());
                mockItems = mockItems.filter(item => item.id !== id);
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
        await adminPage.navigate();
    });

    // test.beforeEach(async ({ page }) => {
    //     await page.route('**/api/items', async route => {
    //         const method = route.request().method();
    //         if (method === 'GET') {
    //             await route.fulfill({
    //                 status: 200,
    //                 contentType: 'application/json',
    //                 body: JSON.stringify(mockItems),
    //             });
    //         } else if (method === 'DELETE') {
    //             //const body = await route.request().postDataJSON();
    //             //const id = body.item_id;
    //             const url = route.request().url();
    //             const id = Number(url.split('/').pop());

    //             mockItems = mockItems.filter(item => item.id !== Number(id));
    //             console.log('beforeEach DELETE')
    //             await route.fulfill({
    //                 status: 200,
    //                 contentType: 'application/json',
    //                 body: JSON.stringify({ success: true }),
    //             });
    //         } else {
    //             await route.continue();
    //         }
    //     });
    //     // await page.route('**/api/items', async route => {
    //     //     await route.fulfill({
    //     //         status: 200,
    //     //         contentType: 'application/json',
    //     //         body: JSON.stringify(mockItems),
    //     //     });
    //     // });
    //     adminPage = new AdminItemsPage(page);
    //     await adminPage.navigate()
    //     //await page.waitForLoadState('networkidle')
    // });

    test('should navigate to new item page', async ({ page }) => {
        annotateTest({ feature: 'AdminDashboardPage' })
        await adminPage.addItem();
        await expect(page).toHaveURL(/\/admin\/items\/new/);

    });

    test('should view details of nth item', async ({ page }) => {
        annotateTest({ feature: 'AdminDashboardPage' })
        await page.route(`**/api/items/${mockItems[0].id}`, async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockItems[0])
            });
        });
        await adminPage.viewItem(0);
        await expect(page).toHaveURL(/\/admin\/items\/\d+/);
    });

    // test('should delete the first item', async ({ page }) => {
    //     annotateTest({ feature: 'AdminDashboardPage' })
    //     //page.on('dialog', async dialog => {
    //     //await page.screenshot({ path: './test-screenshots/new/checkoutDialog.png' })

    //     //await page.unroute('**')
    //     // let myMockItems: Item[] = [
    //     //     { id: 1, name: 'Mock Item', description: 'Test', price: 100, quantity: 5, photo: '/mock.jpg' },
    //     //     { id: 2, name: 'Another Item', description: 'Test 2', price: 150, quantity: 3, photo: '/mock2.jpg' },
    //     // ];

    //     // await page.route('**/api/items*', async route => {
    //     //     const method = route.request().method();
    //     //     if (method === 'GET') {
    //     //         await route.fulfill({
    //     //             status: 200,
    //     //             contentType: 'application/json',
    //     //             body: JSON.stringify(myMockItems),
    //     //         });
    //     //     } else if (method === 'DELETE') {
    //     //         const url = route.request().url();
    //     //         const id = Number(url.split('/').pop());
    //     //         myMockItems = myMockItems.filter(item => item.id !== id);
    //     //         await route.fulfill({
    //     //             status: 200,
    //     //             contentType: 'application/json',
    //     //             body: JSON.stringify({ success: true }),
    //     //         });
    //     //     } else {
    //     //         await route.continue();
    //     //     }
    //     // });
    //     // adminPage = new AdminItemsPage(page)
    //     // await adminPage.navigate()
    //     // const itemToRemoveLocator = await page.locator('#item-article').nth(0);
    //     const totalCountBefore = await page.locator('#item-article').count();
    //     await page.screenshot({ path: './test-screenshots/before-delete.png' })
    //     await adminPage.removeItem(0);
    //     await adminPage.refresh();
    //     //await page.waitForTimeout(500);
    //     await page.screenshot({ path: './test-screenshots/after-delete-instant.png' })
    //     await expect(page.locator('#item-article')).toHaveCount(totalCountBefore - 1);
    // });

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