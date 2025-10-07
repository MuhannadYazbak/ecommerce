import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Address } from '@/types/address';
import { PaymentDetails } from '@/types/payment';
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
const translations = { en, ar, he}
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]

export class CheckoutPage extends BasePage {
  readonly nameInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly cvvInput: Locator;
  readonly cityInput: Locator;
  readonly streetInput: Locator;
  readonly postalCodeInput: Locator;
  readonly locateMeButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page, selectedItems: number[]) {
    const query = selectedItems.length > 0
      ? `?selected=${selectedItems.join(',')}`
      : '';
    super(page, `/checkout${query}`);


    this.nameInput = page.locator('input[name="name"]');
    this.cardNumberInput = page.locator('input[name="cardNumber"]');
    this.expiryMonthInput = page.locator('input[name="expiryMonth"]');
    this.expiryYearInput = page.locator('input[name="expiryYear"]');
    this.cvvInput = page.locator('input[name="cvv"]');
    this.cityInput = page.locator('input[name="city"]');
    this.streetInput = page.locator('input[name="street"]');
    this.postalCodeInput = page.locator('input[name="postalcode"]');
    this.locateMeButton = page.locator(`button[role='useMyLocation']`);
    this.submitButton = page.locator('#pay-now');
  }

  async fillPaymentDetails(details : PaymentDetails) {
    await this.nameInput.fill(details.name);
    await this.cardNumberInput.fill(details.cardNumber);
    await this.expiryMonthInput.fill(details.expiryMonth);
    await this.expiryYearInput.fill(details.expiryYear);
    await this.cvvInput.fill(details.cvv);
  }

  async fillAddressDetails( details :  Address) {
    await this.cityInput.fill(details.city);
    await this.streetInput.fill(details.street);
    await this.postalCodeInput.fill(details.postalcode);
  }

  async useMyLocation() {
    await this.locateMeButton.click();
  }

  async submitCheckout() {
    await this.submitButton.click();
    //await this.page.waitForLoadState('networkidle')
  }
}