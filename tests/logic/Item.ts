import { Item } from "@/types/item";
import { BasePage } from "./BasePage";
import { Locator, Page } from "@playwright/test";


export class ItemPage extends BasePage {
    item: Item;
    readonly itemHeading: Locator
    readonly h1: Locator
    readonly itemName: Locator
    readonly itemPhoto: Locator
    readonly itemDescription: Locator
    readonly itemPrice: Locator
    readonly itemQuantity: Locator
    readonly addToCartButton: Locator
    readonly soldout: Locator
    readonly quantityIncrease: Locator
    readonly quantityDecrease: Locator
    readonly cartCount: Locator
    constructor(page: Page, item: Item) {
        super(page, `${process.env.BASE_URL}/items/${item.id}`);
        this.item = item;
        this.itemHeading = this.page.locator('#item-heading')
        this.h1 = this.page.locator('h1')
        this.itemName = this.page.locator('#item-name')
        this.itemPhoto = this.page.locator(`img[alt="Photo of ${this.item.name}"]`)
        this.itemDescription = this.page.locator(`text="${this.item.description}"`)
        this.itemPrice = this.page.locator(`text="${this.item.price}₪"`)
        this.itemQuantity = this.page.locator('section[aria-label="Purchase Options"] >> span')
        this.addToCartButton = this.page.locator('button:text("Add to Cart")')
        this.soldout = this.page.locator('text=Sold Out')
        this.quantityIncrease = this.page.locator('text=+')
        this.quantityDecrease = this.page.locator('text=-')
        this.cartCount = page.getByTestId('cart-count');

    }

    async waitForHeader(): Promise<void> {
        await this.itemHeading.waitFor({ state: 'visible' });  
    }

    async waitForItemsToLoad(): Promise<void> {
        await this.h1.waitFor({ state: 'visible' });
    }

    async getName() : Promise<Locator> {
        return this.itemName
    }

    async getTitle(): Promise<string> {
        return await this.page.title()
    }

    async getPhoto() : Promise<Locator>{
        return this.itemPhoto
    }

    async getDescription() : Promise<Locator> {
        return this.itemDescription
    }

    async getPriceLabel() : Promise<Locator> {
        return this.itemPrice
    }

    async getQuantityDisplay() : Promise<Locator> {
        return this.itemQuantity
    }

    async getAddToCartButton() : Promise<Locator> {
        return this.addToCartButton
    }

    async getSoldOutComponent() : Promise<Locator> {
        return this.soldout
    }

    async increaseQuantity() : Promise<void>{
        const addBtn = this.quantityIncrease
        await addBtn.click()
    }

    async decreaseQuantity() : Promise<void>{
        const decreaseBtn = this.quantityDecrease
        await decreaseBtn.click()
    }

    getCart(): Locator {
        return this.cartCount
    }

    validateItem() : Item{
        return this.item
    }
}

