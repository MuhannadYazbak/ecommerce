import { test, expect } from '@playwright/test';
import { AdminItemsPage } from '../logic/AdminDashboardPage'
import { annotateTest } from "../utils/annotate";
import { Item } from '@/types/item';
import { message } from 'antd';

test.describe('Admin Items Dashboard', () => {
    let adminPage: AdminItemsPage
    test.use({ storageState: 'auth.admin.json' })


    test('should delete the first item', async ({ page }) => {
        let mockItems: Item[] = [
            { id: 111, name: 'Mock Item', description: 'Test', price: 100, quantity: 5, photo: '/mock.jpg' },
            { id: 112, name: 'Another Item', description: 'Test 2', price: 150, quantity: 3, photo: '/mock2.jpg' },
        ];
        await page.context().addInitScript(() => {
            localStorage.setItem('i18nextLng', 'en');
        });


        await page.route('**/api/items*', async route => {
            const method = route.request().method();
            const url = route.request().url();

            if (method === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockItems),
                });
             } else {
                await route.continue();
            }
        })
         await page.route('**/api/items/**', async route => { 
            const method = route.request().method()
            const url = route.request().url()    
          if (method === 'DELETE') {
                const id = Number(url.split('/').pop());
                mockItems = mockItems.filter(item => item.id !== id);
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true, message: 'Item Deleted'
                     }),
                });
            } else {
                await route.continue();
            }
        })
        

        adminPage = new AdminItemsPage(page);
        await adminPage.navigate();
        annotateTest({ feature: 'AdminDashboardPage' })
        page.on('request', req => console.log('➡️', req.method(), req.url()));
        page.on('response', res => console.log('⬅️', res.status(), res.url()));
        await expect(page.locator('#item-article')).toHaveCount(mockItems.length)
        const totalCountBefore = await page.locator('#item-article').count();
        await page.screenshot({ path: './test-screenshots/before-delete.png' })
        await adminPage.removeItem(0);
        await page.waitForResponse(res =>
            res.url().includes('/api/items') && res.request().method() === 'GET'
        );
        //await adminPage.refresh();
        await page.screenshot({ path: './test-screenshots/after-delete-instant.png' })
        await expect(page.locator('#item-article')).toHaveCount(totalCountBefore - 1);
    });

});