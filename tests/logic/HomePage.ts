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

    getWishListButton(): Locator {
        return this.page.getByLabel('WishList');
    }

    getOrdersHistoryButton(): Locator {
        return this.page.getByLabel('Orders History')
    }

    getSearchInput(): Locator {
        return this.page.getByLabel('search keyword')
    }
    async searchKeyword(keyword : string) : Promise<void> {
        const searchInput = this.getSearchInput()
        await searchInput.fill(keyword)
        //await searchInput.press('enter')
    }

    async getProductTitles(): Promise<string[]> {
        return await this.page.$$eval('h2.font-semibold', items =>
            items.map(item => item.textContent?.toLowerCase().trim() || ''))
    }

    async getProductPrices(): Promise<number[]> {
        return await this.page.$$eval('p.text-blue-600 font-bold text-lg', items =>
            items.map(item => Number(item.textContent)|| 0))
    }

    getSortOption() : Locator {
        return this.page.getByLabel('sort results')
    }

    async sortByOption(option : string) : Promise<void> {
        const sort = this.getSortOption()
        await sort.selectOption(option)
    }

    // getCartItemsCount(): number {
    //     return this.page.getByLabel('Cart Items Count').count();
    // }
}