import { BasePage } from "./BasePage";
import { Page, Locator } from "@playwright/test";

export class CartPage extends BasePage {
    private cartItems: Locator
    constructor(page: Page) {
        super(page, '/cart')
        this.cartItems = page.locator("section[role='list'] > li[role='listitem']")
    }

    async getDifferentItemsCount(): Promise<number> {
        return await this.cartItems.count()
    }

    async getItemNameAt(index: number): Promise<string | null> {
        return await this.cartItems.nth(index).locator("h2").textContent();
    }

    async removeItemAt(index: number): Promise<void> {
        await this.cartItems.nth(index).locator("button:has-text('Remove')").click();
    }

    async assertCartHasItems(expectedCount: number) {
        await expect(this.cartItems).toHaveCount(expectedCount);
    }

}