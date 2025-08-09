import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage'

export class LandingPage extends BasePage {
  readonly header: Locator
  readonly articles: Locator
  readonly login: Locator
  readonly register: Locator
  constructor(page: Page) {
    super(page, '/');
    this.header = page.locator('#header')
    this.articles = page.locator('article')
    this.login = page.locator('text=login')
    this.register = page.locator('text=register')
  }

  async waitForHeader(): Promise<void> {
        await this.header.waitFor({ state: 'visible' });  
    }

  async getItemCards(): Promise<number> {
    const items = this.articles
    await expect(items).toHaveCount(5); // optional assertion inside class
    return await items.count();
  }

  async clickLogin(): Promise<void> {
    await this.login.click()
  }

  async clickRegister(): Promise<void> {
    await this.register.click()
  }
}