import { test, expect } from '@playwright/test';
import { AdminItemEditPage } from './logic/AdminEditItemPage';
import { annotateTest } from './utils/annotate';

test.use({ storageState: 'auth.admin.json' });

test.describe('Admin Item Edit Page', () => {
    let adminEditItemPage: AdminItemEditPage;
    const testItemId = '2';

    test.beforeEach(async ({ page }) => {
        await page.route(`**/api/items/${testItemId}`, async route => {
            const method = route.request().method();

            if (method === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: testItemId,
                        name: 'Test Item',
                        description: 'Mocked item for testing',
                        price: 100,
                        photo: 'test-photo.jpg',
                        quantity: 10,
                    }),
                });
            } else if (method === 'PUT') {
                const body = await route.request().postDataJSON();
                const { name, description, price, photo, quantity } = body;

                if (
                    typeof name !== 'string' ||
                    typeof description !== 'string' ||
                    typeof price !== 'number' ||
                    typeof photo !== 'string' ||
                    typeof quantity !== 'number'
                ) {
                    await route.fulfill({
                        status: 400,
                        contentType: 'application/json',
                        body: JSON.stringify({ error: 'Bad request' }),
                    });
                    return;
                }

                if (price < 0) {
                    await route.fulfill({
                        status: 400,
                        contentType: 'application/json',
                        body: JSON.stringify({ error: 'Update failed' }),
                    });
                    return;
                }

                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ message: 'Item updated' }),
                });
            } else {
                await route.continue();
            }
        });

        adminEditItemPage = new AdminItemEditPage(page, testItemId);
        await adminEditItemPage.loadItemDetails();
        await page.waitForLoadState('networkidle')
    });

    test('should load item details correctly', async ({ page }) => {
        annotateTest({ feature: 'AdminEditItemPage' });
        await page.screenshot({ path: 'adminEditIem.png' })
        const nameInput = adminEditItemPage.itemField('name');
        await expect(nameInput).toHaveValue('Test Item');
    });

    test('should update item successfully', async ({ page }) => {
        annotateTest({ feature: 'AdminEditItemPage' });
        await adminEditItemPage.editField('name', 'Updated Item Name');
        await adminEditItemPage.clickUpdate();
        await expect(page).toHaveURL('/admin/items');
    });

    // test('should show alert on failed update', async ({ page }) => {
    //     annotateTest({ feature: 'AdminEditItemPage' });
    //     await adminEditItemPage.editField('price', '-999');
    //     await adminEditItemPage.clickUpdate();
    //     // const alertText = await adminEditItemPage.getAlertText();
    //     // expect(alertText).toContain('Update failed');
    //     page.once('dialog', async dialog => {
    //         expect(dialog.message()).toContain('Update failed');
    //         await dialog.dismiss();
    //     });
    // });

    test('should show alert on failed update', async ({ page }) => {
        annotateTest({ feature: 'AdminEditItemPage' });

        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Update failed');
            await dialog.dismiss();
        });

        await adminEditItemPage.editField('price', '-999');
        await adminEditItemPage.clickUpdate();

        // Optional: wait for some visible confirmation or navigation
        await page.waitForTimeout(500); // buffer to keep session alive
    });

    test('should cancel and go back', async ({ page }) => {
        annotateTest({ feature: 'AdminEditItemPage' });
        await adminEditItemPage.clickCancel();
        await expect(page).not.toHaveURL(`/admin/items/${testItemId}`);
    });
});