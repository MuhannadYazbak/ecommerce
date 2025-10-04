import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage'
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
const translations = { en, ar, he}
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]

export class LandingPage extends BasePage {
  readonly header: Locator
  readonly articles: Locator
  readonly login: Locator
  readonly register: Locator
  readonly continueAsGuest: Locator
  constructor(page: Page) {
    super(page, '/');
    this.header = page.locator('#header')
    this.articles = page.locator('article')
    this.login = page.locator(`text=${t.login}`)
    this.register = page.locator(`text=${t.register}`)
    this.continueAsGuest = page.locator('#guest')
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

  async clickContinueAsGuest(): Promise<void> {
    await this.continueAsGuest.click()
  }
}