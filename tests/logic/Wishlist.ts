import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage'
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
const translations = { en, ar, he}
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]

export class WishlistPage extends BasePage {
    readonly heading: Locator;
    readonly emptyMessage: Locator;
    readonly wishlistItems: Locator;
    readonly viewButtons: Locator;
    readonly removeButtons: Locator;


    constructor(page: Page) {
        super(page, '/wish');
        this.heading = page.locator('[aria-label="wish-heading"]');
        this.emptyMessage = page.locator('[aria-label="Empty Wishlist"]');
        this.wishlistItems = page.locator('[role="wishlist item"]'); // Each item card
        this.viewButtons = page.locator(`button:has-text(${t.viewPurchase})`);
        this.removeButtons = page.locator(`button:has-text(${t.remove})`);
    }

    async getHeadingText(): Promise<string> {
        return await this.heading.textContent() ?? '';
    }

    async waitForItems(timeout = 3000): Promise<Locator | null> {
        try {
            await this.page.waitForSelector('[role="wishlist item"]', {
                state: 'visible',
                timeout,
            });
            console.log('📦 Wishlist items are visible');
            return this.page.locator('[role="wishlist item"]')
        } catch (err) {
            console.log('📭 No wishlist items appeared within timeout');
            return null
        }
    }

    async isWishlistEmpty(): Promise<boolean> {
        return await this.emptyMessage.isVisible();
    }

    async getWishlistCount(): Promise<number> {
        return await this.wishlistItems.count();
    }

    async viewItem(index: number): Promise<void> {
        await this.viewButtons.nth(index).click();
    }

    async removeItem(index: number): Promise<void> {
        await this.removeButtons.nth(index).click({ force: true });
    }
}