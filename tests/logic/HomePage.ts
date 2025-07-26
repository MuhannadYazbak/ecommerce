import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    private itemCards: Locator;

    constructor(page: Page) {
        super(page, '/home');
        this.itemCards = this.page.locator('article');
    }

    async waitForHeader(): Promise<void> {
        await this.waitForSelector('h1:has-text("Welcome to Your TechMart Dashboard")');
    }

    async waitForItemsToLoad(): Promise<void> {
        await this.page.waitForSelector('article');
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
        return item.getByRole('button', { name: /View Details/i });
    }

    getItemWishBtn(item: Locator): Locator {
        return item.getByRole('button', { name: /Wish/i });
    }
     getCart(): Locator {
        console.log('Located Cart is: ', this.page.getByTestId('cart-count').allInnerTexts())
        return this.page.getByTestId('cart-count')
    }

    // getCartItemsCount(): number {
    //     return this.page.getByLabel('Cart Items Count').count();
    // }
}