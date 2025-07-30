import { Item } from "@/types/item";
import { BasePage } from "./BasePage";
import { Locator, Page } from "@playwright/test";


export class ItemPage extends BasePage {
    item: Item;

    constructor(page: Page, item: Item) {
        super(page, `${process.env.BASE_URL}/items/${item.id}`);
        this.item = item;
    }

    async waitForHeader() : Promise<Locator> {
        return await this.page.locator('#item-heading');
    }

    async waitForItemsToLoad(): Promise<void> {
        await this.page.waitForSelector('h1');
    }

    async getName() : Promise<Locator> {
        return await this.page.locator('#item-name')
    }

    async getTitle(): Promise<string> {
        return await this.page.title()
    }

    async getPhoto() : Promise<Locator>{
        return await this.page.locator(`img[alt="Photo of ${this.item.name}"]`);
    }

    async getDescription() : Promise<Locator> {
        return await this.page.locator(`text="${this.item.description}"`);
    }

    async getPriceLabel() : Promise<Locator> {
        return await this.page.locator(`text="${this.item.price}₪"`);
    }

    async getQuantityDisplay() : Promise<Locator> {
        return await this.page.locator('section[aria-label="Purchase Options"] >> span');
    }

    async getAddToCartButton() : Promise<Locator> {
        return await this.page.locator('button:text("Add to Cart")');
    }

    async getSoldOutComponent() : Promise<Locator> {
        return await this.page.locator('text=Sold Out'); // Assumes it renders readable text
    }

    async increaseQuantity() : Promise<void>{
        const addBtn = this.page.locator('text=+')
        await addBtn.click()
    }

    async decreaseQuantity() : Promise<void>{
        const decreaseBtn = this.page.locator('text=-')
        await decreaseBtn.click()
    }

    getCart(): Locator {
        return this.page.getByTestId('cart-count')
    }

    async back() : Promise<void> {
        const backBtn = this.page.locator('text=back')
        await backBtn.click()
    }

    validateItem() : Item{
        return this.item
    }
}

