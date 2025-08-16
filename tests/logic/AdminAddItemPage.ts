import { Dialog, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export default class AddItemPage extends BasePage {
    readonly createItemButton: Locator;
    readonly accessDenied: Locator;

    constructor(page: Page) {
        super(page, '/admin/items/new');
        this.createItemButton = page.locator('button:has-text("Create Item")');
        this.accessDenied = page.locator('text=⛔ Access denied. Admins only.');
    }

    itemField = (fieldName: string): Locator =>
        this.page.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);

    async fillName(name: string): Promise<void> {
        await this.itemField('name').fill(name);
    }

    async fillPrice(price: number): Promise<void> {
        await this.itemField('price').fill(price.toString());
    }

    async fillDescription(description: string): Promise<void> {
        await this.itemField('description').fill(description);
    }

    async fillQuantity(quantity: number): Promise<void> {
        await this.itemField('quantity').fill(quantity.toString());
    }

    async fillPhoto(photoUrl: string): Promise<void> {
        await this.itemField('photo').fill(photoUrl);
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