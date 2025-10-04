import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
const translations = { en, ar, he}
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]

export class HomePage extends BasePage {
  readonly itemCards: Locator;
  readonly header: Locator;
  readonly article: Locator;
  readonly cartCount: Locator;
  readonly wishListButton: Locator;
  readonly ordersHistoryButton: Locator;
  readonly searchInput: Locator;
  readonly sortOption: Locator;
  

  constructor(page: Page) {
    super(page, '/home');
    this.itemCards = page.locator('article');
    this.header = page.locator(`h1:has-text(${t.homeUserDashboard})`);
    this.article = page.locator('article');
    this.cartCount = page.getByTestId('cart-count');
    this.wishListButton = page.getByLabel(`${t.wishlist}`);
    this.ordersHistoryButton = page.getByLabel(`${t.ordersHistory}`);
    this.searchInput = page.getByLabel(`${t.searchPlaceholder}`);
    this.sortOption = page.getByLabel('sort results');
  }

  async waitForHeader(): Promise<void> {
    await this.header.waitFor({ state: 'visible' });
  }

  async waitForItemsToLoad(): Promise<void> {
    await this.article.first().waitFor({ state: 'visible' });
  }

  getAllItems(): Locator {
    return this.itemCards;
  }

  getFirstItem(): Locator {
    return this.itemCards.first();
  }

  getItemByIndex(index: number): Locator {
    return this.itemCards.nth(index);
  }

  getItemTitle(item: Locator): Locator {
    return item.locator('h2.font-semibold');
  }

  getItemPrice(item: Locator): Locator {
    return item.locator('p.text-blue-600');
  }

  getItemImage(item: Locator): Locator {
    return item.locator('img');
  }

  getItemViewDetailsBtn(item: Locator): Locator {
    return item.getByRole('button', { name: t.viewDetails});
  }

  getItemWishBtn(item: Locator): Locator {
    return item.getByRole('button', { name: t.wish });
  }

  getCart(): Locator {
    return this.cartCount;
  }

  getWishListButton(): Locator {
    return this.wishListButton;
  }

  getOrdersHistoryButton(): Locator {
    return this.ordersHistoryButton;
  }

  getSearchInput(): Locator {
    return this.searchInput;
  }

  async searchKeyword(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
  }

  async getProductTitles(): Promise<string[]> {
    return await this.page.$$eval('h2.font-semibold', items =>
      items.map(item => item.textContent?.toLowerCase().trim() || '')
    );
  }

  async getProductPrices(): Promise<number[]> {
    return await this.page.$$eval('p.text-blue-600 font-bold text-lg', items =>
      items.map(item => Number(item.textContent) || 0)
    );
  }

  getSortOption(): Locator {
    return this.sortOption;
  }

  async sortByOption(option: string): Promise<void> {
    await this.sortOption.selectOption(option);
  }
}