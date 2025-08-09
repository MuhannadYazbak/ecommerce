import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  readonly header: Locator
  readonly emailLocator: Locator
  readonly passwordLocator: Locator
  readonly submitButton: Locator
  constructor(page: Page) {
    super(page, '/login')
    this.header = page.locator('h1')
    this.emailLocator = page.locator('#login-email')
    this.passwordLocator = page.locator('#login-password')
    this.submitButton = page.locator('button[type="submit"]')
  }

  async waitForHeader(): Promise<void> {
    await this.header.waitFor({ state: 'visible' });
  }

  async fillEmail(email: string): Promise<void> {
    const emailInput = this.emailLocator
    await emailInput.fill(email)
  }

  async fillPassword(password: string): Promise<void> {
    const passwordInput = this.passwordLocator
    await passwordInput.fill(password)
  }

  async loginAs(email: string, password: string): Promise<void> {
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.submitButton.click(),
    await this.page.waitForURL(url => !url.pathname.includes('/login'))
  }
}