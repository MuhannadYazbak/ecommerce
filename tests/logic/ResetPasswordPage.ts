import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage'

export class ResetPasswordPage extends BasePage {
    passwordInput: Locator
    confirmPassword: Locator
    readonly header: Locator
    readonly submitBtn: Locator
    constructor(page: Page, token: string) {
        super(page, `/reset-password/${token}`);
        this.header = page.locator('#forgotYourPassowrdTitle')
        this.passwordInput = page.locator('#password')
        this.confirmPassword = page.locator('#confirmPassword')
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
    }

    async waitForHeader(): Promise<void> {
        await this.header.waitFor({ state: 'visible' });
    }

    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async fillConfirmPassword(password: string): Promise<void> {
        await this.confirmPassword.fill(password);
    }

    async arePasswordsMatching(): Promise<boolean> {
        const pass1 = await this.passwordInput.inputValue()
        const pass2 = await this.confirmPassword.inputValue()
        expect(pass1).toBe(pass2); // optional assertion inside class
        return pass1 === pass2
    }

    async clickSubmitBtn(): Promise<void> {
        await expect(this.submitBtn).toBeVisible();
        await expect(this.submitBtn).toBeEnabled();
        await this.submitBtn.click()
    }

    async submitForm(password: string): Promise<void> {
        await this.fillPassword(password);
        await this.fillConfirmPassword(password)
        const flag = await this.arePasswordsMatching()
        expect(flag).toBeTruthy()
        await this.clickSubmitBtn();
    }
}