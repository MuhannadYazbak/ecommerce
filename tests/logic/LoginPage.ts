import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page, '/login')
  }

  async waitForHeader(): Promise<void> {
    await this.waitForSelector('h1')
  }

  async fillEmail(email : string): Promise<void> {
    const emailInput= this.page.locator('#login-email');
    await emailInput.fill(email)
  }

  async fillPassword(password : string): Promise<void> {
    const passwordInput= this.page.locator('#login-password')
    await passwordInput.fill(password)
  }

  async loginAs(email : string, password: string) : Promise<void> {
    await this.fillEmail(email)
    await this.fillPassword(password)
    await Promise.any([
      this.page.locator('button[type="submit"]').click(),
      this.page.waitForURL(url => !url.pathname.includes('/login'))
  ]);
  }

  // async back() : Promise<void> {
  //   const backBtn = this.page.locator('text=back')
  //   await backBtn.click()
  // }
}