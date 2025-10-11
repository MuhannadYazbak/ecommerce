import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage'
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
const translations = { en, ar, he}
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]

export class RegisterPage extends BasePage {
    readonly h1: Locator
    readonly nameLocator: Locator
    readonly arNameLocator: Locator
    readonly heNameLocator: Locator
    readonly emailLocator: Locator
    readonly passwordLocator: Locator
    readonly dobLocator: Locator
    readonly submitButton: Locator
    constructor(page: Page) {
        super(page, '/register')
        this.h1 = page.locator('#register-heading')
        this.nameLocator = page.locator('#register-name')
        this.arNameLocator = page.locator('#register-name-arabic')
        this.heNameLocator = page.locator('#register-name-hebrew')
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

    async fillArName(name: string): Promise<void> {
        const nameInput = this.arNameLocator
        await nameInput.fill(name)
    }

    async fillHeName(name: string): Promise<void> {
        const nameInput = this.heNameLocator
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

    async registerAs(name: string, arName: string, heName: string, email: string, password: string, dob: Date, shouldRedirect = true): Promise<void> {
        await this.fillName(name)
        await this.fillArName(arName)
        await this.fillHeName(heName)
        await this.fillEmail(email)
        await this.fillPassword(password)
        await this.fillDOB(dob)
        await this.submitButton.click()
        if (shouldRedirect){
            await this.page.waitForURL(url => !url.pathname.includes('/register'))
        }
    }
}