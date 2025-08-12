import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

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
    this.addItemBtn = page.locator('button:has-text("Add New Item")');
    this.ordersListLink = page.locator('button:has-text("Orders List")');
    this.barChartLink = page.locator('button:has-text("Bar Chart")');
    this.pieChartLink = page.locator('button:has-text("Pie Chart")');
    this.logoutBtn = page.locator('button#logout');
  }

  async removeItem(index: number): Promise<void> {
    await this.page.locator(`button:has-text("Delete Item")`).nth(index).click();
  }

  async viewItem(index: number): Promise<void> {
    await this.page.locator(`button:has-text("View Item")`).nth(index).click()
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