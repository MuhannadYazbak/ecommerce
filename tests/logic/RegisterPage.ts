import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage'

export class RegisterPage extends BasePage {
    readonly h1: Locator
    readonly nameLocator: Locator
    readonly emailLocator: Locator
    readonly passwordLocator: Locator
    readonly dobLocator: Locator
    readonly submitButton: Locator
    constructor(page: Page) {
        super(page, '/register')
        this.h1 = page.locator('#register-heading')
        this.nameLocator = page.locator('#register-name')
        this.emailLocator = page.locator('#register-email')
        this.passwordLocator = page.locator('#register-password')
        this.dobLocator = page.locator('#register-dob')
        this.submitButton = this.page.locator('button[type="submit"]')
    }

    async waitForHeader(): Promise<void> {
        await this.h1.waitFor({ state: 'visible' });
    }

    async fillName(name: string): Promise<void> {
        const nameInput = this.nameLocator
        await nameInput.fill(name)
    }

    async fillEmail(email: string): Promise<void> {
        const emailInput = this.emailLocator
        await emailInput.fill(email)
    }

    async fillPassword(password: string): Promise<void> {
        const passwordInput = this.passwordLocator
        await passwordInput.fill(password)
    }

    async fillDOB(dob: Date): Promise<void> {
        const dobInput = this.dobLocator
        await dobInput.fill(dob.toISOString().split('T')[0])
    }

    async registerAs(name: string, email: string, password: string, dob: Date, shouldRedirect = true): Promise<void> {
        await this.fillName(name)
        await this.fillEmail(email)
        await this.fillPassword(password)
        await this.fillDOB(dob)
        await this.submitButton.click()
        if (shouldRedirect){
            await this.page.waitForURL(url => !url.pathname.includes('/register'))
        }
    }
}