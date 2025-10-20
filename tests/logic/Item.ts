import { Item } from "@/types/item";
import { BasePage } from "./BasePage";
import { Locator, Page } from "@playwright/test";
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
import { TranslatedItem } from "@/types/translatedItem";
const translations = { en, ar, he}
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]


export class ItemPage extends BasePage {
    item: TranslatedItem;
    readonly itemHeading: Locator
    readonly itemName: Locator
    readonly itemPhoto: Locator
    readonly itemDescription: Locator
    // readonly arName: Locator
    // readonly arDescription: Locator
    // readonly heName: Locator
    // readonly heDescription: Locator
    readonly itemPrice: Locator
    readonly itemQuantity: Locator
    readonly addToCartButton: Locator
    readonly soldout: Locator
    readonly quantityIncrease: Locator
    readonly quantityDecrease: Locator
    readonly cartCount: Locator
    constructor(page: Page, item: TranslatedItem) {
        super(page, `${process.env.BASE_URL}/items/${item.item_id}`);
        this.item = item;
        this.itemHeading = this.page.locator('h1[role="item-heading"]')
        this.itemName = this.page.locator('#item-name')
        this.itemPhoto = this.page.locator(`img[alt="Photo of ${this.item.name}"]`)
        this.itemDescription = this.page.locator(`p[role='description']`)
        //this.itemDescription = this.page.locator(`text="${this.item.description}"`)
        // this.arName = this.page.locator(`input[role='arName']`)
        // this.arDescription = this.page.locator(`textarea[role='arDescription']`)
        // this.heName = this.page.locator(`input[role='heName']`)
        // this.heDescription = this.page.locator(`textarea[role='heDescription']`)
        this.itemPrice = this.page.locator(`text="${this.item.price}₪"`)
        this.itemQuantity = this.page.locator('section[aria-label="Purchase Options"] >> span')
        this.addToCartButton = this.page.locator(`button[role='addToCart']`)
        this.soldout = this.page.locator('text=Sold Out')
        this.quantityIncrease = this.page.locator('text=+')
        this.quantityDecrease = this.page.locator('text=-')
        this.cartCount = page.getByTestId('cart-count');

    }

    async waitForHeader(): Promise<void> {
        await this.itemHeading.waitFor({ state: 'visible' });  
    }

    async waitForItemsToLoad(): Promise<void> {
        await this.itemName.waitFor({ state: 'visible' });
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

    validateItem() : TranslatedItem{
        return this.item
    }
}

