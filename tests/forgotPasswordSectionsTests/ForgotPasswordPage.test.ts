import { test, expect } from '@playwright/test'
import { ForgotPasswordPage } from '../logic/ForgotPasswordPage'
import { annotateTest } from '../utils/annotate'

let forgotPasswordPage: ForgotPasswordPage
const email = 'test@example.com'

test.describe('Forgot My Password Page validations', () => {
    test.beforeEach(async ({ page }) => {
        forgotPasswordPage = new ForgotPasswordPage(page)
        await forgotPasswordPage.navigate()
        // await page.waitForLoadState('networkidle')
        // await forgotPasswordPage.waitForHeader()
    })

    test('✅ Input filled Correctly', async ({ page }) => {
        annotateTest({ feature: 'ForgotPasswordPage' })
        await page.screenshot({path: 'test-screenshots/new/forgotPasswordPageLoad.png'})
        await forgotPasswordPage.fillEmail(email)
        const filled = await forgotPasswordPage.getEmail()
        expect(filled).toBe(email)
    })

    test('🤦‍♂️ Forgot my password submitted with valid email', async ({ page }) => {
        annotateTest({ feature: 'ForgotPasswordPage' })
        // Intercept alert
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('If this email exists, a reset link has been sent.');
            await dialog.dismiss();
        });
        await page.screenshot({path: 'test-screenshots/new/ForgotWithvalidEmail.png'})
        await forgotPasswordPage.submitForm(email)
    })

        test('🤦‍♂️ Forgot my password submitted with ❌ invalid email', async ({ page }) => {
        annotateTest({ feature: 'ForgotPasswordPage' })
        // Intercept alert
        page.on('dialog', async error => {
            expect(error.message()).toContain('Email not found');
            await error.dismiss();
        });
        await page.screenshot({path: 'test-screenshots/new/ForgotWithinvalidEmail.png'})
        await forgotPasswordPage.submitForm(email)
    })
})