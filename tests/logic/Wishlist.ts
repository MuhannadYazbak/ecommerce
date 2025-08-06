import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage'

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
        this.viewButtons = page.locator('button:has-text("View/Purchase")');
        this.removeButtons = page.locator('button:has-text("remove")');
    }

    async getHeadingText(): Promise<string> {
        return await this.heading.textContent() ?? '';
    }

    // async waitForItems(): Promise<void> {
    //     const count = await this.wishlistItems.count();
    //     console.log('📦 Wishlist item count:', count);

    //     if (count > 0) {
    //         await this.wishlistItems.first().waitFor({ state: 'visible', timeout: 2000 });
    //     } else {
    //         console.log('📭 No wishlist items to wait for');
    //     }
    // }

    // async waitForItems(): Promise<Locator| null> {
    //     const count = await this.wishlistItems.count()
    //     if (count > 0){
    //         const firstItem = await this.wishlistItems.first()
    //         return  firstItem
    //     } else {
    //         console.log('📭 No wishlist items to wait for')
    //         return null
    //     }
    // }

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
            //throw new Error('❌ Wishlist items did not render');
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