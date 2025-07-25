import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage'

export class LandingPage extends BasePage {
  constructor(page: Page) {
    super(page, '/');
  }

  async waitForHeader(): Promise<void> {
    await this.waitForSelector('h1')
  }

  async getItemCards(): Promise<number> {
    const items = this.page.locator('article');
    await expect(items).toHaveCount(5); // optional assertion inside class
    return await items.count();
  }

  async clickLogin(): Promise<void> {
    await this.page.click('text=login');
  }

  async clickRegister(): Promise<void> {
    await this.page.click('text=register');
  }
}