import { test, expect } from '@playwright/test';
import AddItemPage from './logic/AdminAddItemPage'
import { annotateTest } from './utils/annotate';

test.describe('AddItemPage', () => {
    let addItemPage : AddItemPage
    test.use({ storageState: 'auth.admin.json' })
    test.beforeEach(async ({ page }) => {
        // Mock access control and item creation endpoint
        await page.route('**/api/items', async (route, request) => {
            const body = await request.postDataJSON();
            if (body.name === 'fail') {
                return route.abort(); // Simulate failure
            }
            return route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ id: 123, ...body }),
            });
        });
        addItemPage = new AddItemPage(page);
        await addItemPage.navigate();
        await page.waitForLoadState('networkidle');
    });

    test('should create item successfully and redirect', async ({ page }) => {
        annotateTest({ feature: 'AdminAddItemPage' })
        await addItemPage.fillName('New Item');
        await addItemPage.fillPrice(99.99);
        await addItemPage.fillDescription('A great item');
        await addItemPage.fillQuantity(10);
        await addItemPage.fillPhoto('https://example.com/photo.jpg');
        await addItemPage.clickCreateItem();

        await addItemPage.waitForRedirectToDashboard();
        expect(page.url()).toMatch(/\/admin\/items$/);
    });

    test('should show alert on failed item creation', async ({ page }) => {
        annotateTest({ feature: 'AdminAddItemPage' })
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Update failed');
            await dialog.dismiss();
        });
        await addItemPage.fillName('fail');
        await addItemPage.clickCreateItem();
    });
});
