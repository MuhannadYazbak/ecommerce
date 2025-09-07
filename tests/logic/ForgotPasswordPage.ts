import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage'

export class ForgotPasswordPage extends BasePage {
    emailInput: Locator
    readonly header: Locator
    readonly submitBtn: Locator
    constructor(page: Page) {
        super(page, '/forgotPassword');
        this.header = page.locator('#forgotH1')
        this.emailInput = page.locator('#email')
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
        //this.submitBtn = page.locator('#submitBtn')
    }

    async waitForHeader(): Promise<void> {
        await this.header.waitFor({ state: 'visible' });
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async getEmail(): Promise<string> {
        const email = this.emailInput.inputValue()
        expect(email).not.toBe(''); // optional assertion inside class
        return await email ?? ''
    }

    async clickSubmitBtn(): Promise<void> {
        await expect(this.submitBtn).toBeVisible();
        await expect(this.submitBtn).toBeEnabled();
        await this.submitBtn.click()
    }

    async submitForm(email: string): Promise<void> {
        await this.fillEmail(email);
        await this.clickSubmitBtn();
    }
}