import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";


export class OrdersHistoryPage extends BasePage {
    readonly noOrdersHeading: Locator
    readonly ordersListHeading: Locator
    readonly articles: Locator
    constructor(page: Page) {
        super(page, '/orders')
        this.noOrdersHeading = page.locator('h2#no-orders-heading')
        this.ordersListHeading = page.locator('h2#orders-list-heading')
        this.articles = page.locator('article')
    }

    waitforHeaderEmpty(): Locator {
        return this.noOrdersHeading
    }

    waitforHeaderNotEmpty() {
        return this.ordersListHeading
    }

    getOrders(): Locator {
        return this.articles
    }
}