import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
const translations = { en, ar, he}
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]

export class AdminItemsPage extends BasePage {
  readonly removeItemBtn : Locator
  readonly viewItemBtn : Locator
  readonly addItemBtn : Locator
  readonly ordersListLink : Locator
  readonly barChartLink : Locator
  readonly pieChartLink : Locator
  readonly logoutBtn : Locator
  constructor(page : Page){
    super(page,'/admin/items')
    this.removeItemBtn = page.locator('.btn-remove');
    this.viewItemBtn = page.locator('.btn-view');
    this.addItemBtn = page.locator(`button:has-text(${t.addNewItem})`);
    this.ordersListLink = page.locator(`button:has-text(${t.ordersList})`);
    this.barChartLink = page.locator(`button:has-text(${t.barChart})`);
    this.pieChartLink = page.locator(`button:has-text(${t.pieChart})`);
    this.logoutBtn = page.locator('button#logout');
  }

  async removeItem(index: number): Promise<void> {
    await this.page.locator(`button:has-text(${t.deleteItem})`).nth(index).click();
  }

  async viewItem(index: number): Promise<void> {
    await this.page.locator(`button:has-text(${t.viewItem})`).nth(index).click()
  }

  async addItem() : Promise<void>{
    await this.addItemBtn.click();
  }

  async goToOrdersList() : Promise<void> {
    await this.ordersListLink.click();
  }

  async goToBarChart() : Promise<void> {
    await this.barChartLink.click();
  }

  async goToPieChart() : Promise<void> {
    await this.pieChartLink.click();
  }
}