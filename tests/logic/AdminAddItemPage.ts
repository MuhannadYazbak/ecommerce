import { Dialog, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
const translations = { en, ar, he}
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]

export default class AddItemPage extends BasePage {
    readonly createItemButton: Locator;
    readonly accessDenied: Locator;
    enName: Locator;
    enDescritpion: Locator;
    arName: Locator;
    arDescritpion: Locator;
    heName: Locator;
    heDescritpion: Locator;
    price: Locator;
    quantity: Locator;
    photo: Locator;

    constructor(page: Page) {
        super(page, '/admin/items/new');
        this.createItemButton = page.locator(`button[role="addNewItem"]`);
        this.accessDenied = page.locator(`p[role="adminOnly"]`);
        this.enName = page.locator(`input[role='enName']`)
        this.arName = page.locator(`input[role='arName']`)
        this.heName = page.locator(`input[role='heName']`)
        this.enDescritpion = page.locator(`textarea[role='enDescription']`)
        this.arDescritpion = page.locator(`textarea[role='arDescription']`)
        this.heDescritpion = page.locator(`textarea[role='heDescription']`)
        this.price = page.locator(`input[role='price']`)
        this.quantity = page.locator(`input[role='quantity']`)
        this.photo = page.locator(`input[role='photo']`);
    }

    itemField = (fieldName: string): Locator =>
        this.page.locator(`input[name="${fieldName}"]), textarea[name="${fieldName}"]`);

    async fillenName(name: string): Promise<void> {
        await this.enName.fill(name)
    }

    async fillPrice(price: number): Promise<void> {
        await this.price.fill(price.toString());
    }

    async fillenDescription(description: string): Promise<void> {
        await this.enDescritpion.fill(description)
    }

    async fillQuantity(quantity: number): Promise<void> {
        await this.quantity.fill(quantity.toString());
    }

    async fillPhoto(photoUrl: string): Promise<void> {
        await this.photo.fill(photoUrl);
    }

    async fillArName(name: string): Promise<void> {
        await this.arName.fill(name);
    }
    async fillHeName(name: string): Promise<void> {
        await this.heName.fill(name);
    }

    async fillArDescription(description: string): Promise<void> {
        await this.arDescritpion.fill(description)
    }

    async fillHeDescription(description: string): Promise<void> {
        await this.heDescritpion.fill(description)
    }

    async clickCreateItem(): Promise<void> {
        await this.createItemButton.click();
    }

    getAccessDeniedMessage(): Locator {
        return this.accessDenied;
    }

    async waitForRedirectToDashboard(): Promise<void> {
        await this.page.waitForURL(/\/admin\/items$/);
    }

    async waitForCreationFailedAlert(): Promise<Dialog> {
        return await this.page.waitForEvent('dialog');
    }
}