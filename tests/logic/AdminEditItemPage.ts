import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AdminItemEditPage extends BasePage {
  readonly updateButton: Locator;
  readonly cancelButton: Locator;
  readonly alertMessage: Locator;
  private itemId : string;

  constructor(page: Page, id: string) {
    super(page, `/admin/items/${id}`);
    this.itemId = id
    this.updateButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.alertMessage = page.locator('.alert-error');
  }

  itemField = (fieldName: string) => this.page.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);

  async loadItemDetails() {
    await this.page.goto(`/admin/items/${this.itemId}`);
  }

  async editField(fieldName: string, value: string) {
    await this.itemField(fieldName).fill(value);
  }

  async clickUpdate() {
    await this.updateButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async getAlertText() {
    return await this.alertMessage.textContent();
  }
}