import { BasePage } from "./BasePage";
import { Page, Locator, expect } from "@playwright/test";

export class CartPage extends BasePage {
    readonly cartItems: Locator
    readonly emptyCart : Locator
    readonly checkoutButton: Locator
    constructor(page: Page) {
        super(page, '/cart')
        this.cartItems = page.locator("section[role='list'] > li[role='listitem']")
        this.emptyCart = this.page.locator("text=Your cart is currently empty.")
        this.checkoutButton = this.page.locator('#checkout')
    }

    async getCartItemsCount(): Promise<number>{
        return await this.cartItems.count()
    }

    async isCartEmpty(): Promise<boolean> {
        await this.emptyCart.waitFor({ state: 'visible' }); // Wait until it's visible
        return await this.emptyCart.isVisible();
    }

    async getDifferentItemsCount(): Promise<number> {
        return await this.cartItems.count()
    }

    async getItemAt(index: number): Promise<Locator> {
        return this.cartItems.nth(index)
    }

    async removeItemAt(index: number): Promise<void> {
        try {
            await this.cartItems.nth(index).locator("button:has-text('Remove')").click();
        }catch(error){
            console.warn(`Failed to remove item at index ${index}:`, error)
        }
    }

    async assertCartHasItems(expectedCount: number) {
        await expect(this.cartItems).toHaveCount(expectedCount);
    }

    async clickItemCheckBoxAtIndex(index: number) : Promise<void> {
        const checkbox = (await this.getItemAt(index)).getByRole('checkbox')
        await checkbox.check()
    }

    async isCheckoutEnabled(): Promise<boolean> {
        return await this.checkoutButton.isEnabled();
    }

    async checkoutSelected() : Promise<void> {
        await this.checkoutButton.click()
    }

}