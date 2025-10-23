import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
const translations = { en, ar, he }
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]

export class AdminItemEditPage extends BasePage {
  readonly updateButton: Locator;
  readonly cancelButton: Locator;
  readonly alertMessage: Locator;
  private itemId: number;
  enName: Locator;
  enDescritpion: Locator;
  arName: Locator;
  arDescritpion: Locator;
  heName: Locator;
  heDescritpion: Locator;
  price: Locator;
  quantity: Locator;
  photo: Locator;

  constructor(page: Page, id: number) {
    super(page, `/admin/items/${id}`);
    this.itemId = id
    this.updateButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator(`[data-testid='cancel']`);
    this.alertMessage = page.locator('.alert-error');
    this.enName = page.locator(`[data-testid='enName']`)
    this.arName = page.locator(`[data-testid='arName']`)
    this.heName = page.locator(`[data-testid='heName']`)
    this.enDescritpion = page.locator(`[data-testid='enDescription']`)
    this.arDescritpion = page.locator(`[data-testid='arDescription']`)
    this.heDescritpion = page.locator(`[data-testid='heDescription']`)
    this.price = page.locator(`[data-testid='price']`)
    this.quantity = page.locator(`[data-testid='quantity']`)
    this.photo = page.locator(`[data-testid='photo']`);
  }

  //itemField = (fieldName: string) => this.page.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);

  async loadItemDetails() {
    await this.page.goto(`/admin/items/${this.itemId}`);
  }

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

  // async editField(fieldName: string, value: string) {
  //   await this.itemField(fieldName).fill(value);
  // }

  async clickUpdate() {
    await this.updateButton.click();
  }

  async clickCancel() {
    await this.cancelButton.waitFor({state: 'visible'})
    await this.cancelButton.click()
  }

  async getAlertText() {
    return await this.alertMessage.textContent();
  }
}