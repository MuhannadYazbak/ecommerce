import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage'

export class RegisterPage extends BasePage {
    constructor(page: Page) {
        super(page, '/register')
    }

    async waitForHeader(): Promise<void> {
        await this.waitForSelector('h1:has-text("Create")')
    }

    async fillName(name: string): Promise<void> {
        const nameInput = this.page.locator('#register-name');
        await nameInput.fill(name)
    }

    async fillEmail(email: string): Promise<void> {
        const emailInput = this.page.locator('#register-email');
        await emailInput.fill(email)
    }

    async fillPassword(password: string): Promise<void> {
        const passwordInput = this.page.locator('#register-password')
        await passwordInput.fill(password)
    }

    async fillDOB(dob: Date): Promise<void> {
        const dobInput = this.page.locator('#register-dob');
        await dobInput.fill(dob.toISOString().split('T')[0])
    }

    async registerAs(name: string, email: string, password: string, dob: Date): Promise<void> {
        await this.fillName(name)
        await this.fillEmail(email)
        await this.fillPassword(password)
        await this.fillDOB(dob)
        await Promise.any([
            this.page.locator('button[type="submit"]').click(),
            this.page.waitForURL(url => !url.pathname.includes('/register'))
        ]);
    }

    // async back(): Promise<void> {
    //     const backBtn = this.page.locator('text=back')
    //     await backBtn.click()
    // }
}