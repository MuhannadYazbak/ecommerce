import { test, expect } from '@playwright/test';
import { ResetPasswordPage } from '../logic/ResetPasswordPage';
import { annotateTest } from '../utils/annotate';

let resetPasswordPage: ResetPasswordPage;
const token = 'mock-token-123'; // Replace with a real token if needed
const password = 'SecurePass123!';

test.describe('🔐 Reset Password Page validations', () => {
    test.beforeEach(async ({ page }) => {
        resetPasswordPage = new ResetPasswordPage(page, token);
        await resetPasswordPage.navigate();
        await resetPasswordPage.waitForHeader();
    });

    test('✅ Inputs filled correctly', async ({page}) => {
        annotateTest({ feature: 'ResetPasswordPage' });
        await resetPasswordPage.fillPassword(password);
        await resetPasswordPage.fillConfirmPassword(password);
        const match = await resetPasswordPage.arePasswordsMatching();
        expect(match).toBeTruthy();
    });

    test('🔁 Submit form with matching passwords', async ({page}) => {
        annotateTest({ feature: 'ResetPasswordPage' });
        // Intercept alert
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Password reset successfully');
            await dialog.dismiss();
        });
        await resetPasswordPage.submitForm(password);
    });

    // Not allowed to submit when passwords are mismatched
    // test('❌ Submit form with mismatched passwords', async ({page}) => {
    //     annotateTest({ feature: 'ResetPasswordPage' });
    //     // Intercept alert
    //     page.on('dialog', async error => {
    //         expect(error.message()).toContain('Invalid or expired token');
    //         await error.dismiss();
    //     });
    //     await resetPasswordPage.fillPassword(password);
    //     await resetPasswordPage.fillConfirmPassword(password + 'Mismatch');
    //     const match = await resetPasswordPage.arePasswordsMatching();
    //     expect(match).toBeFalsy();
    // });
});